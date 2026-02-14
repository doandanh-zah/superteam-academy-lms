'use client';

import { useMemo, useState } from 'react';

type Fn = 'add' | 'sub' | 'mul';

export default function ComputerFlow() {
  const [value, setValue] = useState(10);
  const [input, setInput] = useState(5);
  const [fn, setFn] = useState<Fn>('add');
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [active, setActive] = useState<'input' | 'decode' | 'execute' | 'memory' | 'output' | 'share'>('input');

  const cmd = useMemo(() => {
    const prev = value;
    let next = prev;
    let symbol = '+';
    let label = 'ADD';
    if (fn === 'add') {
      next = prev + input;
      symbol = '+';
      label = 'ADD';
    }
    if (fn === 'sub') {
      next = prev - input;
      symbol = '-';
      label = 'SUB';
    }
    if (fn === 'mul') {
      next = prev * input;
      symbol = '×';
      label = 'MUL';
    }
    return { prev, next, symbol, label };
  }, [fn, input, value]);

  function doStep() {
    const steps: Array<typeof active> = ['input', 'decode', 'execute', 'memory', 'output', 'share'];
    const nextStep = (step + 1) as any;
    const current = steps[step];
    setActive(current);

    if (current === 'memory') {
      setValue(cmd.next);
    }

    if (step >= 5) {
      setStep(0);
      setActive('input');
      return;
    }
    setStep(nextStep);
  }

  function reset() {
    setValue(10);
    setInput(5);
    setFn('add');
    setStep(0);
    setActive('input');
  }

  const nodeCls = (k: typeof active) =>
    `rounded-2xl border px-4 py-3 transition ${
      active === k ? 'border-emerald-600/35 bg-emerald-500/10' : 'border-black/10 bg-white/55'
    }`;

  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 p-4 backdrop-blur-xl">
      <div className="text-xs text-black/50">Animation</div>
      <div className="text-sm font-extrabold text-black">Computer Flow: input → decode → execute → memory → output → share</div>

      <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <label className="text-xs text-black/60">
            Input
            <input
              value={input}
              onChange={(e) => setInput(Number(e.target.value || 0))}
              type="number"
              className="mt-1 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-black/60">
            Function
            <select
              value={fn}
              onChange={(e) => setFn(e.target.value as Fn)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm"
            >
              <option value="add">add (+)</option>
              <option value="sub">subtract (-)</option>
              <option value="mul">multiply (×)</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button onClick={doStep} className="mt-5 rounded-full bg-emerald-600 text-white font-extrabold px-4 py-2 text-sm">
              Step
            </button>
            <button onClick={reset} className="mt-5 rounded-full border border-black/10 bg-white/70 font-extrabold px-4 py-2 text-sm">
              Reset
            </button>
          </div>
        </div>

        <div className="text-xs text-black/60">
          Current state value: <span className="font-mono font-bold text-black">{value}</span>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-3">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-2 items-stretch">
          <div className={nodeCls('input')}>
            <div className="text-xs text-black/50">Input</div>
            <div className="text-sm font-extrabold">{input}</div>
          </div>
          <div className={nodeCls('decode')}>
            <div className="text-xs text-black/50">Decode</div>
            <div className="text-sm font-extrabold">{cmd.label} {input}</div>
          </div>
          <div className={nodeCls('execute')}>
            <div className="text-xs text-black/50">Execute</div>
            <div className="text-sm font-extrabold">{cmd.prev} {cmd.symbol} {input}</div>
          </div>
          <div className={nodeCls('memory')}>
            <div className="text-xs text-black/50">Memory</div>
            <div className="text-sm font-extrabold">{value}</div>
          </div>
          <div className={nodeCls('output')}>
            <div className="text-xs text-black/50">Output</div>
            <div className="text-sm font-extrabold">{value}</div>
          </div>
          <div className={nodeCls('share')}>
            <div className="text-xs text-black/50">Another computer</div>
            <div className="text-sm font-extrabold">reads {value}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-black/60">
        This mirrors the upstream “computer-flow” concept: inputs are processed; memory/state changes; others can read the result.
      </div>
    </div>
  );
}
