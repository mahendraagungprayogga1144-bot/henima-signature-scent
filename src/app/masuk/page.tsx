import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Masuk</h1>
      <p className="mt-1 text-sm text-stone-600">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-medium text-brand-700 hover:underline">
          Daftar di sini
        </Link>
      </p>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {decodeURIComponent(error)}
        </p>
      )}
      <form action="/api/auth/login" method="POST" className="card mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input-field"
            placeholder="nama@toko.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Kata Sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Masuk
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-stone-500">
      </p>
    </div>
  );
}
