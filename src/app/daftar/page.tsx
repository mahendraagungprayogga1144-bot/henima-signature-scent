import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Daftar Reseller</h1>
      <p className="mt-1 text-sm text-stone-600">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-medium text-brand-700 hover:underline">
          Masuk
        </Link>
      </p>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {decodeURIComponent(error)}
        </p>
      )}
      <form action="/api/auth/register" method="POST" className="card mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Nama Lengkap
          </label>
          <input id="name" name="name" required className="input-field" />
        </div>
        <div>
          <label htmlFor="storeName" className="label">
            Nama Toko
          </label>
          <input id="storeName" name="storeName" required className="input-field" />
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" required className="input-field" />
        </div>
        <div>
          <label htmlFor="phone" className="label">
            WhatsApp (08xxx atau 62xxx)
          </label>
          <input
            id="phone"
            name="phone"
            required
            className="input-field"
            placeholder="6281234567890"
          />
        </div>
        <div>
          <label htmlFor="address" className="label">
            Alamat Toko
          </label>
          <textarea id="address" name="address" rows={2} className="input-field" />
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
            minLength={6}
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Daftar
        </button>
      </form>
    </div>
  );
}
