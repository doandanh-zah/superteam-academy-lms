'use client';

import { useMemo, useState } from 'react';

const STEPS = [
  { title: 'Collect Inputs', description: 'Transactions arrive from many clients into a shared pool of inputs.' },
  { title: 'Propose Order', description: 'A leader proposes an ordering of those inputs for the next block.' },
  { title: 'Vote & Validate', description: 'Validators verify the proposal and vote on the ordering.' },
  { title: 'Finalize Order', description: 'The ordered inputs become the canonical history for the network.' },
] as const;

export default function ConsensusStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const active = STEPS[currentStep];
  const progressPercent = useMemo(() => Math.round(((currentStep + 1) / STEPS.length) * 100), [currentStep]);

  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 p-4 backdrop-blur-xl">
      <div className="text-xs text-black/50">Animation</div>
      <div className="text-sm font-extrabold text-black">Consensus Input Stepper</div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-xs text-black/60">{active.description}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-extrabold hover:bg-white disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={currentStep === STEPS.length - 1}
            className="rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-extrabold disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentStep(0)}
            className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-extrabold hover:bg-white"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
        <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
        {STEPS.map((s, idx) => {
          const state = idx < currentStep ? 'complete' : idx === currentStep ? 'active' : 'pending';
          const cls =
            state === 'active'
              ? 'border-emerald-600/35 bg-emerald-500/10'
              : state === 'complete'
                ? 'border-black/10 bg-white/70'
                : 'border-black/10 bg-white/50';
          return (
            <button
              key={s.title}
              type="button"
              onClick={() => setCurrentStep(idx)}
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
