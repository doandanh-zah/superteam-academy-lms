'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, MessageSquare, Share2, Trophy } from 'lucide-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';

import { TRACKS, lessonsByTrack, findLesson, type TrackId } from '@/lib/curriculum';
import { renderMd } from '@/lib/md';
import LessonAnimation from '@/components/LessonAnimation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { trackStyle } from '@/components/ui/trackStyle';
import { loadProgress, saveProgress, markLessonComplete, markQuizPassed, isQuizPassed } from '@/lib/progress';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

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

    if (!allSubmitted) {
      setErr('Submit each question first.');
      return;
    }

    if (!allCorrect) {
      setErr('Some answers are still incorrect. Fix them and resubmit.');
      return;
    }

    // Free learning: purely local progress
    const updated1 = markQuizPassed(state, track, lessonId);
    const updated2 = markLessonComplete(updated1, track, lessonId);
    setState(updated2);
    saveProgress(walletKey, updated2);
  }

  async function emitReceipt() {
    setErr('');
    setSig('');

    if (!publicKey) {
      setErr('Connect a wallet to emit a devnet receipt (optional).');
      return;
    }

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
        xp: state.xp,
        version: 'mvp-v3-optional',
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

  const st = trackStyle(track);
  const trackTitle = TRACKS.find((t) => t.id === track)?.title || track;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href={`/track/${track}`} className="flex items-center hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to {trackTitle}
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200 font-medium truncate">{lesson.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <Card hoverEffect={false} className="bg-[#1a1d2d]/90">
            <div className="w-full h-48 bg-gradient-to-r from-slate-900 to-[#10121d] rounded-2xl mb-8 flex items-center justify-center border border-slate-800 shadow-inner overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <LessonAnimation lessonId={lessonId} />
              </div>
            </div>

            <h1 className="text-3xl font-bold font-display text-white mb-4">{lesson.title}</h1>

            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {lesson.minutes} min
              </Badge>
              <Badge className={`border ${st.badge} bg-transparent`}>Level: {trackTitle}</Badge>
              <Badge variant="neutral">{lesson.quiz.length} Questions</Badge>
              {quizPassed ? <Badge variant="neutral">Quiz passed</Badge> : <Badge variant="neutral">Quiz pending</Badge>}
            </div>

            <div className="space-y-2">{renderMd(lesson.content.md)}</div>

            {lesson.content.callouts?.length ? (
              <div className="mt-8 grid grid-cols-1 gap-3">
                {lesson.content.callouts.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="font-bold text-white font-display">{c.title}</div>
                    <div className="mt-1 text-sm text-slate-300">{c.body}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </Card>

          {/* Quiz Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Knowledge Check
            </h2>

            {lesson.quiz.map((q) => {
              const submitted = !!submittedQ[q.id];
              const correct = answers[q.id] === q.correctChoiceId;

              return (
                <Card key={q.id} hoverEffect={false} className="border-l-4 border-l-slate-700 overflow-hidden bg-[#1a1d2d]/80">
                  <h3 className="font-bold text-lg mb-4 text-white font-display">{q.prompt}</h3>

                  <div className="space-y-2 mb-6">
                    {q.choices.map((ch) => {
                      const selected = answers[q.id] === ch.id;
                      const isChoiceCorrect = ch.id === q.correctChoiceId;

                      let cls = 'border-slate-700 hover:bg-slate-700/50 text-slate-300';
                      if (submitted) {
                        if (isChoiceCorrect) cls = 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50 text-emerald-300';
                        else if (selected && !isChoiceCorrect) cls = 'bg-rose-500/10 border-rose-500/50 ring-1 ring-rose-500/50 text-rose-300 opacity-80';
                        else cls = 'opacity-40 bg-slate-800/50 border-slate-700';
                      } else if (selected) {
                        cls = 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-500/10 text-indigo-200';
                      }

                      return (
                        <button
                          key={ch.id}
                          onClick={() => {
                            if (submitted) return;
                            setAnswers((p) => ({ ...p, [q.id]: ch.id }));
                          }}
                          className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-all flex items-center ${cls}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center flex-shrink-0 ${
                              submitted && isChoiceCorrect
                                ? 'border-emerald-500 bg-emerald-500'
                                : selected && !submitted
                                  ? 'border-indigo-500'
                                  : 'border-slate-500'
                            }`}
                          >
                            {submitted && isChoiceCorrect ? <CheckCircle2 className="w-3 h-3 text-white" /> : null}
                          </div>
                          <span className="text-sm font-medium">{ch.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!submitted ? (
                    <Button onClick={() => submitQuestion(q.id)} disabled={!answers[q.id]} size="sm" variant="primary">
                      Submit Answer
                    </Button>
                  ) : (
                    <div
                      className={`p-4 rounded-xl text-sm ${
                        correct
                          ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-200 border border-rose-500/20'
                      }`}
                    >
                      <p className="font-bold mb-1">{correct ? 'Correct!' : 'Incorrect'}</p>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </Card>
              );
            })}

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
              <div className="flex gap-2">
                {prev ? (
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = `/learn/${track}/${prev.id}`)}>
                    ← Prev
                  </Button>
                ) : null}
                {next ? (
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = `/learn/${track}/${next.id}`)}>
                    Next →
                  </Button>
                ) : null}
              </div>

              <Button onClick={finishLesson} disabled={busy || !allSubmitted || !allCorrect} variant="primary" size="sm">
                {busy ? 'Finishing…' : 'Finish lesson'} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                Optional: emit a devnet receipt (writes a Memo). Progress works without it.
              </div>
              <Button
                onClick={emitReceipt}
                disabled={busy || !publicKey || !allSubmitted || !allCorrect}
                variant="outline"
                size="sm"
              >
                <Share2 className="w-3 h-3 mr-2" /> {busy ? 'Emitting…' : 'Emit devnet receipt'}
              </Button>
            </div>

            {sig ? (
              <Card hoverEffect={false} className="bg-white/5">
                <div className="text-xs text-slate-400">Receipt signature (devnet)</div>
                <a
                  className="text-indigo-300 hover:underline break-all font-mono text-sm"
                  href={solscan(sig)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {sig}
                </a>
              </Card>
            ) : null}

            {err ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200 text-sm break-words">
                {err}
              </div>
            ) : null}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="sticky top-28 border-indigo-500/20 bg-indigo-900/10 backdrop-blur-md" hoverEffect={false}>
            <h3 className="font-bold text-white font-display mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Lesson Checklist
            </h3>

            <ul className="space-y-3 mb-8">
              {(((lesson as any).content?.checklist) || ['Read the lesson', 'Understand the concepts', 'Complete the knowledge check']).map((it: string, i: number) => (
                <li key={`${i}-${it}`} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-slate-700 text-transparent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span>{it}</span>
                </li>
              ))}
            </ul>

            {/* Discussion Prompt */}
            <div className="bg-[#1a1d2d] rounded-2xl p-4 border border-indigo-500/20 shadow-lg mb-6">
              <div className="flex items-center gap-2 mb-2 text-indigo-300 font-semibold text-xs uppercase tracking-wide">
                <MessageSquare className="w-3 h-3" /> Discussion
              </div>
              <p className="text-sm text-slate-300 mb-3">
                {((lesson as any).content?.discussionPrompt as string) || 'Write a short takeaway: what would you build with this concept?'}
              </p>
              <a
                href="https://gimmeidea.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-300 font-medium hover:text-indigo-200 hover:underline"
              >
                Share your thoughts on Gimme Idea →
              </a>
            </div>

            <div className="space-y-3">
              <Button fullWidth variant="primary" onClick={finishLesson} disabled={busy || !allSubmitted || !allCorrect}>
                Finish Lesson
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={emitReceipt}
                disabled={busy || !publicKey || !allSubmitted || !allCorrect}
                className={!publicKey ? 'text-slate-500 border-slate-700 hover:bg-transparent cursor-not-allowed opacity-50' : ''}
                title={!publicKey ? 'Connect wallet to emit receipt' : ''}
              >
                <Share2 className="w-3 h-3 mr-2" /> Emit Devnet Receipt
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
