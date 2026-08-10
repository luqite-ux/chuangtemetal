import Image from "next/image";

export const metadata = {
  title: "Customer Administration | ChuangTe Metal",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="admin-login">
      <section>
        <Image src="/brand/logo.png" alt="ChuangTe Metal" width={164} height={92} priority />
        <span>Tenant administration</span>
        <h1>Manage ChuangTe content</h1>
        <p>Sign in with the administrator account assigned to this customer website.</p>
        <form action="/api/admin-login" method="post">
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
