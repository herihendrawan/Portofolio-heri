import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-void/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-sm font-semibold tracking-wide text-ink">
          HERI<span className="text-cyan">.</span>DEV
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/#proyek" className="transition-colors hover:text-cyan">
            Proyek
          </Link>
          <Link href="/#tentang" className="transition-colors hover:text-cyan">
            Tentang
          </Link>
        </nav>
      </div>
    </header>
  );
}
