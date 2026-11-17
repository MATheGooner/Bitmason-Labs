"use client";
import { useActionState, useEffect, useRef } from "react";
import { loginAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(loginAdmin, { message: "", email: "" }, "/admin/login");
  const password = useRef<HTMLInputElement>(null);
  useEffect(() => { if (state.message) password.current?.focus(); }, [state]);
  return <form action={action} className="admin-form" aria-busy={pending}>
    {!configured && <p className="admin-message" role="status">Administrative access is not configured. Contact the site owner.</p>}
    {state.message && <p id="login-error" className="admin-error" role="alert">{state.message}</p>}
    <fieldset disabled={pending || !configured}><legend className="sr-only">Administrator credentials</legend>
      <div className="admin-field"><label htmlFor="email">Admin email</label><input id="email" name="email" type="email" autoComplete="username" defaultValue={state.email} required maxLength={254} /></div>
      <div className="admin-field"><label htmlFor="password">Password</label><input ref={password} id="password" name="password" type="password" autoComplete="current-password" aria-describedby={state.message ? "login-error" : undefined} required maxLength={256} /></div>
      <Button type="submit">{pending ? "Signing in…" : "Sign in"}</Button>
    </fieldset>
  </form>;
}
