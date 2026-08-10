import Image from "next/image";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reason?: string }>;
}) {
  const { error, reason } = await searchParams;

  return (
    <main className="admin-login">
      <section>
        <Image src="/brand/logo.png" alt="ChuangTe Metal" width={164} height={92} priority />
        <span>Tenant administration</span>
        <h1>Manage ChuangTe content</h1>
        <p>Sign in to manage products, articles, enquiries and website settings.</p>
        {reason === "unauthorized" ? <div role="status">Please sign in before opening the administration area.</div> : null}
        <form action="/api/auth/login" method="post">
          <label>
            <span>Email</span>
            <input name="email" type="email" required autoComplete="username" />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" required autoComplete="current-password" />
          </label>
          {error ? <div role="alert">{error}</div> : null}
          <button className="button button-primary" type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}
