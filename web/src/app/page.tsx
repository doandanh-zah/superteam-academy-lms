'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { TRACKS, type TrackId } from '@/lib/curriculum';

function TrackPill({ id }: { id: TrackId }) {
  const tone = id === 'genin' ? 'bg-emerald-600' : id === 'chunin' ? 'bg-purple-600' : 'bg-black';
  return <span className={`inline-flex items-center rounded-full ${tone} text-white px-3 py-1 text-xs font-black`}>{id.toUpperCase()}</span>;
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">dsuc-academy</h1>
            <p className="text-black/60 mt-1">Pick your level. Then open modules inside.</p>
          </div>
          <div className="flex items-center justify-end">
            <WalletMultiButton />
          </div>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-6">
          {TRACKS.map((t) => (
            <Link
              key={t.id}
              href={`/track/${t.id}`}
              className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-xl hover:bg-white/70 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <TrackPill id={t.id} />
                  <div className="text-2xl font-black text-black mt-3">{t.title}</div>
                  <div className="text-sm text-black/65 mt-2">{t.subtitle}</div>
                </div>
                <div className="shrink-0 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-extrabold">
                  Open →
                </div>
              </div>
            </Link>
          ))}
        </section>

        <footer className="mt-10 text-xs text-black/50">
          Roadmap reference: <a className="underline" href="https://superteamvn.substack.com/p/solana-developer-journey" target="_blank" rel="noreferrer">Solana Developer Journey</a>
        </footer>
      </div>
    </main>
  );
}
