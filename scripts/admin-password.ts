import { hashPassword } from "../src/server/auth/password";

async function readPassword(): Promise<string> {
  if (!process.stdin.isTTY) {
    let text = "";
    for await (const chunk of process.stdin) text += chunk;
    return text.replace(/\r?\n$/, "");
  }
  process.stderr.write("Admin password (at least 12 characters; input hidden): ");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve) => {
    let text = "";
    process.stdin.on("data", (chunk: Buffer) => {
      for (const char of chunk.toString()) {
        if (char === "\u0003") process.exit(1);
        if (char === "\r" || char === "\n") {
          process.stdin.setRawMode(false); process.stdin.pause(); process.stderr.write("\n"); resolve(text); return;
        }
        if (char === "\u007f" || char === "\b") text = text.slice(0, -1);
        else if (char >= " " && text.length < 257) text += char;
      }
    });
  });
}

async function main() {
  const password = await readPassword();
  if (password.length < 12 || password.length > 256) {
    process.stderr.write("Use a password between 12 and 256 characters.\n"); process.exit(1);
  }
  console.log(await hashPassword(password));
}
main().catch(() => { console.error("Unable to generate the password hash."); process.exitCode = 1; });
