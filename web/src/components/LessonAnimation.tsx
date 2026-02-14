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
  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 p-4 sm:p-5 backdrop-blur-xl">
      {children}
    </div>
  );
}

// Minimal, professional SVG animations. We avoid heavy libs and keep it mobile-friendly.
export default function LessonAnimation({ lessonId }: Props) {
  const [playing, setPlaying] = useState(true);
  const [resetTick, setResetTick] = useState(0);

  const title = useMemo(() => {
    switch (lessonId) {
      case 'accounts-and-signatures':
        return 'How signing authorizes state changes';
      case 'transactions-and-fees':
        return 'Blockhash validity + fee payment';
      case 'pda-and-seeds':
        return 'Seeds + program id → deterministic PDA';
      case 'anchor-security-checklist':
        return 'Guardrails before state mutation';
      case 'token2022-xp-and-levels':
        return 'Non-transferable XP → level progression';
      case 'evolving-credentials-cnft':
        return 'One credential that upgrades over time';
      default:
        return 'Concept animation';
    }
  }, [lessonId]);

  const key = `${lessonId}:${resetTick}`;
  const cls = playing ? 'is-playing' : 'is-paused';

  return (
    <Frame>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs text-black/50">Animation</div>
          <div className="text-sm font-extrabold text-black">{title}</div>
        </div>
        <div className="flex gap-2">
          <ControlButton onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</ControlButton>
          <ControlButton
            onClick={() => {
              setPlaying(false);
              setResetTick((t) => t + 1);
              // resume after reset feels better
              setTimeout(() => setPlaying(true), 50);
            }}
          >
            Reset
          </ControlButton>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white/70">
        <div className={`academy-anim ${cls}`}>
          {lessonId === 'accounts-and-signatures' ? (
            <svg key={key} viewBox="0 0 900 220" className="h-[160px] w-full">
              <rect x="20" y="40" width="220" height="140" rx="24" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.35)" />
              <text x="55" y="78" fontSize="16" fontWeight="700" fill="#052e2b">Signer Wallet</text>
              <text x="55" y="104" fontSize="13" fill="rgba(0,0,0,0.55)">private key</text>

              <rect x="340" y="40" width="220" height="140" rx="24" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.12)" />
              <text x="385" y="78" fontSize="16" fontWeight="700" fill="#0b1411">Tx Message</text>
              <text x="385" y="104" fontSize="13" fill="rgba(0,0,0,0.55)">instructions + accounts</text>

              <rect x="660" y="40" width="220" height="140" rx="24" fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.30)" />
              <text x="705" y="78" fontSize="16" fontWeight="700" fill="#1f1147">Runtime</text>
              <text x="705" y="104" fontSize="13" fill="rgba(0,0,0,0.55)">checks signatures</text>

              <path d="M 240 110 L 340 110" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
              <path d="M 560 110 L 660 110" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />

              <circle className="anim-dot anim-dot-1" cx="240" cy="110" r="7" fill="#10b981" />
              <circle className="anim-dot anim-dot-2" cx="560" cy="110" r="7" fill="#7c3aed" />

              <text x="365" y="158" fontSize="12" fill="rgba(0,0,0,0.55)">signature attaches to the message</text>
            </svg>
          ) : null}

          {lessonId === 'transactions-and-fees' ? (
            <svg key={key} viewBox="0 0 900 220" className="h-[160px] w-full">
              <rect x="30" y="52" width="260" height="116" rx="24" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.12)" />
              <text x="70" y="90" fontSize="16" fontWeight="700" fill="#0b1411">Tx Message</text>
              <text x="70" y="114" fontSize="13" fill="rgba(0,0,0,0.55)">recent blockhash</text>

              <rect x="340" y="52" width="260" height="116" rx="24" fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.30)" />
              <text x="385" y="90" fontSize="16" fontWeight="700" fill="#1f1147">Validity Window</text>
              <text x="385" y="114" fontSize="13" fill="rgba(0,0,0,0.55)">expires quickly</text>

              <rect x="650" y="52" width="220" height="116" rx="24" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.35)" />
              <text x="690" y="90" fontSize="16" fontWeight="700" fill="#052e2b">Fee Payer</text>
              <text x="690" y="114" fontSize="13" fill="rgba(0,0,0,0.55)">pays SOL fees</text>

              <path d="M 290 110 L 340 110" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
              <path d="M 600 110 L 650 110" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />

              <rect className="anim-timer" x="370" y="140" width="200" height="10" rx="5" fill="rgba(124,58,237,0.22)" />
              <rect x="370" y="140" width="200" height="10" rx="5" fill="rgba(0,0,0,0.06)" />
              <text x="370" y="165" fontSize="12" fill="rgba(0,0,0,0.55)">if expired → fetch new blockhash</text>
            </svg>
          ) : null}

          {lessonId === 'pda-and-seeds' ? (
            <svg key={key} viewBox="0 0 900 220" className="h-[160px] w-full">
              <rect x="35" y="52" width="230" height="116" rx="24" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.12)" />
              <text x="75" y="92" fontSize="16" fontWeight="800" fill="#0b1411">Seeds</text>
              <text x="75" y="116" fontSize="13" fill="rgba(0,0,0,0.55)">"course" + user</text>

              <rect x="305" y="52" width="230" height="116" rx="24" fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.30)" />
              <text x="342" y="92" fontSize="16" fontWeight="800" fill="#1f1147">Program ID</text>
              <text x="342" y="116" fontSize="13" fill="rgba(0,0,0,0.55)">unique authority</text>

              <rect x="575" y="52" width="290" height="116" rx="24" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.35)" />
              <text x="615" y="92" fontSize="16" fontWeight="800" fill="#052e2b">Derived PDA</text>
              <text x="615" y="116" fontSize="13" fill="rgba(0,0,0,0.55)">deterministic address</text>

              <path d="M 265 110 L 305 110" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
              <path d="M 535 110 L 575 110" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />

              <circle className="anim-dot anim-dot-1" cx="265" cy="110" r="7" fill="#0b1411" opacity="0.35" />
              <circle className="anim-dot anim-dot-2" cx="535" cy="110" r="7" fill="#7c3aed" />

              <text x="615" y="148" fontSize="12" fill="rgba(0,0,0,0.55)">Anchor verifies seeds + bump</text>
            </svg>
          ) : null}

          {lessonId === 'anchor-security-checklist' ? (
            <svg key={key} viewBox="0 0 900 220" className="h-[160px] w-full">
              <rect x="45" y="40" width="330" height="140" rx="28" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.12)" />
              <text x="80" y="80" fontSize="16" fontWeight="800" fill="#0b1411">Incoming Instruction</text>
              <text x="80" y="104" fontSize="13" fill="rgba(0,0,0,0.55)">accounts + args</text>

              <rect x="425" y="40" width="430" height="140" rx="28" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.30)" />
              <text x="460" y="80" fontSize="16" fontWeight="800" fill="#052e2b">Checks (must pass)</text>

              <g className="anim-checks">
                <text x="460" y="110" fontSize="13" fill="rgba(0,0,0,0.65)">• signer</text>
                <text x="560" y="110" fontSize="13" fill="rgba(0,0,0,0.65)">• owner</text>
                <text x="660" y="110" fontSize="13" fill="rgba(0,0,0,0.65)">• PDA</text>
                <text x="740" y="110" fontSize="13" fill="rgba(0,0,0,0.65)">• invariants</text>
              </g>

              <path d="M 375 110 L 425 110" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
              <circle className="anim-dot anim-dot-1" cx="375" cy="110" r="7" fill="#0b1411" opacity="0.35" />

              <text x="460" y="148" fontSize="12" fill="rgba(0,0,0,0.55)">Only then mutate state</text>
            </svg>
          ) : null}

          {lessonId === 'token2022-xp-and-levels' ? (
            <svg key={key} viewBox="0 0 900 220" className="h-[160px] w-full">
              <rect x="45" y="52" width="360" height="116" rx="28" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.30)" />
              <text x="80" y="92" fontSize="16" fontWeight="800" fill="#052e2b">XP Token (non-transferable)</text>
              <text x="80" y="116" fontSize="13" fill="rgba(0,0,0,0.55)">balance represents learning</text>

              <rect x="455" y="52" width="400" height="116" rx="28" fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.30)" />
              <text x="490" y="92" fontSize="16" fontWeight="800" fill="#1f1147">Levels</text>
              <text x="490" y="116" fontSize="13" fill="rgba(0,0,0,0.55)">diminishing returns</text>

              <path d="M 405 110 L 455 110" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
              <circle className="anim-dot anim-dot-1" cx="405" cy="110" r="7" fill="#10b981" />

              <g className="anim-bars">
                <rect x="490" y="132" width="60" height="8" rx="4" fill="rgba(124,58,237,0.30)" />
                <rect x="560" y="132" width="45" height="8" rx="4" fill="rgba(124,58,237,0.22)" />
                <rect x="615" y="132" width="34" height="8" rx="4" fill="rgba(124,58,237,0.18)" />
                <rect x="660" y="132" width="26" height="8" rx="4" fill="rgba(124,58,237,0.15)" />
              </g>

              <text x="490" y="158" fontSize="12" fill="rgba(0,0,0,0.55)">early levels feel fast</text>
            </svg>
          ) : null}

          {lessonId === 'evolving-credentials-cnft' ? (
            <svg key={key} viewBox="0 0 900 220" className="h-[160px] w-full">
              <rect x="65" y="52" width="270" height="116" rx="28" fill="rgba(124,58,237,0.10)" stroke="rgba(124,58,237,0.30)" />
              <text x="105" y="92" fontSize="16" fontWeight="800" fill="#1f1147">One Credential</text>
              <text x="105" y="116" fontSize="13" fill="rgba(0,0,0,0.55)">stored in wallet</text>

              <rect x="385" y="52" width="450" height="116" rx="28" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.30)" />
              <text x="420" y="92" fontSize="16" fontWeight="800" fill="#052e2b">Upgrades Over Time</text>
              <text x="420" y="116" fontSize="13" fill="rgba(0,0,0,0.55)">same asset, higher level</text>

              <path d="M 335 110 L 385 110" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
              <circle className="anim-dot anim-dot-1" cx="335" cy="110" r="7" fill="#7c3aed" />

              <g className="anim-badge">
                <circle cx="760" cy="120" r="22" fill="rgba(16,185,129,0.18)" stroke="rgba(16,185,129,0.35)" />
                <text x="750" y="126" fontSize="16" fontWeight="900" fill="#052e2b">1</text>
              </g>
              <text x="420" y="158" fontSize="12" fill="rgba(0,0,0,0.55)">future: Bubblegum cNFT</text>
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
        .anim-dot-2 {
          animation-delay: 0.35s;
        }

        .anim-timer {
          animation: timer-shrink 2.4s ease-in-out infinite;
        }

        .anim-checks {
          animation: checks-pulse 2.4s ease-in-out infinite;
        }

        .anim-bars {
          transform-origin: 490px 136px;
          animation: bars-pulse 2.6s ease-in-out infinite;
        }

        .anim-badge {
          transform-origin: 760px 120px;
          animation: badge-upgrade 2.8s ease-in-out infinite;
        }

        @keyframes dot-move {
          0% {
            transform: translateX(0);
            opacity: 0.65;
          }
          50% {
            transform: translateX(95px);
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 0.65;
          }
        }

        @keyframes timer-shrink {
          0% {
            width: 200px;
            opacity: 0.9;
          }
          70% {
            width: 16px;
            opacity: 0.95;
          }
          100% {
            width: 200px;
            opacity: 0.9;
          }
        }

        @keyframes checks-pulse {
          0% {
            opacity: 0.45;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-2px);
          }
          100% {
            opacity: 0.45;
            transform: translateY(0);
          }
        }

        @keyframes bars-pulse {
          0% {
            opacity: 0.55;
            transform: translateY(0);
          }
          55% {
            opacity: 1;
            transform: translateY(-2px);
          }
          100% {
            opacity: 0.55;
            transform: translateY(0);
          }
        }

        @keyframes badge-upgrade {
          0% {
            transform: scale(1);
            opacity: 0.75;
          }
          45% {
            transform: scale(1.06);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.75;
          }
        }
      `}</style>
    </Frame>
  );
}
