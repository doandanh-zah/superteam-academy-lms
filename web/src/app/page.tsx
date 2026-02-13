'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { TRACKS, firstLessonId } from '@/lib/curriculum';

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90 backdrop-blur">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07070B] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-20 -left-40 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-yellow-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:26px_26px] opacity-30" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Superteam Academy</h1>
            <p className="text-white/60 mt-1">Rapid-fire Solana learning with quizzes + on-chain completion receipts (devnet)</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>Foundations</Pill>
              <Pill>Anchor</Pill>
              <Pill>Token-2022 + Credentials</Pill>
              <Pill>English 100%</Pill>
            </div>
          </div>
          <WalletMultiButton />
        </header>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TRACKS.map((t) => (
            <div key={t.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="text-xs text-white/50">Track</div>
              <div className="text-xl font-black mt-1">{t.title}</div>
              <div className="text-sm text-white/70 mt-2">{t.subtitle}</div>

              <div className="mt-5 flex gap-3">
                <Link
                  href={`/learn/${t.id}/${firstLessonId(t.id)}`}
                  className="rounded-full bg-[#FFD700] text-black font-black px-5 py-2"
                >
                  Start
                </Link>
                <Link
                  href={`/learn/${t.id}/${firstLessonId(t.id)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2 hover:bg-white/10"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-10 text-xs text-white/40">
          MVP note: content is written for learning. On-chain credentialing is demonstrated via devnet receipts; full Token-2022 SBT + evolving cNFT integration is a next step.
        </footer>
      </div>
    </main>
  );
}
