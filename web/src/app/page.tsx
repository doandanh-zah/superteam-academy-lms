'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { lessonsByTrack, firstLessonId, type TrackId } from '@/lib/curriculum';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Superteam Academy</h1>
            <p className="text-black/60 mt-1">Learn Solana fundamentals with interactive diagrams + rapid-fire quizzes.</p>
          </div>
          <div className="flex items-center justify-end">
            <WalletMultiButton />
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-black/50">Menu</div>
              <div className="text-lg font-black text-black">Beginner Modules</div>
            </div>
            <Link
              href={`/learn/beginner101/${firstLessonId('beginner101' as TrackId)}`}
              className="rounded-full bg-emerald-600 text-white font-black px-5 py-2 hover:bg-emerald-700"
            >
              Start
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {lessonsByTrack('beginner101' as TrackId).map((l, idx) => (
              <Link
                key={l.id}
                href={`/learn/beginner101/${l.id}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/50 px-4 py-3 hover:bg-white"
              >
                <div>
                  <div className="text-xs text-black/50">{idx + 1}</div>
                  <div className="font-extrabold text-black">{l.title}</div>
                  <div className="text-sm text-black/60 mt-0.5">~{l.minutes} min · quiz included</div>
                </div>
                <div className="text-sm font-extrabold text-black/70 group-hover:text-black">Open →</div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-10 text-xs text-black/50">
          Tip: progress is saved locally per wallet. Connect a wallet if you want devnet completion receipts.
        </footer>
      </div>
    </main>
  );
}
