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
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-black/80 backdrop-blur">
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
  const [submittedQ, setSubmittedQ] = useState<Record<string, boolean>>({});

  function isCorrect(qid: string): boolean {
    const q = lesson.quiz.find((x) => x.id === qid);
    if (!q) return false;
    return answers[qid] === q.correctChoiceId;
  }

  const allSubmitted = lesson.quiz.every((q) => submittedQ[q.id]);
  const allCorrect = lesson.quiz.every((q) => isCorrect(q.id));

  async function submitQuestion(qid: string) {
    setErr('');
    setSig('');
    setSubmittedQ((p) => ({ ...p, [qid]: true }));
    if (!isCorrect(qid)) {
      setErr('Incorrect answer highlighted in red. Fix it and resubmit.');
    }
  }

  async function finishLesson() {
    setErr('');
    setSig('');

    if (!allSubmitted) {
      setErr('Submit each question first.');
      return;
    }

    if (!allCorrect) {
      setErr('Some answers are still incorrect. Correct answers are highlighted in green; wrong selections in red.');
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
    <main className="min-h-screen">

      <div className="relative mx-auto max-w-7xl px-5 py-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-xs text-black/60 hover:text-black">← Back</Link>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">{lesson.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Pill>{TRACKS.find((t) => t.id === track)?.title || track}</Pill>
              <Pill>{lesson.minutes} min</Pill>
              {quizPassed ? <Pill>Quiz passed</Pill> : <Pill>Quiz pending</Pill>}
            </div>
          </div>
          <div className="flex items-center justify-end">
            <WalletMultiButton />
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-xl">
            <div className="text-sm font-bold">Track lessons</div>
            <div className="mt-3 space-y-2">
              {list.map((l) => (
                <Link
                  key={l.id}
                  href={`/learn/${track}/${l.id}`}
                  className={`block rounded-2xl border border-black/10 px-4 py-3 transition ${l.id===lessonId ? 'bg-black/5' : 'bg-white/50 hover:bg-white'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-extrabold text-sm">{l.title}</div>
                    <div className="text-xs text-black/50">{l.minutes}m</div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>

          <section className="lg:col-span-8 rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-xl">
            <div className="space-y-2">{renderMd(lesson.content.md)}</div>

            {lesson.content.callouts?.length ? (
              <div className="mt-5 grid grid-cols-1 gap-3">
                {lesson.content.callouts.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-black/10 bg-white/55 px-4 py-3">
                    <div className="font-black">{c.title}</div>
                    <div className="mt-1 text-sm text-black/70">{c.body}</div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8">
              <div className="text-lg font-black">Quiz</div>
              <div className="mt-3 space-y-4">
                {lesson.quiz.map((q) => (
                  <div key={q.id} className="rounded-2xl border border-black/10 bg-white/50 px-4 py-3">
                    <div className="font-bold text-black">{q.prompt}</div>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-black/50">Choose one answer</span>
                        <button
                          onClick={() => submitQuestion(q.id)}
                          className="rounded-full bg-black/10 hover:bg-black/15 border border-black/10 px-3 py-1 text-xs font-bold"
                        >
                          Submit
                        </button>
                      </div>
                      {q.choices.map((ch) => {
                        const selected = answers[q.id] === ch.id;
                        const isCorrect = ch.id === q.correctChoiceId;
                        const show = !!submittedQ[q.id];

                        const cls = (() => {
                          if (!show) return selected ? 'bg-black/10' : 'bg-white/50 hover:bg-white';
                          if (selected && isCorrect) return 'bg-emerald-500/25 border-emerald-600/30 text-emerald-950';
                          if (selected && !isCorrect) return 'bg-red-500/20 border-red-600/30 text-red-950';
                          if (!selected && isCorrect) return 'bg-emerald-500/10 border-emerald-600/20 text-emerald-950/90';
                          return 'bg-white/50';
                        })();

                        return (
                          <button
                            key={ch.id}
                            onClick={() => {
                              setSubmittedQ((p) => ({ ...p, [q.id]: false }));
                              setAnswers((p) => ({ ...p, [q.id]: ch.id }));
                            }}
                            className={`text-left rounded-2xl border border-black/10 px-3 py-2 text-sm transition ${cls}`}
                          >
                            {ch.label}
                          </button>
                        );
                      })}
                    </div>
                    {submittedQ[q.id] ? (
                      <>
                        <div className="mt-2 text-xs">
                          {answers[q.id] === q.correctChoiceId ? (
                            <span className="text-emerald-700 font-bold">Correct</span>
                          ) : (
                            <span className="text-red-700 font-bold">Incorrect</span>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-black/60">Explanation: {q.explanation}</div>
                      </>
                    ) : (
                      <div className="mt-2 text-xs text-black/40">Submit this question to see the explanation.</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  {prev ? (
                    <Link className="rounded-full border border-black/10 bg-white/50 px-4 py-2 text-sm hover:bg-white" href={`/learn/${track}/${prev.id}`}>← Prev</Link>
                  ) : null}
                  {next ? (
                    <Link className="rounded-full border border-black/10 bg-white/50 px-4 py-2 text-sm hover:bg-white" href={`/learn/${track}/${next.id}`}>Next →</Link>
                  ) : null}
                </div>

                <button
                  onClick={finishLesson}
                  disabled={busy || !allSubmitted || !allCorrect}
                  className="rounded-full bg-emerald-600 text-white font-black px-5 py-2 disabled:opacity-50"
                >
                  {busy ? 'Finishing…' : 'Finish lesson'}
                </button>
              </div>

              {sig ? (
                <div className="mt-4 rounded-2xl border border-black/10 bg-white/55 px-4 py-3">
                  <div className="text-xs text-black/50">On-chain receipt (devnet)</div>
                  <a className="text-emerald-800 hover:underline break-all font-mono text-sm" href={solscan(sig)} target="_blank" rel="noreferrer">
                    {sig}
                  </a>
                </div>
              ) : null}

              {err ? (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-950 text-sm break-words">
                  {err}
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <footer className="mt-10 text-xs text-black/50">
          Tip: connect wallet to write a devnet completion receipt. Progress is stored locally per wallet.
        </footer>
      </div>
    </main>
  );
}
