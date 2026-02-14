'use client';

import { useMemo, useState } from 'react';

type Props = {
  lessonId: string;
};

function ControlButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-black/10 bg-white/55 px-3 py-1 text-xs font-extrabold hover:bg-white"
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
        return 'Signing flow: create → sign → submit → confirm';
      case 'm3-consensus-input-not-memory':
        return 'Consensus: ordering inputs';
      case 'm4-account-file':
        return 'Account fields + ownership rules';
      case 'm5-program-library':
        return 'PDA derivation: seeds + program id → address';
      case 'm6-environment-setup-minimal':
        return 'Minimal setup checklist';
      case 'm7-coding-with-claude':
        return 'Prompt structure for safe code';
      default:
        return 'Concept animation';
    }
  }, [lessonId]);

  return <div className="text-sm font-extrabold text-black">{title}</div>;
}

export default function LessonAnimation({ lessonId }: Props) {
  const [playing, setPlaying] = useState(true);
  const [resetTick, setResetTick] = useState(0);

  const [mode, setMode] = useState<'client-server' | 'p2p'>('client-server');
  const [step, setStep] = useState(0);

  const key = `${lessonId}:${resetTick}`;
  const cls = playing ? 'is-playing' : 'is-paused';

  const controls = (() => {
    if (lessonId === 'm1-blockchain-as-a-computer') {
      return (
        <div className="flex gap-2">
          <ControlButton onClick={() => setMode('client-server')}>Client-Server</ControlButton>
          <ControlButton onClick={() => setMode('p2p')}>P2P</ControlButton>
        </div>
      );
    }

    if (lessonId === 'm2-identity-and-authentication' || lessonId === 'm3-consensus-input-not-memory') {
      return (
        <div className="flex gap-2">
          <ControlButton onClick={() => setStep((s) => Math.max(0, s - 1))}>Prev</ControlButton>
          <ControlButton onClick={() => setStep((s) => Math.min(4, s + 1))}>Next</ControlButton>
        </div>
      );
    }

    if (lessonId === 'm6-environment-setup-minimal' || lessonId === 'm7-coding-with-claude') {
      return null;
    }

    return null;
  })();

  return (
    <Frame>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs text-black/50">Animation</div>
          <Title lessonId={lessonId} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {controls}
          <ControlButton onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</ControlButton>
          <ControlButton
            onClick={() => {
              setPlaying(false);
              setResetTick((t) => t + 1);
              setTimeout(() => setPlaying(true), 50);
            }}
          >
            Reset
          </ControlButton>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white/70">
        <div className={`academy-anim ${cls}`}>
          {/* Module 1: toggle between client-server and p2p */}
          {lessonId === 'm1-blockchain-as-a-computer' ? (
            <svg key={key + ':' + mode} viewBox="0 0 900 240" className="h-[170px] w-full">
              <text x="30" y="32" fontSize="12" fill="rgba(0,0,0,0.55)">
                {mode === 'client-server'
                  ? 'Client → Server → Database (single authority)'
                  : 'Client → Validators (replicate + verify)'}
              </text>

              {mode === 'client-server' ? (
                <>
                  <rect x="40" y="70" width="220" height="140" rx="26" fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.28)" />
                  <text x="90" y="112" fontSize="16" fontWeight="800" fill="#1f1147">Client</text>

                  <rect x="340" y="70" width="220" height="140" rx="26" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.12)" />
                  <text x="408" y="112" fontSize="16" fontWeight="800" fill="#0b1411">Server</text>
                  <text x="395" y="136" fontSize="12" fill="rgba(0,0,0,0.55)">central authority</text>

                  <rect x="640" y="70" width="220" height="140" rx="26" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.30)" />
                  <text x="708" y="112" fontSize="16" fontWeight="800" fill="#052e2b">DB</text>

                  <path d="M 260 140 L 340 140" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
                  <path d="M 560 140 L 640 140" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />

                  <circle className="anim-dot" cx="260" cy="140" r="7" fill="#7c3aed" />
                </>
              ) : (
                <>
                  <rect x="40" y="78" width="220" height="124" rx="26" fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.28)" />
                  <text x="90" y="122" fontSize="16" fontWeight="800" fill="#1f1147">Client</text>

                  <rect x="330" y="64" width="520" height="160" rx="28" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.12)" />
                  <text x="370" y="96" fontSize="14" fontWeight="800" fill="#0b1411">Validators</text>

                  {Array.from({ length: 5 }).map((_, i) => {
                    const x = 370 + i * 92;
                    const y = 120;
                    return (
                      <g key={i}>
                        <rect x={x} y={y} width={74} height={74} rx={18} fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.28)" />
                        <text x={x + 26} y={y + 44} fontSize="12" fontWeight="800" fill="#052e2b">V{i + 1}</text>
                      </g>
                    );
                  })}

                  <path d="M 260 140 L 330 140" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
                  <circle className="anim-dot" cx="260" cy="140" r="7" fill="#7c3aed" />

                  <text x="370" y="212" fontSize="12" fill="rgba(0,0,0,0.55)">many independent checks → replicated state</text>
                </>
              )}
            </svg>
          ) : null}

          {/* Module 2: signing stepper */}
          {lessonId === 'm2-identity-and-authentication' ? (
            <svg key={key + ':' + step} viewBox="0 0 900 240" className="h-[170px] w-full">
              {['Create', 'Sign', 'Submit', 'Process', 'Confirm'].map((t, i) => {
                const x = 45 + i * 170;
                const active = i <= step;
                return (
                  <g key={t}>
                    <rect x={x} y={76} width={150} height={92} rx={24} fill={active ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.03)'} stroke={active ? 'rgba(124,58,237,0.30)' : 'rgba(0,0,0,0.10)'} />
                    <text x={x + 24} y={116} fontSize="14" fontWeight="800" fill="#0b1411">{t}</text>
                    <text x={x + 24} y={140} fontSize="12" fill="rgba(0,0,0,0.55)">{i === 1 ? 'wallet UI' : i === 3 ? 'validators' : 'step'}</text>
                    {i < 4 ? <path d={`M ${x + 150} 122 L ${x + 170} 122`} stroke="rgba(0,0,0,0.18)" strokeWidth="2" /> : null}
                  </g>
                );
              })}
              <circle className="anim-dot" cx={195 + step * 170} cy={122} r="7" fill="#7c3aed" />
              <text x="45" y="34" fontSize="12" fill="rgba(0,0,0,0.55)">Use Prev/Next to step through the signing flow.</text>
            </svg>
          ) : null}

          {/* Module 3: ordering inputs */}
          {lessonId === 'm3-consensus-input-not-memory' ? (
            <svg key={key + ':' + step} viewBox="0 0 900 240" className="h-[170px] w-full">
              <text x="45" y="34" fontSize="12" fill="rgba(0,0,0,0.55)">Consensus: different nodes see transactions, then agree on a single order.</text>

              <rect x="45" y="60" width="360" height="160" rx="28" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.10)" />
              <text x="75" y="92" fontSize="14" fontWeight="800" fill="#0b1411">Incoming (unordered)</text>

              {['TxA', 'TxB', 'TxC', 'TxD'].map((t, i) => {
                const x = 80 + i * 76;
                const y = 120;
                return (
                  <g key={t} opacity={step >= 0 ? 1 : 1}>
                    <rect x={x} y={y} width={60} height={38} rx={14} fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.26)" />
                    <text x={x + 17} y={y + 25} fontSize="12" fontWeight="800" fill="#1f1147">{t}</text>
                  </g>
                );
              })}

              <rect x="470" y="60" width="385" height="160" rx="28" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.26)" />
              <text x="500" y="92" fontSize="14" fontWeight="800" fill="#052e2b">Canonical order</text>

              {['TxB', 'TxD', 'TxA', 'TxC'].slice(0, Math.max(1, step + 1)).map((t, i) => {
                const x = 505 + i * 86;
                const y = 128;
                return (
                  <g key={t}>
                    <rect x={x} y={y} width={70} height={42} rx={16} fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.30)" />
                    <text x={x + 20} y={y + 27} fontSize="12" fontWeight="900" fill="#052e2b">{t}</text>
                  </g>
                );
              })}

              <path d="M 405 140 L 470 140" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
              <circle className="anim-dot" cx={405 + step * 14} cy={140} r="7" fill="#7c3aed" />

              <text x="500" y="206" fontSize="12" fill="rgba(0,0,0,0.55)">Step shows order being finalized.</text>
            </svg>
          ) : null}

          {/* Module 4: account fields */}
          {lessonId === 'm4-account-file' ? (
            <svg key={key} viewBox="0 0 900 240" className="h-[170px] w-full">
              <text x="45" y="34" fontSize="12" fill="rgba(0,0,0,0.55)">An account is like a file with fields and ownership.</text>
              <rect x="60" y="55" width="780" height="170" rx="32" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.10)" />

              {[
                { t: 'lamports', c: 'rgba(16,185,129,0.12)' },
                { t: 'data', c: 'rgba(124,58,237,0.10)' },
                { t: 'owner', c: 'rgba(0,0,0,0.04)' },
                { t: 'executable', c: 'rgba(16,185,129,0.10)' },
              ].map((x, i) => (
                <g key={x.t}>
                  <rect x={100 + i * 185} y={96} width={170} height={90} rx={24} fill={x.c} stroke="rgba(0,0,0,0.10)" />
                  <text x={120 + i * 185} y={134} fontSize="14" fontWeight="900" fill="#0b1411">{x.t}</text>
                  <text x={120 + i * 185} y={156} fontSize="12" fill="rgba(0,0,0,0.55)">field</text>
                </g>
              ))}

              <text x="100" y="212" fontSize="12" fill="rgba(0,0,0,0.55)">Only the owner program can write account data.</text>
            </svg>
          ) : null}

          {/* Module 5: PDA derivation */}
          {lessonId === 'm5-program-library' ? (
            <svg key={key} viewBox="0 0 900 240" className="h-[170px] w-full">
              <text x="45" y="34" fontSize="12" fill="rgba(0,0,0,0.55)">Seeds + program id deterministically derive a PDA.</text>

              <rect x="55" y="80" width="240" height="120" rx="28" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.10)" />
              <text x="92" y="124" fontSize="14" fontWeight="900" fill="#0b1411">Seeds</text>
              <text x="92" y="148" fontSize="12" fill="rgba(0,0,0,0.55)">"profile" + user</text>

              <rect x="340" y="80" width="240" height="120" rx="28" fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.28)" />
              <text x="375" y="124" fontSize="14" fontWeight="900" fill="#1f1147">Program ID</text>
              <text x="375" y="148" fontSize="12" fill="rgba(0,0,0,0.55)">authority</text>

              <rect x="625" y="80" width="220" height="120" rx="28" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.28)" />
              <text x="665" y="124" fontSize="14" fontWeight="900" fill="#052e2b">PDA</text>
              <text x="665" y="148" fontSize="12" fill="rgba(0,0,0,0.55)">derived address</text>

              <path d="M 295 140 L 340 140" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
              <path d="M 580 140 L 625 140" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
              <circle className="anim-dot" cx="295" cy="140" r="7" fill="#7c3aed" />
            </svg>
          ) : null}

          {/* Module 6: setup checklist */}
          {lessonId === 'm6-environment-setup-minimal' ? (
            <svg key={key} viewBox="0 0 900 240" className="h-[170px] w-full">
              <text x="45" y="34" fontSize="12" fill="rgba(0,0,0,0.55)">A minimal setup checklist (visual).</text>
              <rect x="60" y="60" width="780" height="160" rx="28" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.10)" />

              {['Rust', 'Solana CLI', 'Node.js', 'Anchor (optional)'].map((t, i) => (
                <g key={t}>
                  <rect x="105" y={92 + i * 34} width="22" height="22" rx="6" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.30)" />
                  <path className="anim-check" d={`M 112 ${107 + i * 34} L 116 ${111 + i * 34} L 123 ${100 + i * 34}`} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="145" y={108 + i * 34} fontSize="13" fontWeight="800" fill="#0b1411">{t}</text>
                </g>
              ))}
            </svg>
          ) : null}

          {/* Module 7: prompt builder */}
          {lessonId === 'm7-coding-with-claude' ? (
            <svg key={key} viewBox="0 0 900 240" className="h-[170px] w-full">
              <text x="45" y="34" fontSize="12" fill="rgba(0,0,0,0.55)">A strong prompt has 4 parts.</text>
              <rect x="60" y="60" width="780" height="160" rx="28" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.10)" />

              {[
                { t: 'Context', c: 'rgba(0,0,0,0.04)' },
                { t: 'Goal', c: 'rgba(124,58,237,0.10)' },
                { t: 'Constraints', c: 'rgba(16,185,129,0.10)' },
                { t: 'Acceptance', c: 'rgba(0,0,0,0.04)' },
              ].map((x, i) => (
                <g key={x.t}>
                  <rect x={100 + i * 190} y={96} width={170} height={92} rx={24} fill={x.c} stroke="rgba(0,0,0,0.10)" />
                  <text x={120 + i * 190} y={136} fontSize="14" fontWeight="900" fill="#0b1411">{x.t}</text>
                  <text x={120 + i * 190} y={158} fontSize="12" fill="rgba(0,0,0,0.55)">prompt block</text>
                </g>
              ))}

              <circle className="anim-dot" cx="100" cy="142" r="7" fill="#7c3aed" />
            </svg>
          ) : null}
        </div>
      </div>

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
