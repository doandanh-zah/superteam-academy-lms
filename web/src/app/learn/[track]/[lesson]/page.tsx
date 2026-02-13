'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';

import { TRACKS, lessonsByTrack, findLesson, type TrackId } from '@/lib/curriculum';
import { renderMd } from '@/lib/md';
import { loadProgress, saveProgress, markLessonComplete, markQuizPassed, isQuizPassed } from '@/lib/progress';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90 backdrop-blur">
      {children}
    </span>
  );
}

function solscan(sig: string) {
  return `https://solscan.io/tx/${sig}?cluster=devnet`;
}

export default function LessonPage() {
  const params = useParams<{ track: string; lesson: string }>();
  const track = params.track as TrackId;
  const lessonId = params.lesson;

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const walletKey = publicKey?.toBase58() || null;
  const [state, setState] = useState(() => loadProgress(walletKey));
  const [busy, setBusy] = useState(false);
  const [sig, setSig] = useState('');
  const [err, setErr] = useState('');

  // keep state in sync when wallet changes
  if (typeof window !== 'undefined') {
    const currentKey = loadProgress(walletKey);
    // naive sync: if wallet changed and timestamps differ, swap
    if (currentKey.updatedAt !== state.updatedAt && walletKey && state.updatedAt) {
      // don't thrash; only if localStorage has newer
    }
  }

  const lesson = useMemo(() => findLesson(track, lessonId), [track, lessonId]);
  const list = useMemo(() => lessonsByTrack(track), [track]);
  const idx = list.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;

  const quizPassed = isQuizPassed(state, track, lessonId);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  function grade() {
    const incorrect: string[] = [];
    for (const q of lesson.quiz) {
      if (answers[q.id] !== q.correctChoiceId) incorrect.push(q.id);
    }
    return { ok: incorrect.length === 0, incorrect };
  }

  async function submitQuiz() {
    setErr('');
    setSig('');

    const g = grade();
    if (!g.ok) {
      setErr('Some answers are incorrect. Review explanations and try again.');
      return;
    }

    const updated1 = markQuizPassed(state, track, lessonId);
    const updated2 = markLessonComplete(updated1, track, lessonId);
    setState(updated2);
    saveProgress(walletKey, updated2);

    // Optional on-chain receipt if wallet connected
    if (!publicKey) return;

    try {
      setBusy(true);
      const payload = {
        kind: 'academy_lesson_completion_receipt',
        ts: new Date().toISOString(),
        wallet: publicKey.toBase58(),
        track,
        lessonId,
        lessonTitle: lesson.title,
        score: 100,
        xp: updated2.xp,
        version: 'mvp-v2',
      };
      const ix = new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
        data: Buffer.from(JSON.stringify(payload), 'utf8'),
      });
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      const msg = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();
      const tx = new VersionedTransaction(msg);
      const s = await sendTransaction(tx, connection);
      setSig(s);
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07070B] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-20 -left-40 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-yellow-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:26px_26px] opacity-30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <Link href="/" className="text-xs text-white/60 hover:text-white/90">← Back</Link>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">{lesson.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Pill>{TRACKS.find((t) => t.id === track)?.title || track}</Pill>
              <Pill>{lesson.minutes} min</Pill>
              {quizPassed ? <Pill>Quiz passed</Pill> : <Pill>Quiz pending</Pill>}
            </div>
          </div>
          <WalletMultiButton />
        </header>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="text-sm font-bold">Track lessons</div>
            <div className="mt-3 space-y-2">
              {list.map((l) => (
                <Link
                  key={l.id}
                  href={`/learn/${track}/${l.id}`}
                  className={`block rounded-2xl border border-white/10 px-4 py-3 transition ${l.id===lessonId ? 'bg-white/10' : 'bg-black/20 hover:bg-white/10'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-extrabold text-sm">{l.title}</div>
                    <div className="text-xs text-white/50">{l.minutes}m</div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>

          <section className="lg:col-span-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="space-y-2">{renderMd(lesson.content.md)}</div>

            {lesson.content.callouts?.length ? (
              <div className="mt-5 grid grid-cols-1 gap-3">
                {lesson.content.callouts.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="font-black">{c.title}</div>
                    <div className="mt-1 text-sm text-white/70">{c.body}</div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8">
              <div className="text-lg font-black">Quiz</div>
              <div className="mt-3 space-y-4">
                {lesson.quiz.map((q) => (
                  <div key={q.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="font-bold">{q.prompt}</div>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {q.choices.map((ch) => {
                        const active = answers[q.id] === ch.id;
                        return (
                          <button
                            key={ch.id}
                            onClick={() => setAnswers((p) => ({ ...p, [q.id]: ch.id }))}
                            className={`text-left rounded-2xl border border-white/10 px-3 py-2 text-sm transition ${active ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}`}
                          >
                            {ch.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-white/50">Explanation: {q.explanation}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  {prev ? (
                    <Link className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" href={`/learn/${track}/${prev.id}`}>← Prev</Link>
                  ) : null}
                  {next ? (
                    <Link className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" href={`/learn/${track}/${next.id}`}>Next →</Link>
                  ) : null}
                </div>

                <button
                  onClick={submitQuiz}
                  disabled={busy}
                  className="rounded-full bg-[#FFD700] text-black font-black px-5 py-2 disabled:opacity-50"
                >
                  {busy ? 'Submitting…' : 'Submit quiz'}
                </button>
              </div>

              {sig ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-xs text-white/50">On-chain receipt (devnet)</div>
                  <a className="text-[#FFD700] hover:underline break-all font-mono text-sm" href={solscan(sig)} target="_blank" rel="noreferrer">
                    {sig}
                  </a>
                </div>
              ) : null}

              {err ? (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm break-words">
                  {err}
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <footer className="mt-10 text-xs text-white/40">
          Tip: connect wallet to write a devnet completion receipt. Progress is stored locally per wallet.
        </footer>
      </div>
    </main>
  );
}
