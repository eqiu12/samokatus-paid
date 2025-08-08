import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/50 bg-white/70 dark:bg-zinc-900/60 border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-4xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-300">
            Samokatus
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="hover:underline underline-offset-4" href="/">Home</Link>
          <Link className="hover:underline underline-offset-4" href="/paid">Paid</Link>
          <Link className="hover:underline underline-offset-4" href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}


