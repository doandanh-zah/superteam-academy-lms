export type TrackId = 'foundations' | 'anchor' | 'credentials';

export type QuizChoice = { id: string; label: string };
export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: QuizChoice[];
  correctChoiceId: string;
  explanation: string;
};

export type Lesson = {
  id: string;
  track: TrackId;
  title: string;
  minutes: number;
  content: {
    md: string;
    callouts?: { title: string; body: string }[];
  };
  quiz: QuizQuestion[];
};

export const TRACKS: { id: TrackId; title: string; subtitle: string }[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    subtitle: 'Accounts, transactions, fees, and the mental model',
  },
  {
    id: 'anchor',
    title: 'Anchor',
    subtitle: 'PDAs, accounts, IDL, and safe patterns',
  },
  {
    id: 'credentials',
    title: 'Credentials',
    subtitle: 'Token-2022 XP + evolving credentials (concepts)',
  },
];

export const LESSONS: Lesson[] = [
  {
    id: 'accounts-and-signatures',
    track: 'foundations',
    title: 'Accounts & Signatures',
    minutes: 7,
    content: {
      md: `# Accounts & Signatures\n\nOn Solana, *everything is an account*. Accounts hold data (state) and lamports.\n\nA **signature** proves that a private key approved an action. Transactions can require multiple signatures (multisig patterns).\n\n## Key idea\nA program can only write to accounts that are marked as writable *and* passed into the instruction.\n\n## Practical checklist\n- Always verify the signer you expect is present.\n- Be careful with writable accounts: writable = mutable state = risk.\n`,
      callouts: [
        {
          title: 'Security mindset',
          body: 'If an account is writable and user-controlled, assume it can be tampered with. Validate invariants in-program.',
        },
      ],
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'What does a transaction signature prove?',
        choices: [
          { id: 'a', label: 'That a program executed successfully' },
          { id: 'b', label: 'That a private key approved the message' },
          { id: 'c', label: 'That the RPC node is trusted' },
        ],
        correctChoiceId: 'b',
        explanation: 'A signature proves the holder of the private key approved (signed) the transaction message.',
      },
      {
        id: 'q2',
        prompt: 'A Solana program can modify which accounts?',
        choices: [
          { id: 'a', label: 'Any account on chain' },
          { id: 'b', label: 'Only accounts passed into the instruction and marked writable' },
          { id: 'c', label: 'Only the payer account' },
        ],
        correctChoiceId: 'b',
        explanation: 'Programs can only read/write accounts provided to them. Writes require the account to be writable.',
      },
    ],
  },
  {
    id: 'transactions-and-fees',
    track: 'foundations',
    title: 'Transactions, Blockhashes & Fees',
    minutes: 8,
    content: {
      md: `# Transactions, Blockhashes & Fees\n\nA transaction contains:\n- a **message** (instructions + accounts)\n- signatures\n\n## Recent blockhash\nSolana uses a recent blockhash to prevent replay. It also defines the transaction validity window.\n\n## Fees\nFees are paid in SOL. Complex transactions (more compute, more account writes) can cost more.\n\n## Practical\n- If your tx fails with 'blockhash not found', fetch a new blockhash and rebuild.\n`,
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'Why does Solana include a recent blockhash in the transaction message?',
        choices: [
          { id: 'a', label: 'To compress the transaction size' },
          { id: 'b', label: 'To prevent replay and bound validity' },
          { id: 'c', label: 'To choose the leader schedule' },
        ],
        correctChoiceId: 'b',
        explanation: 'A recent blockhash prevents replay and enforces a validity window for the transaction.',
      },
    ],
  },
  {
    id: 'pda-and-seeds',
    track: 'anchor',
    title: 'PDAs & Seeds (Anchor)',
    minutes: 9,
    content: {
      md: `# PDAs & Seeds (Anchor)\n\nA **Program Derived Address (PDA)** is an address controlled by a program (not by a private key).\n\n## Why PDAs matter\nPDAs are used for:\n- deterministic state accounts\n- authority accounts owned by the program\n\n## Seeds\nA PDA is derived from:\n- program id\n- seeds (bytes)\n- bump\n\nIn Anchor, you declare PDAs in account constraints and Anchor verifies them for you.\n`,
      callouts: [
        {
          title: 'Tip',
          body: 'Use stable, human-readable seed prefixes (e.g. "course", "enrollment") to avoid collisions and keep your account model clear.',
        },
      ],
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'What controls a PDA?',
        choices: [
          { id: 'a', label: 'A private key' },
          { id: 'b', label: 'The program (via seeds + bump)' },
          { id: 'c', label: 'The RPC node' },
        ],
        correctChoiceId: 'b',
        explanation: 'PDAs are controlled by the program logic; they are derived deterministically from seeds and the program id.',
      },
    ],
  },
  {
    id: 'anchor-security-checklist',
    track: 'anchor',
    title: 'Anchor Security Checklist',
    minutes: 8,
    content: {
      md: `# Anchor Security Checklist\n\nA fast checklist you should apply to every instruction:\n\n- **Signer checks**: is the expected authority a signer?\n- **Ownership checks**: is the account owned by the program you expect?\n- **PDA checks**: are seeds + bump validated?\n- **Math**: check for overflow, use safe math as needed.\n- **State invariants**: enforce them every time (not only on init).\n\nIf you only remember one thing: *Never trust client-provided accounts without verifying them.*\n`,
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'Which is the most important mindset for on-chain programs?',
        choices: [
          { id: 'a', label: 'Assume the client is honest' },
          { id: 'b', label: 'Assume any input can be malicious and validate invariants' },
          { id: 'c', label: 'Rely on UI validation' },
        ],
        correctChoiceId: 'b',
        explanation: 'On-chain code must treat client inputs as adversarial. Validate signers, ownership, PDAs, and invariants.',
      },
    ],
  },
  {
    id: 'token2022-xp-and-levels',
    track: 'credentials',
    title: 'Token-2022 XP & Levels (Concept)',
    minutes: 9,
    content: {
      md: `# Token-2022 XP & Levels\n\nThe listing spec suggests XP as a **non-transferable** Token-2022 balance.\n\n## What this means\n- XP is a token balance you can query on-chain\n- Non-transferable => users cannot sell or transfer XP\n\n## Levels\nA simple formula example:\n\n\`\`\`txt\nlevel = floor(sqrt(xp / 100))\n\`\`\`\n\nThis creates diminishing returns: early progress feels fast, later levels require more effort.\n`,
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'Why make XP non-transferable?',
        choices: [
          { id: 'a', label: 'To increase token volatility' },
          { id: 'b', label: 'To ensure XP represents learning, not trading' },
          { id: 'c', label: 'To reduce RPC costs' },
        ],
        correctChoiceId: 'b',
        explanation: 'Non-transferable XP prevents marketplaces from undermining the meaning of progress.',
      },
    ],
  },
  {
    id: 'evolving-credentials-cnft',
    track: 'credentials',
    title: 'Evolving Credentials via cNFT (Concept)',
    minutes: 9,
    content: {
      md: `# Evolving Credentials via Compressed NFTs\n\nInstead of minting many NFTs, the spec suggests:\n- one cNFT per learning track\n- it **upgrades** as the learner progresses\n\n## Benefits\n- less wallet clutter\n- clear progression artifact\n- verifiable credential\n\nIn an MVP, you can start with a receipt on-chain and later upgrade to Bubblegum cNFTs.\n`,
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'What is the main UX advantage of an evolving credential?',
        choices: [
          { id: 'a', label: 'More NFTs in wallet' },
          { id: 'b', label: 'Less clutter: one credential that upgrades' },
          { id: 'c', label: 'It removes the need for signatures' },
        ],
        correctChoiceId: 'b',
        explanation: 'Evolving credentials keep the wallet clean by representing a track with one upgrading asset.',
      },
    ],
  },
];

export function lessonsByTrack(track: TrackId): Lesson[] {
  return LESSONS.filter((l) => l.track === track);
}

export function findLesson(track: TrackId, lessonId: string): Lesson {
  const l = LESSONS.find((x) => x.track === track && x.id === lessonId);
  if (!l) throw new Error('Lesson not found');
  return l;
}

export function firstLessonId(track: TrackId): string {
  const l = lessonsByTrack(track)[0];
  return l?.id || '';
}
