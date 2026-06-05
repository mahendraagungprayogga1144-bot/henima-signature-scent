import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">Henima Signature Scent</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-900">Selamat Datang</h1>
        <p className="mt-2 text-sm text-ink-600">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-semibold text-ink-900 hover:underline">Daftar di sini</Link>
        </p>
      </div>
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </p>
      )}
      <div className="rounded-3xl border border-ink-200 bg-white p-8 shadow-sm">
        <form action="/api/auth/login" method="POST" className="space-y-5">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" name="email" type="email" required className="input-field" placeholder="nama@toko.com" />
          </div>
          <div>
            <label htmlFor="password" className="label">Kata Sandi</label>
            <input id="password" name="password" type="password" required className="input-field" />
          </div>
          <button type="submit" className="btn-primary w-full py-3 text-base">Masuk</button>
        </form>
      </div>
    </div>
  );
}
