import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";
import { publicRobotsPolicyMatches, siteIndexingEnabled } from "../src/server/launch-policy";
import { loginLimitKeys } from "../src/server/auth/rate-limit";
import { hashPassword, verifyPassword } from "../src/server/auth/password";

test("Indexing requires an explicit launch flag and the canonical HTTPS production origin", () => {
  const ready = { NODE_ENV: "production", SITE_INDEXING_ENABLED: "true", AUTH_URL: "https://bitmasonlabs.com" };
  assert.ok(siteIndexingEnabled(ready));
  assert.equal(siteIndexingEnabled({ NODE_ENV: "production", AUTH_URL: "https://bitmasonlabs.com" }), false);
  for (const overrides of [
    { SITE_INDEXING_ENABLED: "" }, { SITE_INDEXING_ENABLED: "false" }, { SITE_INDEXING_ENABLED: "TRUE" },
    { NODE_ENV: "development" }, { AUTH_URL: "http://localhost:3000" }, { AUTH_URL: "http://bitmasonlabs.com" },
    { AUTH_URL: "https://bitmasonlabs.com/admin" }, { AUTH_URL: "https://user:password@bitmasonlabs.com" },
    { AUTH_URL: "https://bitmasonlabs.com?preview=true" }, { AUTH_URL: "https://bitmasonlabs.com#preview" },
  ]) assert.equal(siteIndexingEnabled({ ...ready, ...overrides }), false);
  assert.equal(siteIndexingEnabled({ ...ready, VERCEL: "1" }), false);
  assert.equal(siteIndexingEnabled({ ...ready, VERCEL: "1", VERCEL_ENV: "preview" }), false);
  assert.equal(siteIndexingEnabled({ ...ready, VERCEL_ENV: "development" }), false);
  assert.ok(siteIndexingEnabled({ ...ready, VERCEL: "1", VERCEL_ENV: "production" }));
});

test("Launch verification rejects stale noindex HTML and conflicting crawler headers", () => {
  const blockedHeaders = new Headers({ "X-Robots-Tag": "noindex, nofollow" });
  const blockedHtml = '<meta name="robots" content="noindex, nofollow">';
  const publicHtml = "<META content='index, follow' name='robots'>";
  assert.ok(publicRobotsPolicyMatches(blockedHeaders, blockedHtml, false));
  assert.ok(publicRobotsPolicyMatches(new Headers(), publicHtml, true));
  assert.equal(publicRobotsPolicyMatches(new Headers(), blockedHtml, true), false);
  assert.equal(publicRobotsPolicyMatches(blockedHeaders, publicHtml, true), false);
  assert.equal(publicRobotsPolicyMatches(new Headers({ "X-Robots-Tag": "googlebot: none" }), publicHtml, true), false);
  assert.equal(publicRobotsPolicyMatches(new Headers(), `${publicHtml}<meta name="googlebot" content="noindex">`, true), false);
  assert.equal(publicRobotsPolicyMatches(new Headers(), "<title>Ready</title>", true), false);
  assert.equal(publicRobotsPolicyMatches(blockedHeaders, publicHtml, false), false);
});

test("Untrusted forwarded headers cannot create new login budgets; stored keys hide client addresses", () => {
  const previous = { AUTH_SECRET: process.env.AUTH_SECRET, VERCEL: process.env.VERCEL };
  try {
    process.env.AUTH_SECRET = randomBytes(32).toString("base64url");
    delete process.env.VERCEL;
    const request = (headers: HeadersInit = {}) => new Request("https://bitmasonlabs.com/admin/login", { headers });
    const shared = loginLimitKeys(request());
    assert.deepEqual(loginLimitKeys(request({ "x-forwarded-for": "192.0.2.1", "x-vercel-forwarded-for": "192.0.2.2" })), shared);
    process.env.VERCEL = "1";
    const first = loginLimitKeys(request({ "x-vercel-forwarded-for": "192.0.2.1" }));
    const second = loginLimitKeys(request({ "x-vercel-forwarded-for": "192.0.2.2" }));
    assert.equal(first.global, second.global);
    assert.notEqual(first.client, second.client);
    for (const value of Object.values(first)) assert.match(value, /^[a-f0-9]{64}$/);
    assert.deepEqual(loginLimitKeys(request({ "x-vercel-forwarded-for": "malformed" })), shared);
    assert.deepEqual(loginLimitKeys(request({ "x-vercel-forwarded-for": "2001:db8::1" })), loginLimitKeys(request({ "x-vercel-forwarded-for": "2001:0db8:0000:0000:0000:0000:0000:0001" })));
  } finally {
    for (const [name, value] of Object.entries(previous)) { if (value === undefined) delete process.env[name]; else process.env[name] = value; }
  }
});

test("Password verification preserves punctuation, rejects altered input and never needs owner credentials", async () => {
  const password = `${randomBytes(24).toString("base64url")}!$`;
  const hash = await hashPassword(password);
  assert.ok(await verifyPassword(password, hash));
  assert.equal(await verifyPassword(password.slice(0, -1), hash), false);
  assert.equal(await verifyPassword(password, "unsupported"), false);
});
