import { LoginForm } from "@/app/login/login-form";

/**
 * Server-only (not NEXT_PUBLIC_*) so switching providers is a plain env-var
 * change with no client-bundle inlining involved — see the commit that fixed
 * NEXT_PUBLIC_* flags not being inlined (ae07295) and
 * docs/adr/0012-temporary-google-gated-demo-login.md.
 */
function getLoginProvider(): "brightspace" | "google" {
  return process.env.HUB_LOGIN_PROVIDER === "google" ? "google" : "brightspace";
}

export default function LoginPage() {
  return <LoginForm loginProvider={getLoginProvider()} />;
}
