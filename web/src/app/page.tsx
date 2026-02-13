'use client';

import { useMemo, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90 backdrop-blur">
      {children}
    </span>
  );
}

function solscanTx(sig: string) {
  return `https://solscan.io/tx/${sig}?cluster=devnet`;
}

type Lesson = { id: string; title: string; minutes: number };

type Course = {
  id: string;
  track: 'Foundations' | 'Anchor' | 'Solana Programs';
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: Lesson[];
};

const COURSES: Course[] = [
  {
    id: 'foundations-1',
    track: 'Foundations',
    title: 'Solana Foundations: Wallets, Tokens, Transactions',
    level: 'Beginner',
    lessons: [
      { id: 'l1', title: 'Accounts + Signatures', minutes: 12 },
      { id: 'l2', title: 'Token basics', minutes: 15 },
      { id: 'l3', title: 'RPC + blockhashes', minutes: 10 },
    ],
  },
  {
    id: 'anchor-1',
    track: 'Anchor',
    title: 'Anchor 101: PDAs, IDLs, and secure patterns',
    level: 'Intermediate',
    lessons: [
      { id: 'l1', title: 'Anchor accounts', minutes: 14 },
      { id: 'l2', title: 'PDAs & seeds', minutes: 18 },
      { id: 'l3', title: 'Security checklist', minutes: 16 },
    ],
  },
  {
    id: 'programs-1',
    track: 'Solana Programs',
    title: 'On-chain Credentials (MVP): Receipts → NFTs',
    level: 'Advanced',
    lessons: [
      { id: 'l1', title: 'Receipts & audit trails', minutes: 12 },
      { id: 'l2', title: 'Compressed NFTs overview', minutes: 14 },
    ],
  },
];

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [lang, setLang] = useState<'EN' | 'PT' | 'ES'>('EN');
  const [selected, setSelected] = useState<Course>(COURSES[0]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [receiptSig, setReceiptSig] = useState<string>('');
  const [err, setErr] = useState<string>('');

  const progress = useMemo(() => {
    const total = selected.lessons.length;
    const done = selected.lessons.filter((l) => completed[`${selected.id}:${l.id}`]).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [selected, completed]);

  const xp = useMemo(() => {
    // simple MVP: 100 XP per completed lesson
    let total = 0;
    for (const k of Object.keys(completed)) if (completed[k]) total += 100;
    return total;
  }, [completed]);

  const level = useMemo(() => Math.floor(Math.sqrt(xp / 100)), [xp]);

  async function emitCompletionReceipt() {
    setErr('');
    setReceiptSig('');
    if (!publicKey) return setErr('Connect wallet first.');

    try {
      setBusy(true);

      const payload = {
        kind: 'superteam_academy_mvp_receipt',
        ts: new Date().toISOString(),
        wallet: publicKey.toBase58(),
        courseId: selected.id,
        courseTitle: selected.title,
        progress: { ...progress, xp, level },
        note: 'MVP on-chain completion receipt (Solana Memo on devnet).',
      };

      const memoIx = new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
        data: Buffer.from(JSON.stringify(payload), 'utf8'),
      });

      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      const msg = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: [memoIx],
      }).compileToV0Message();

      const tx = new VersionedTransaction(msg);
      const sig = await sendTransaction(tx, connection);
      setReceiptSig(sig);
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

      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <header className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Superteam Academy — LMS dApp (MVP)</h1>
              <p className="text-white/60 mt-1">Codecademy-style Solana learning, with on-chain credentials (prototype)</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <WalletMultiButton />
              <div className="flex gap-2">
                <button onClick={() => setLang('EN')} className={`rounded-full px-3 py-1 text-xs border border-white/10 ${lang==='EN'?'bg-white/10':'bg-white/5 hover:bg-white/10'}`}>EN</button>
                <button onClick={() => setLang('PT')} className={`rounded-full px-3 py-1 text-xs border border-white/10 ${lang==='PT'?'bg-white/10':'bg-white/5 hover:bg-white/10'}`}>PT</button>
                <button onClick={() => setLang('ES')} className={`rounded-full px-3 py-1 text-xs border border-white/10 ${lang==='ES'?'bg-white/10':'bg-white/5 hover:bg-white/10'}`}>ES</button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Pill>XP: {xp}</Pill>
            <Pill>Level: {level}</Pill>
            <Pill>Streak: 1</Pill>
            <Pill>Track: {selected.track}</Pill>
            <Pill>Progress: {progress.done}/{progress.total} ({progress.pct}%)</Pill>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="text-sm font-bold">Courses</div>
            <div className="mt-3 space-y-2">
              {COURSES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`w-full text-left rounded-2xl border border-white/10 px-4 py-3 transition ${selected.id===c.id?'bg-white/10':'bg-black/20 hover:bg-white/10'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-extrabold">{c.title}</div>
                    <span className="text-xs text-white/60">{c.level}</span>
                  </div>
                  <div className="text-xs text-white/50 mt-1">{c.track} • {c.lessons.length} lessons</div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-white/50">Selected course</div>
                <div className="text-xl font-black mt-1">{selected.title}</div>
                <div className="text-sm text-white/60 mt-1">{lang === 'EN' ? 'Interactive lessons + progress tracking + on-chain completion receipt.' : 'MVP UI only (multi-language toggle demo).'}</div>
              </div>
              <button
                disabled={busy}
                onClick={emitCompletionReceipt}
                className="rounded-full bg-[#FFD700] text-black font-black px-5 py-2 disabled:opacity-50"
              >
                {busy ? 'Writing receipt…' : 'Emit On-chain Receipt'}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2">
              {selected.lessons.map((l) => {
                const key = `${selected.id}:${l.id}`;
                const done = !!completed[key];
                return (
                  <div key={key} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold">{l.title}</div>
                      <div className="text-xs text-white/50">{l.minutes} min</div>
                    </div>
                    <button
                      onClick={() => setCompleted((p) => ({ ...p, [key]: !p[key] }))}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold border border-white/10 ${done ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                    >
                      {done ? 'Completed' : 'Mark done'}
                    </button>
                  </div>
                );
              })}
            </div>

            {receiptSig && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="text-xs text-white/50">Completion receipt (devnet)</div>
                <a className="text-[#FFD700] hover:underline break-all font-mono text-sm" href={solscanTx(receiptSig)} target="_blank" rel="noreferrer">
                  {receiptSig}
                </a>
              </div>
            )}

            {err && (
              <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm break-words">
                {err}
              </div>
            )}

            <div className="mt-6 text-xs text-white/40">
              Note: This is a demo MVP focused on UX + an on-chain receipt primitive. Full spec implementation would integrate the Superteam Academy Anchor program (XP SBT Token-2022 + evolving cNFT credentials).
            </div>
          </div>
        </section>

        <footer className="mt-10 text-xs text-white/40">
          Repo will be linked in submission. Hosted on Vercel. Devnet receipt uses Solana Memo.
        </footer>
      </div>
    </main>
  );
}
