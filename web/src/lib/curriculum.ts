export type TrackId = 'beginner101';

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
    id: 'beginner101',
    title: 'Solana Rapid-Fire Beginner 101',
    subtitle: 'Upgraded course: interactive animations + deeper explanations + more quizzes',
  },
];

// This curriculum is based on the official-style outline from:
// https://github.com/Lab-Blueprint/Solana-Rapid-Fire-Beginner-101 (docs/module-outline.md)
// We keep the spirit but upgrade the UX, depth, and interactivity.
export const LESSONS: Lesson[] = [
  {
    id: 'm1-blockchain-as-a-computer',
    track: 'beginner101',
    title: 'Module 1: Blockchain as a Computer',
    minutes: 12,
    content: {
      md: `# Blockchain as a Computer

A blockchain is best understood as a **shared computer**.
Not “a database”, not “a website”, but a machine where **many independent operators** agree on what inputs are valid and what the output state becomes.

## Client-server vs shared computer
**Client-server (web2)**
- One server (or one company) owns the database.
- That server decides what is true.
- If the server goes down or changes rules, the system changes.

**Peer-to-peer replication (web3)**
- Transactions are broadcast.
- Many validators verify the same rules.
- The resulting state is replicated.

## Why this model exists
It matters when you need:
- **credible neutrality** (no single admin can rewrite outcomes)
- **public verifiability** (anyone can check)
- coordination between parties who don’t fully trust each other

## What you pay for
You trade speed and simplicity for:
- fees
- stricter rules
- more engineering discipline

That’s why blockchains are not for every app — they’re for the apps where trust and neutrality are worth the cost.
`,
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'Which architecture is centralized?',
        choices: [
          { id: 'a', label: 'Client-server' },
          { id: 'b', label: 'Peer-to-peer replication' },
          { id: 'c', label: 'Many independent validators enforcing rules' },
        ],
        correctChoiceId: 'a',
        explanation: 'Client-server has a central authority that controls data and availability.',
      },
      {
        id: 'q2',
        prompt: 'Why does peer-to-peer replication reduce single points of failure?',
        choices: [
          { id: 'a', label: 'Because any single node can fail and the network still continues' },
          { id: 'b', label: 'Because it uses fewer computers' },
          { id: 'c', label: 'Because it removes cryptography' },
        ],
        correctChoiceId: 'a',
        explanation: 'Replication means the system doesn’t depend on one machine or one organization.',
      },
      {
        id: 'q3',
        prompt: 'What makes a blockchain more than a distributed database?',
        choices: [
          { id: 'a', label: 'It always stores images and files' },
          { id: 'b', label: 'It has verifiable execution rules enforced by independent validators' },
          { id: 'c', label: 'It can never have outages' },
        ],
        correctChoiceId: 'b',
        explanation: 'The key feature is verifiable rule enforcement under adversarial assumptions.',
      },
      {
        id: 'q4',
        prompt: 'What is the main tradeoff of decentralization?',
        choices: [
          { id: 'a', label: 'More coordination cost and complexity' },
          { id: 'b', label: 'No need for fees' },
          { id: 'c', label: 'Unlimited throughput' },
        ],
        correctChoiceId: 'a',
        explanation: 'Replacing a single admin with many actors costs time, fees, and complexity.',
      },
      {
        id: 'q5',
        prompt: 'Blockchains are most useful when…',
        choices: [
          { id: 'a', label: 'You control all participants and trust is not a concern' },
          { id: 'b', label: 'You need shared truth between parties who don’t fully trust each other' },
          { id: 'c', label: 'You need a private database only' },
        ],
        correctChoiceId: 'b',
        explanation: 'The value comes from shared truth and neutral coordination without one owner.',
      },
    ],
  },

  {
    id: 'm2-identity-and-authentication',
    track: 'beginner101',
    title: 'Module 2: Identity & Authentication',
    minutes: 13,
    content: {
      md: `# Identity & Authentication

In web3, a wallet is a **portable identity**.
Instead of “login with password”, you usually **sign a message**.

## Keypairs (what they are)
A wallet has:
- **private key** (secret): used to sign
- **public key** (address): used to verify

If you can sign, you prove you control the private key.

## “Login” vs “Sign”
**Login (web2):**
- Server checks your password.
- If password database leaks, users are exposed.

**Sign (web3):**
- App gives you a message to sign.
- Anyone can verify the signature.
- No password database is required.

## What actually happens in practice
A typical flow:
1) App builds a message/tx
2) Wallet shows approval UI
3) User signs
4) Signature is verified
5) Validators execute the instructions

## RPC nodes (gateways)
Your app talks to an RPC node to:
- fetch chain data
- submit transactions

But RPC nodes aren’t “the chain”. If everyone relies on a few RPCs, user access becomes centralized.
`,
      callouts: [
        {
          title: 'Security note',
          body: 'When signing, always confirm the domain/app you trust. A signature is an approval: treat it like a powerful action.',
        },
      ],
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'What does a signature prove?',
        choices: [
          { id: 'a', label: 'That the transaction is guaranteed to succeed' },
          { id: 'b', label: 'That a private key approved the message' },
          { id: 'c', label: 'That the RPC node is trusted' },
        ],
        correctChoiceId: 'b',
        explanation: 'Signatures prove approval by the private key holder; execution success is separate.',
      },
      {
        id: 'q2',
        prompt: 'Which key verifies a signature?',
        choices: [
          { id: 'a', label: 'Private key' },
          { id: 'b', label: 'Public key' },
          { id: 'c', label: 'Blockhash' },
        ],
        correctChoiceId: 'b',
        explanation: 'Verification uses the signer’s public key.',
      },
      {
        id: 'q3',
        prompt: 'Why is key generation off-chain?',
        choices: [
          { id: 'a', label: 'Because private keys must remain secret; generating locally reduces leakage risk' },
          { id: 'b', label: 'Because validators generate wallets for you' },
          { id: 'c', label: 'Because signatures are optional' },
        ],
        correctChoiceId: 'a',
        explanation: 'Private keys must be secret; local generation keeps them out of shared systems.',
      },
      {
        id: 'q4',
        prompt: 'What is an RPC node in simple terms?',
        choices: [
          { id: 'a', label: 'A wallet that signs for you' },
          { id: 'b', label: 'A gateway that relays requests and serves chain data' },
          { id: 'c', label: 'A smart contract' },
        ],
        correctChoiceId: 'b',
        explanation: 'RPC nodes are access points; they’re not the source of truth (validators are).',
      },
      {
        id: 'q5',
        prompt: 'Signing a message is best described as…',
        choices: [
          { id: 'a', label: 'A cryptographic approval that can be verified by anyone' },
          { id: 'b', label: 'A UI animation with no real meaning' },
          { id: 'c', label: 'A replacement for blockhash' },
        ],
        correctChoiceId: 'a',
        explanation: 'Signing creates a cryptographic proof of approval.',
      },
    ],
  },

  {
    id: 'm3-consensus-input-not-memory',
    track: 'beginner101',
    title: 'Module 3: Consensus (Input, Not Memory)',
    minutes: 13,
    content: {
      md: `# Consensus (Input, Not Memory)

A common misconception: consensus is not “shared RAM”.
Consensus is mainly agreement on **transaction ordering** (inputs).

## The core idea
- Users submit transactions.
- Validators agree on the order.
- The chain’s state is the output of applying those ordered inputs.

If you agree on ordering, you can replay and reproduce the same state.

## Node roles
- **Validators:** verify + execute, produce blocks.
- **RPC nodes:** access layer for apps.
- **Light clients:** verify with minimal data.

## Practical risk: RPC centralization
Even if validators are decentralized, if most apps rely on 1–3 RPC providers:
- outages affect most users
- throttling/censorship becomes practical
- the “user experience layer” centralizes
`,
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'What does consensus primarily agree on?',
        choices: [
          { id: 'a', label: 'The order of transactions (inputs)' },
          { id: 'b', label: 'The UI design of wallets' },
          { id: 'c', label: 'The private keys of users' },
        ],
        correctChoiceId: 'a',
        explanation: 'Consensus is about ordering inputs so everyone can derive the same results.',
      },
      {
        id: 'q2',
        prompt: 'Why can relying on a few RPCs be risky?',
        choices: [
          { id: 'a', label: 'It centralizes user access, increasing outage/censorship impact' },
          { id: 'b', label: 'It makes signatures invalid' },
          { id: 'c', label: 'It removes account ownership rules' },
        ],
        correctChoiceId: 'a',
        explanation: 'Centralized access points create chokepoints even if the chain is decentralized.',
      },
      {
        id: 'q3',
        prompt: 'Validators are responsible for…',
        choices: [
          { id: 'a', label: 'Executing transactions and enforcing protocol rules' },
          { id: 'b', label: 'Designing NFTs' },
          { id: 'c', label: 'Storing your private key' },
        ],
        correctChoiceId: 'a',
        explanation: 'Validators enforce the rules and execute the state transitions.',
      },
      {
        id: 'q4',
        prompt: 'If you have the same ordered inputs and deterministic execution, you get…',
        choices: [
          { id: 'a', label: 'The same resulting state' },
          { id: 'b', label: 'No need for fees' },
          { id: 'c', label: 'Infinite throughput' },
        ],
        correctChoiceId: 'a',
        explanation: 'Determinism + same ordered inputs → same state.',
      },
      {
        id: 'q5',
        prompt: 'Consensus is best described as agreement on…',
        choices: [
          { id: 'a', label: 'A canonical transaction history' },
          { id: 'b', label: 'A single database admin' },
          { id: 'c', label: 'A password reset process' },
        ],
        correctChoiceId: 'a',
        explanation: 'Consensus produces a canonical history that everyone can verify.',
      },
    ],
  },

  {
    id: 'm4-account-file',
    track: 'beginner101',
    title: 'Module 4: Account = File',
    minutes: 14,
    content: {
      md: `# Account = File

On Solana, an account is like a **file** with metadata.
It contains both value (lamports) and optionally structured data.

## Account fields (high level)
- **lamports:** balance
- **data:** bytes (your app state)
- **owner:** program id allowed to write the data
- **executable:** whether this account is a program

## Ownership rule (critical)
Only the program listed as the account’s **owner** can modify its **data**.
Anyone can read it.

## Rent and rent-exemption
Accounts take storage space.
To keep accounts from being reclaimed, many apps make them **rent-exempt** (hold a minimum lamports balance).

## Why code and data are separate
Programs are shared code.
State lives in accounts.
This makes the model composable: many users can call the same program with different accounts.
`,
      callouts: [
        { title: 'Common mistake', body: 'If you do not validate ownership and writable accounts, your program can be tricked into writing to the wrong state.' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'Who can modify an account’s data?',
        choices: [
          { id: 'a', label: 'Anyone who knows the address' },
          { id: 'b', label: 'Only the program that owns the account' },
          { id: 'c', label: 'Only the RPC provider' },
        ],
        correctChoiceId: 'b',
        explanation: 'The owner program is the only entity allowed to write to the account data.',
      },
      {
        id: 'q2',
        prompt: 'What does the “owner” field mean?',
        choices: [
          { id: 'a', label: 'The wallet that created the account' },
          { id: 'b', label: 'The program id that is allowed to modify the account data' },
          { id: 'c', label: 'The RPC endpoint that stores it' },
        ],
        correctChoiceId: 'b',
        explanation: 'Owner is the program that controls write access to the account’s data.',
      },
      {
        id: 'q3',
        prompt: 'What does “rent-exempt” mean?',
        choices: [
          { id: 'a', label: 'The account has enough lamports to persist without being reclaimed' },
          { id: 'b', label: 'The account never needs signatures' },
          { id: 'c', label: 'The account is private' },
        ],
        correctChoiceId: 'a',
        explanation: 'Rent-exempt accounts hold a minimum balance to stay allocated.',
      },
      {
        id: 'q4',
        prompt: 'Why separate programs (code) and accounts (data)?',
        choices: [
          { id: 'a', label: 'So programs are reusable and state is explicit in accounts' },
          { id: 'b', label: 'So you can skip consensus' },
          { id: 'c', label: 'So fees are removed' },
        ],
        correctChoiceId: 'a',
        explanation: 'Shared code + explicit state enables composability and safety checks.',
      },
      {
        id: 'q5',
        prompt: 'Anyone can read account data, but writes require…',
        choices: [
          { id: 'a', label: 'Account ownership by the writing program' },
          { id: 'b', label: 'A larger screen size' },
          { id: 'c', label: 'A special RPC token' },
        ],
        correctChoiceId: 'a',
        explanation: 'Writes are constrained by the owner program and writable account flags.',
      },
    ],
  },

  {
    id: 'm5-program-library',
    track: 'beginner101',
    title: 'Module 5: Program = Library',
    minutes: 14,
    content: {
      md: `# Program = Library

A Solana program is like a **shared library**.
Many users call the same code, but each user’s state lives in separate accounts.

## Stateless execution
Programs do not hold state in memory between calls.
Every instruction:
- receives accounts
- reads/writes account data
- returns an outcome

That means all important state must be in accounts — and all constraints must be validated every time.

## PDAs (Program Derived Addresses)
A PDA is a deterministic address derived from:
- program id
- seeds
- bump

A PDA:
- is controlled by the program logic
- cannot be created from a private key

Use PDAs for deterministic state (config, profiles, escrow vaults).
`,
    },
    quiz: [
      {
        id: 'q1',
        prompt: '“Stateless program” means…',
        choices: [
          { id: 'a', label: 'Programs keep private variables between calls' },
          { id: 'b', label: 'Programs rely on accounts for state; each call is self-contained' },
          { id: 'c', label: 'Programs cannot read account data' },
        ],
        correctChoiceId: 'b',
        explanation: 'State is stored in accounts; the program reads/writes it per instruction.',
      },
      {
        id: 'q2',
        prompt: 'Why are PDAs useful?',
        choices: [
          { id: 'a', label: 'They allow deterministic, program-owned state accounts' },
          { id: 'b', label: 'They remove transaction fees' },
          { id: 'c', label: 'They replace validators' },
        ],
        correctChoiceId: 'a',
        explanation: 'PDAs let programs control addresses without private keys.',
      },
      {
        id: 'q3',
        prompt: 'Can a PDA be generated with a private key?',
        choices: [
          { id: 'a', label: 'Yes' },
          { id: 'b', label: 'No' },
          { id: 'c', label: 'Only on devnet' },
        ],
        correctChoiceId: 'b',
        explanation: 'PDAs are derived addresses, typically off-curve, not controlled by a private key.',
      },
      {
        id: 'q4',
        prompt: 'A Solana program is most similar to…',
        choices: [
          { id: 'a', label: 'A shared library that many users call' },
          { id: 'b', label: 'A private database owned by one user' },
          { id: 'c', label: 'A password manager' },
        ],
        correctChoiceId: 'a',
        explanation: 'Programs are shared code used by many users.',
      },
      {
        id: 'q5',
        prompt: 'Where does persistent state live on Solana?',
        choices: [
          { id: 'a', label: 'Inside the program binary' },
          { id: 'b', label: 'In accounts' },
          { id: 'c', label: 'In the wallet UI' },
        ],
        correctChoiceId: 'b',
        explanation: 'Programs are stateless; accounts hold persistent data.',
      },
    ],
  },

  {
    id: 'm6-environment-setup-minimal',
    track: 'beginner101',
    title: 'Module 6: Environment Setup (Minimal)',
    minutes: 12,
    content: {
      md: `# Environment Setup (Minimal)

You have two good paths.

## Fast path: Solana Playground
If your goal is learning concepts fast:
- zero setup
- instant iteration

Downside: it’s not identical to professional local dev.

## Local minimal setup (for building)
A typical minimal local toolchain:
- **Rust** toolchain (build programs)
- **Solana CLI** (keypairs, clusters, airdrops)
- **Node.js** (clients + scripts)
- **Anchor** (framework to reduce boilerplate)

## Practical strategy
- Start in Playground until you understand the model.
- Switch to local setup when you start shipping.

Don’t over-install first. Your goal is a working loop: build → test → iterate.
`,
      callouts: [
        { title: 'Tip', body: 'The best setup is the one that keeps you shipping. Keep it minimal at first.' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'Which tool compiles Solana programs?',
        choices: [
          { id: 'a', label: 'Rust toolchain (cargo / rustc)' },
          { id: 'b', label: 'A wallet' },
          { id: 'c', label: 'Solscan' },
        ],
        correctChoiceId: 'a',
        explanation: 'Most Solana programs are written in Rust and compiled with cargo/rustc.',
      },
      {
        id: 'q2',
        prompt: 'Which network is recommended for testing first?',
        choices: [
          { id: 'a', label: 'Mainnet-beta' },
          { id: 'b', label: 'Devnet (or localnet)' },
          { id: 'c', label: 'A random RPC' },
        ],
        correctChoiceId: 'b',
        explanation: 'Devnet/localnet are safer for iteration and avoid real cost.',
      },
      {
        id: 'q3',
        prompt: 'What is Anchor used for?',
        choices: [
          { id: 'a', label: 'A framework that helps structure programs and validate accounts safely' },
          { id: 'b', label: 'A centralized hosting service' },
          { id: 'c', label: 'A token standard' },
        ],
        correctChoiceId: 'a',
        explanation: 'Anchor reduces boilerplate and encourages safer patterns.',
      },
      {
        id: 'q4',
        prompt: 'What should you optimize for when setting up?',
        choices: [
          { id: 'a', label: 'Installing every tool immediately' },
          { id: 'b', label: 'A minimal build/test loop that works' },
          { id: 'c', label: 'Deploying to mainnet first' },
        ],
        correctChoiceId: 'b',
        explanation: 'A working loop is the foundation; add complexity later.',
      },
      {
        id: 'q5',
        prompt: 'Why might Playground be useful early on?',
        choices: [
          { id: 'a', label: 'It removes setup friction so you can focus on concepts' },
          { id: 'b', label: 'It guarantees your contract is secure' },
          { id: 'c', label: 'It replaces validators' },
        ],
        correctChoiceId: 'a',
        explanation: 'Less setup means faster learning and iteration.',
      },
    ],
  },

  {
    id: 'm7-coding-with-claude',
    track: 'beginner101',
    title: 'Module 7: Coding with Claude',
    minutes: 14,
    content: {
      md: `# Coding with Claude

AI can speed up Solana development — if you control it with structure.
The danger is not that the code won’t compile; the danger is that it compiles while missing critical security checks.

## The 4-part prompt
A high-quality prompt includes:
1) **Context:** repo structure, existing accounts, constraints
2) **Goal:** what to build
3) **Constraints:** security checks, patterns, network, error handling
4) **Acceptance criteria:** tests, expected behavior, edge cases

## Example mini-project: “Wall of Wishes”
A clean beginner project might include:
- one global counter (tracks total wishes)
- one PDA per user wish (deterministic storage)

## Testing mindset
Tests should cover:
- signer checks (who is allowed)
- PDA derivation (seeds + bump)
- ownership checks
- invariants (no negative balances, no invalid state)

If the AI can’t explain the invariants and threat model, the feature isn’t ready.
`,
      callouts: [
        { title: 'Quality bar', body: 'Treat AI output like an intern: useful, but needs a strict review checklist.' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        prompt: 'What should a good prompt include?',
        choices: [
          { id: 'a', label: 'Only a vague idea' },
          { id: 'b', label: 'Context + goal + constraints + acceptance criteria' },
          { id: 'c', label: 'Only the token name' },
        ],
        correctChoiceId: 'b',
        explanation: 'Structured prompts produce better, safer results.',
      },
      {
        id: 'q2',
        prompt: 'In the “Wall of Wishes” example, which account tracks the total number of wishes?',
        choices: [
          { id: 'a', label: 'A global counter account' },
          { id: 'b', label: 'The RPC node' },
          { id: 'c', label: 'The wallet UI' },
        ],
        correctChoiceId: 'a',
        explanation: 'A global counter stores shared state; user entries can be per-user PDAs.',
      },
      {
        id: 'q3',
        prompt: 'Why test before deploying?',
        choices: [
          { id: 'a', label: 'To catch missing checks and invariant bugs early' },
          { id: 'b', label: 'To remove fees' },
          { id: 'c', label: 'Because mainnet refuses deployment without tests' },
        ],
        correctChoiceId: 'a',
        explanation: 'Testing is where security mistakes are found before damage is possible.',
      },
      {
        id: 'q4',
        prompt: 'What is the biggest risk of using AI for on-chain code?',
        choices: [
          { id: 'a', label: 'It may omit security checks unless explicitly required' },
          { id: 'b', label: 'It cannot write Rust' },
          { id: 'c', label: 'It always uses devnet' },
        ],
        correctChoiceId: 'a',
        explanation: 'AI can produce plausible code that is unsafe if invariants and checks are missing.',
      },
      {
        id: 'q5',
        prompt: 'Which is a good acceptance criterion for an AI-generated Solana instruction?',
        choices: [
          { id: 'a', label: '“It works on my machine” only' },
          { id: 'b', label: '“Has tests for signer, PDA, ownership, and invariant cases”' },
          { id: 'c', label: '“Looks clean in UI”' },
        ],
        correctChoiceId: 'b',
        explanation: 'Acceptance criteria should include security-relevant tests and edge cases.',
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
