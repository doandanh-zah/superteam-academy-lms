'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { TRACKS, lessonsByTrack, firstLessonId, type TrackId } from '@/lib/curriculum';

function TrackCard({
  id,
  title,
  subtitle,
  cta,
}: {
  id: TrackId;
  title: string;
  subtitle: string;
  cta: string;
}) {
  const lessons = lessonsByTrack(id);
  const disabled = lessons.length === 0;

  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-black/50">Track</div>
          <div className="text-xl font-black text-black mt-1">{title}</div>
          <div className="text-sm text-black/65 mt-2">{subtitle}</div>
          <div className="text-xs text-black/50 mt-3">{lessons.length} lesson(s)</div>
        </div>

        <Link
          href={disabled ? '#' : `/learn/${id}/${firstLessonId(id)}`}
          aria-disabled={disabled}
          className={`shrink-0 rounded-full px-5 py-2 font-black ${
            disabled
              ? 'bg-black/10 text-black/40 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
          onClick={(e) => {
            if (disabled) e.preventDefault();
          }}
        >
          {cta}
        </Link>
      </div>

      {!disabled ? (
        <div className="mt-4 grid grid-cols-1 gap-2">
          {lessons.slice(0, 7).map((l, idx) => (
            <Link
              key={`${id}:${l.id}`}
              href={`/learn/${id}/${l.id}`}
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
      ) : (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white/50 px-4 py-3 text-sm text-black/60">
          Coming soon.
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Superteam Academy</h1>
            <p className="text-black/60 mt-1">Roadmap-style learning path: Genin → Chunin → Jonin.</p>
          </div>
          <div className="flex items-center justify-end">
            <WalletMultiButton />
          </div>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-6">
          {TRACKS.map((t) => (
            <TrackCard key={t.id} id={t.id} title={t.title} subtitle={t.subtitle} cta={t.id === 'genin' ? 'Start' : 'Open'} />
          ))}
        </section>

        <footer className="mt-10 text-xs text-black/50">
          Source roadmap: <a className="underline" href="https://superteamvn.substack.com/p/solana-developer-journey" target="_blank" rel="noreferrer">Solana Developer Journey</a>
        </footer>
      </div>
    </main>
  );
}
