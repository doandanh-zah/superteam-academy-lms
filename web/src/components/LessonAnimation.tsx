'use client';

import { useMemo, useState } from 'react';

type Props = { lessonId: string };

type StepInfo = { title: string; description: string };

function ControlButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-black/10 bg-white/55 px-3 py-1 text-xs font-extrabold hover:bg-white disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-black/10 bg-white/60 p-4 sm:p-5 backdrop-blur-xl">{children}</div>;
}

function Title({ lessonId }: { lessonId: string }) {
  const title = useMemo(() => {
    switch (lessonId) {
      case 'm1-blockchain-as-a-computer':
        return 'Client-server vs P2P replication';
      case 'm2-identity-and-authentication':
        return 'Signing flow';
      case 'm3-consensus-input-not-memory':
        return 'Consensus = ordering inputs';
      case 'm4-account-file':
        return 'Account model';
      case 'm5-program-library':
        return 'PDA derivation';
      case 'm6-environment-setup-minimal':
        return 'Minimal setup checklist';
      case 'm7-coding-with-claude':
        return 'Prompt flow';
      default:
        return 'Concept animation';
    }
  }, [lessonId]);

  return <div className="text-sm font-extrabold text-black">{title}</div>;
}

function Stepper({ steps, step, setStep }: { steps: StepInfo[]; step: number; setStep: (n: number) => void }) {
  const active = steps[Math.min(step, steps.length - 1)];
  const percent = Math.round(((Math.min(step, steps.length - 1) + 1) / steps.length) * 100);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-black/60">{active?.description}</div>
        <div className="flex gap-2">
          <ControlButton onClick={() => setStep(Math.max(0, step - 1))} disabled={step <= 0}>
            Prev
          </ControlButton>
          <ControlButton onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step >= steps.length - 1}>
            Next
          </ControlButton>
        </div>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
        {steps.map((s, idx) => {
          const state = idx < step ? 'complete' : idx === step ? 'active' : 'pending';
          const cls =
            state === 'active'
              ? 'border-emerald-600/30 bg-emerald-500/10'
              : state === 'complete'
                ? 'border-black/10 bg-white/55'
                : 'border-black/10 bg-white/40';
          return (
            <button
              type="button"
              key={s.title}
              onClick={() => setStep(idx)}
              className={`text-left rounded-2xl border px-3 py-2 ${cls}`}
            >
              <div className="text-xs text-black/50">Step {idx + 1}</div>
              <div className="text-sm font-extrabold text-black">{s.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function LessonAnimation({ lessonId }: Props) {
  const [playing, setPlaying] = useState(true);
  const [resetTick, setResetTick] = useState(0);
  const [mode, setMode] = useState<'client-server' | 'p2p'>('client-server');

  const steps = useMemo<StepInfo[] | null>(() => {
    if (lessonId === 'm2-identity-and-authentication') {
      return [
        { title: 'Create', description: 'The app constructs a message (or transaction).' },
        { title: 'Sign', description: 'Your wallet shows approval UI and signs with your private key.' },
        { title: 'Submit', description: 'The signed payload is sent to the network via an RPC.' },
        { title: 'Process', description: 'Validators verify signatures and execute instructions.' },
        { title: 'Confirm', description: 'The network finalizes the ordered result; you see confirmation.' },
      ];
    }
    if (lessonId === 'm3-consensus-input-not-memory') {
      return [
        { title: 'Collect Inputs', description: 'Transactions arrive from many clients into a shared pool.' },
        { title: 'Propose Order', description: 'A leader proposes a canonical ordering for the next block.' },
        { title: 'Vote & Validate', description: 'Validators verify and vote on the proposed order.' },
        { title: 'Finalize', description: 'The ordered inputs become canonical history.' },
      ];
    }
    if (lessonId === 'm7-coding-with-claude') {
      return [
        { title: 'Define Goal', description: 'State the outcome you want in one crisp sentence.' },
        { title: 'Add Constraints', description: 'Specify accounts, checks, limits, and required instructions.' },
        { title: 'Generate & Review', description: 'Draft the code, then verify invariants and security checks.' },
        { title: 'Test & Iterate', description: 'Run tests, fix failures, then harden edge cases.' },
      ];
    }
    return null;
  }, [lessonId]);

  const [step, setStep] = useState(0);

  // clamp step if lesson changes
  const clampedStep = steps ? Math.min(step, steps.length - 1) : 0;

  const key = `${lessonId}:${resetTick}`;
  const cls = playing ? 'is-playing' : 'is-paused';

  return (
    <Frame>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs text-black/50">Animation</div>
          <Title lessonId={lessonId} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {lessonId === 'm1-blockchain-as-a-computer' ? (
            <>
              <ControlButton onClick={() => setMode('client-server')}>Client-Server</ControlButton>
              <ControlButton onClick={() => setMode('p2p')}>P2P</ControlButton>
            </>
          ) : null}

          <ControlButton onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</ControlButton>
          <ControlButton
            onClick={() => {
              setPlaying(false);
              setResetTick((t) => t + 1);
              setStep(0);
              setTimeout(() => setPlaying(true), 50);
            }}
          >
            Reset
          </ControlButton>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white/70">
        <div className={`academy-anim ${cls}`}>
          {/* M1: mimic "computer/network" style: clear boxes + moving packet */}
          {lessonId === 'm1-blockchain-as-a-computer' ? (
            <svg key={key + ':' + mode} viewBox="0 0 900 240" className="h-[170px] w-full">
              <text x="30" y="32" fontSize="12" fill="rgba(0,0,0,0.55)">
                {mode === 'client-server'
                  ? 'Client → Server → Database (single authority)'
                  : 'Client → Validators (verify + replicate)'}
              </text>

              {mode === 'client-server' ? (
                <>
                  <rect x="40" y="70" width="220" height="140" rx="18" fill="rgba(255,255,255,0.75)" stroke="rgba(0,0,0,0.10)" />
                  <text x="90" y="112" fontSize="16" fontWeight="900" fill="#0b1411">Client</text>
                  <text x="90" y="136" fontSize="12" fill="rgba(0,0,0,0.55)">request</text>

                  <rect x="340" y="70" width="220" height="140" rx="18" fill="rgba(124,58,237,0.08)" stroke="rgba(124,58,237,0.25)" />
                  <text x="395" y="112" fontSize="16" fontWeight="900" fill="#1f1147">Server</text>
                  <text x="395" y="136" fontSize="12" fill="rgba(0,0,0,0.55)">decides truth</text>

                  <rect x="640" y="70" width="220" height="140" rx="18" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" />
                  <text x="705" y="112" fontSize="16" fontWeight="900" fill="#052e2b">Database</text>
                  <text x="705" y="136" fontSize="12" fill="rgba(0,0,0,0.55)">single copy</text>

                  <path d="M 260 140 L 340 140" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
                  <path d="M 560 140 L 640 140" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />

                  <circle className="anim-dot" cx="260" cy="140" r="7" fill="#7c3aed" />
                </>
              ) : (
                <>
                  <rect x="40" y="78" width="220" height="124" rx="18" fill="rgba(255,255,255,0.75)" stroke="rgba(0,0,0,0.10)" />
                  <text x="90" y="122" fontSize="16" fontWeight="900" fill="#0b1411">Client</text>
                  <text x="90" y="146" fontSize="12" fill="rgba(0,0,0,0.55)">broadcast tx</text>

                  <rect x="330" y="64" width="520" height="160" rx="22" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.10)" />
                  <text x="370" y="96" fontSize="14" fontWeight="900" fill="#0b1411">Validators</text>

                  {Array.from({ length: 5 }).map((_, i) => {
                    const x = 370 + i * 92;
                    const y = 120;
                    return (
                      <g key={i}>
                        <rect x={x} y={y} width={74} height={74} rx={16} fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.22)" />
                        <text x={x + 22} y={y + 44} fontSize="12" fontWeight="900" fill="#052e2b">V{i + 1}</text>
                      </g>
                    );
                  })}

                  <path d="M 260 140 L 330 140" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
                  <circle className="anim-dot" cx="260" cy="140" r="7" fill="#7c3aed" />

                  <text x="370" y="212" fontSize="12" fill="rgba(0,0,0,0.55)">verify signatures → execute → replicate state</text>
                </>
              )}
            </svg>
          ) : null}

          {/* M2: match repo’s stepper style with clear lifecycle */}
          {lessonId === 'm2-identity-and-authentication' ? (
            <svg key={key + ':' + clampedStep} viewBox="0 0 900 240" className="h-[170px] w-full">
              {['Create', 'Sign', 'Submit', 'Process', 'Confirm'].map((t, i) => {
                const x = 45 + i * 170;
                const active = i <= clampedStep;
                return (
                  <g key={t}>
                    <rect
                      x={x}
                      y={76}
                      width={150}
                      height={92}
                      rx={18}
                      fill={active ? 'rgba(124,58,237,0.10)' : 'rgba(0,0,0,0.03)'}
                      stroke={active ? 'rgba(124,58,237,0.28)' : 'rgba(0,0,0,0.10)'}
                    />
                    <text x={x + 18} y={116} fontSize="14" fontWeight="900" fill="#0b1411">{t}</text>
                    <text x={x + 18} y={140} fontSize="12" fill="rgba(0,0,0,0.55)">
                      {i === 1 ? 'wallet UI' : i === 3 ? 'validators' : 'step'}
                    </text>
                    {i < 4 ? <path d={`M ${x + 150} 122 L ${x + 170} 122`} stroke="rgba(0,0,0,0.16)" strokeWidth="2" /> : null}
                  </g>
                );
              })}
              <circle className="anim-dot" cx={185 + clampedStep * 170} cy={122} r="7" fill="#7c3aed" />
            </svg>
          ) : null}

          {/* M3: consensus ordering */}
          {lessonId === 'm3-consensus-input-not-memory' ? (
            <svg key={key + ':' + clampedStep} viewBox="0 0 900 240" className="h-[170px] w-full">
              <rect x="45" y="60" width="360" height="160" rx="20" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.10)" />
              <text x="75" y="92" fontSize="14" fontWeight="900" fill="#0b1411">Incoming pool</text>
              {['TxA', 'TxB', 'TxC', 'TxD'].map((t, i) => {
                const x = 80 + i * 76;
                const y = 122;
                return (
                  <g key={t}>
                    <rect x={x} y={y} width={60} height={38} rx={12} fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.22)" />
                    <text x={x + 17} y={y + 25} fontSize="12" fontWeight="900" fill="#1f1147">{t}</text>
                  </g>
                );
              })}

              <rect x="470" y="60" width="385" height="160" rx="20" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.22)" />
              <text x="500" y="92" fontSize="14" fontWeight="900" fill="#052e2b">Canonical order</text>

              {['TxB', 'TxD', 'TxA', 'TxC'].slice(0, Math.max(1, clampedStep + 1)).map((t, i) => {
                const x = 505 + i * 86;
                const y = 128;
                return (
                  <g key={t}>
                    <rect x={x} y={y} width={70} height={42} rx={14} fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.30)" />
                    <text x={x + 20} y={y + 27} fontSize="12" fontWeight="900" fill="#052e2b">{t}</text>
                  </g>
                );
              })}

              <path d="M 405 140 L 470 140" stroke="rgba(0,0,0,0.16)" strokeWidth="2" />
              <circle className="anim-dot" cx={405 + clampedStep * 20} cy={140} r="7" fill="#7c3aed" />
            </svg>
          ) : null}

          {/* M4 */}
          {lessonId === 'm4-account-file' ? (
            <svg key={key} viewBox="0 0 900 240" className="h-[170px] w-full">
              <text x="45" y="34" fontSize="12" fill="rgba(0,0,0,0.55)">Account = file with fields. Owner program controls writes.</text>
              <rect x="60" y="55" width="780" height="170" rx="22" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.10)" />
              {[
                { t: 'lamports', c: 'rgba(16,185,129,0.12)' },
                { t: 'data', c: 'rgba(124,58,237,0.10)' },
                { t: 'owner', c: 'rgba(0,0,0,0.04)' },
                { t: 'executable', c: 'rgba(16,185,129,0.10)' },
              ].map((x, i) => (
                <g key={x.t}>
                  <rect x={100 + i * 185} y={96} width={170} height={90} rx={18} fill={x.c} stroke="rgba(0,0,0,0.10)" />
                  <text x={120 + i * 185} y={134} fontSize="14" fontWeight="900" fill="#0b1411">{x.t}</text>
                  <text x={120 + i * 185} y={156} fontSize="12" fill="rgba(0,0,0,0.55)">field</text>
                </g>
              ))}
            </svg>
          ) : null}

          {/* M5 */}
          {lessonId === 'm5-program-library' ? (
            <svg key={key} viewBox="0 0 900 240" className="h-[170px] w-full">
              <text x="45" y="34" fontSize="12" fill="rgba(0,0,0,0.55)">Seeds + program id deterministically derive a PDA (no private key).</text>

              <rect x="55" y="80" width="240" height="120" rx="20" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.10)" />
              <text x="92" y="124" fontSize="14" fontWeight="900" fill="#0b1411">Seeds</text>
              <text x="92" y="148" fontSize="12" fill="rgba(0,0,0,0.55)">"profile" + user</text>

              <rect x="340" y="80" width="240" height="120" rx="20" fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.28)" />
              <text x="375" y="124" fontSize="14" fontWeight="900" fill="#1f1147">Program ID</text>
              <text x="375" y="148" fontSize="12" fill="rgba(0,0,0,0.55)">authority</text>

              <rect x="625" y="80" width="220" height="120" rx="20" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.28)" />
              <text x="665" y="124" fontSize="14" fontWeight="900" fill="#052e2b">PDA</text>
              <text x="665" y="148" fontSize="12" fill="rgba(0,0,0,0.55)">derived address</text>

              <path d="M 295 140 L 340 140" stroke="rgba(0,0,0,0.16)" strokeWidth="2" />
              <path d="M 580 140 L 625 140" stroke="rgba(0,0,0,0.16)" strokeWidth="2" />
              <circle className="anim-dot" cx="295" cy="140" r="7" fill="#7c3aed" />
            </svg>
          ) : null}

          {/* M6 */}
          {lessonId === 'm6-environment-setup-minimal' ? (
            <svg key={key} viewBox="0 0 900 240" className="h-[170px] w-full">
              <text x="45" y="34" fontSize="12" fill="rgba(0,0,0,0.55)">Checklist: build a minimal loop before installing everything.</text>
              <rect x="60" y="60" width="780" height="160" rx="20" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.10)" />

              {['Rust', 'Solana CLI', 'Node.js', 'Anchor (optional)'].map((t, i) => (
                <g key={t}>
                  <rect x="105" y={92 + i * 34} width="22" height="22" rx="6" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.30)" />
                  <path className="anim-check" d={`M 112 ${107 + i * 34} L 116 ${111 + i * 34} L 123 ${100 + i * 34}`} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="145" y={108 + i * 34} fontSize="13" fontWeight="900" fill="#0b1411">{t}</text>
                </g>
              ))}
            </svg>
          ) : null}

          {/* M7 */}
          {lessonId === 'm7-coding-with-claude' ? (
            <svg key={key + ':' + clampedStep} viewBox="0 0 900 240" className="h-[170px] w-full">
              {['Goal', 'Constraints', 'Review', 'Test'].map((t, i) => {
                const x = 75 + i * 200;
                const active = i <= clampedStep;
                return (
                  <g key={t}>
                    <rect x={x} y={86} width={170} height={86} rx={18} fill={active ? 'rgba(16,185,129,0.10)' : 'rgba(0,0,0,0.03)'} stroke={active ? 'rgba(16,185,129,0.28)' : 'rgba(0,0,0,0.10)'} />
                    <text x={x + 18} y={124} fontSize="14" fontWeight="900" fill="#0b1411">{t}</text>
                    <text x={x + 18} y={146} fontSize="12" fill="rgba(0,0,0,0.55)">prompt block</text>
                    {i < 3 ? <path d={`M ${x + 170} 129 L ${x + 200} 129`} stroke="rgba(0,0,0,0.16)" strokeWidth="2" /> : null}
                  </g>
                );
              })}
              <circle className="anim-dot" cx={150 + clampedStep * 200} cy={129} r="7" fill="#7c3aed" />
            </svg>
          ) : null}
        </div>
      </div>

      {steps ? <Stepper steps={steps} step={clampedStep} setStep={setStep} /> : null}

      <style jsx>{`
        .academy-anim.is-paused :global(*) {
          animation-play-state: paused !important;
        }

        .anim-dot {
          animation: dot-move 2.2s ease-in-out infinite;
        }

        .anim-check {
          animation: check-draw 2.2s ease-in-out infinite;
        }

        @keyframes dot-move {
          0% {
            transform: translateX(0);
            opacity: 0.6;
          }
          50% {
            transform: translateX(110px);
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 0.6;
          }
        }

        @keyframes check-draw {
          0% {
            stroke-dasharray: 40;
            stroke-dashoffset: 40;
            opacity: 0.35;
          }
          50% {
            stroke-dasharray: 40;
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dasharray: 40;
            stroke-dashoffset: 40;
            opacity: 0.35;
          }
        }
      `}</style>
    </Frame>
  );
}
