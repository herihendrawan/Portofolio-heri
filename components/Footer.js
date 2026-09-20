export default function Footer() {
  return (
    <footer id="tentang" className="border-t border-line px-6 py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold text-ink">
            HERI<span className="text-cyan">.</span>DEV
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Mahasiswa Informatika, fokus AI Engineering. Membangun website
            full-stack, automation AI, dan eksperimen lainnya.
          </p>
        </div>
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Heri. Dibangun dengan Next.js &amp; Supabase.
        </p>
      </div>
    </footer>
  );
}
