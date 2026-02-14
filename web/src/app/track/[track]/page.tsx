'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { TRACKS, lessonsByTrack, firstLessonId, type TrackId } from '@/lib/curriculum';

export default function TrackPage() {
  const params = useParams<{ track: string }>();
  const track = params.track as TrackId;

  const t = TRACKS.find((x) => x.id === track);
  const lessons = lessonsByTrack(track);

  return (
    <main className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-xs text-black/60 hover:text-black">← dsuc-academy</Link>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-black">{t?.title || track}</h1>
            <p className="text-black/60 mt-1">{t?.subtitle || ''}</p>
          </div>
          <div className="flex items-center justify-end">
            <WalletMultiButton />
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-black/50">Modules</div>
              <div className="text-lg font-black text-black">{lessons.length} lesson(s)</div>
            </div>
            {lessons.length ? (
              <Link
                href={`/learn/${track}/${firstLessonId(track)}`}
                className="rounded-full bg-emerald-600 text-white font-black px-5 py-2 hover:bg-emerald-700"
              >
                Start
              </Link>
            ) : (
              <span className="rounded-full bg-black/10 text-black/40 px-5 py-2 font-black">Coming soon</span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {lessons.map((l, idx) => (
              <Link
                key={l.id}
                href={`/learn/${track}/${l.id}`}
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
          Roadmap reference: <a className="underline" href="https://superteamvn.substack.com/p/solana-developer-journey" target="_blank" rel="noreferrer">Solana Developer Journey</a>
        </footer>
      </div>
    </main>
  );
}
