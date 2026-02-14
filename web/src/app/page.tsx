'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { TRACKS, firstLessonId } from '@/lib/curriculum';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Superteam Academy</h1>
            <p className="text-black/60 mt-1">Solana learning tracks with quizzes + optional devnet receipts.</p>
          </div>
          <div className="flex items-center justify-end">
            <WalletMultiButton />
          </div>
        </header>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TRACKS.map((t) => (
            <div key={t.id} className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-xl">
              <div className="text-xs text-black/50">Track</div>
              <div className="text-xl font-black mt-1 text-black">{t.title}</div>
              <div className="text-sm text-black/70 mt-2">{t.subtitle}</div>

              <div className="mt-5 flex gap-3">
                <Link
                  href={`/learn/${t.id}/${firstLessonId(t.id)}`}
                  className="rounded-full bg-emerald-600 text-white font-black px-5 py-2 hover:bg-emerald-700"
                >
                  Start
                </Link>
                <Link
                  href={`/learn/${t.id}/${firstLessonId(t.id)}`}
                  className="rounded-full border border-black/10 bg-white/50 px-5 py-2 hover:bg-white"
                >
                  Open
                </Link>
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-10 text-xs text-black/50">
          Tip: progress is saved locally per wallet. Connect a wallet if you want devnet completion receipts.
        </footer>
      </div>
    </main>
  );
}
