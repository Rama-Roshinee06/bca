# VERILOCK — LEDGER SECURITY LAB

An educational permissioned blockchain simulation with cryptographic verification, consensus modeling, and security testing tools — built with React 19, TypeScript, Vite, and Tailwind CSS 4.

![VERILOCK Screenshot](docs/screenshot-overview.png)

## Overview

VERILOCK is a browser-based educational tool that simulates a permissioned blockchain environment. It demonstrates core concepts including:

- **Hash-linked ledger** — SHA-256 block chaining with Merkle trees
- **PBFT-style consensus** — Four-replica validator network with proposal, prepare, commit, and finalization phases
- **Cryptographic verification** — Real browser Web Crypto API hashing and signature verification
- **Asset provenance** — Supply-chain tracking with tamper-evident history
- **Security lab** — Attack demonstrations (tampering, forgery, replay, partition)
- **Performance benchmarks** — Local throughput and latency modeling

**All computation runs in the browser — no backend, no network, no external dependencies.**

> ⚠️ **Current Status: Frontend-only simulation (v1.4)**
> This is an educational frontend that visualizes blockchain concepts with deterministic mock data. It does **not** implement a real P2P network, consensus protocol, or cryptographic identity system. See [ARCHITECTURE.md](ARCHITECTURE.md) for the full distributed system design and implementation roadmap.

## Features Implemented

| Page | Description |
|------|-------------|
| **Overview** | Network metrics, validator health, recent blocks & transactions, consensus activity timeline, event log |
| **Blockchain Explorer** | Searchable block list with hash links, block detail view with verification results |
| **Transactions** | Searchable transaction list, transaction detail with validation checks, create new pending transactions |
| **Cryptographic Verification** | Live SHA-256 hashing, tamper detection, hash chain integrity verification |
| **Merkle Proofs** | Interactive Merkle tree with inclusion proof visualization |
| **Network Topology** | Four-replica network with offline simulation, latency injection, partition modeling |
| **Consensus** | PBFT-style simulation with Byzantine fault toggle, stage progression, commit decision |
| **Asset Provenance** | Supply-chain asset lifecycle with verified history trail |
| **Replication & Recovery** | Replica sync status, disconnect/reconnect simulation, block catch-up progress |
| **Security Lab** | 6 attack scenarios with pass/fail results and detailed logs |
| **Benchmarks** | Configurable workload sizes (1K/5K/10K), latency distribution, throughput metrics |
| **Documentation** | 11-section technical reference with architecture diagram |

## Technology Stack

### Frontend (Current)
- **React 19** — Modern React with concurrent features
- **TypeScript 5.9** — Strict type checking
- **Vite 8** — Fast build tool and dev server
- **Tailwind CSS 4** — Utility-first styling with CSS variables for theming
- **oxfmt** — Fast code formatter (Oxc-based)
- **pnpm 10** — Package manager

### Backend (Planned — `node/`)
- **Node.js 20 + TypeScript** — Shared language with frontend
- **libp2p** — P2P networking (WebSocket + Noise + Mplex)
- **@noble/ed25519** — Ed25519 signatures
- **RocksDB** — Persistent ordered key-value storage
- **Protocol Buffers** — Canonical serialization
- **Docker** — Multi-node test deployment

## Prerequisites

- **Node.js** ≥ 20.19.0 (LTS recommended)
- **pnpm** ≥ 10.34.3 (or use `corepack enable pnpm`)

## Installation

```bash
git clone https://github.com/Rama-Roshinee06/bca.git
cd bca
pnpm install
```

## Development

### Frontend Only (Current)

Start the Vite development server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend (Not Yet Implemented)

The `node/` directory contains a placeholder structure for the distributed node implementation. See [ARCHITECTURE.md](ARCHITECTURE.md#backend-implementation-roadmap) for the phased roadmap.

```bash
cd node
pnpm install
pnpm run dev  # Will start CLI once implemented
```

## Available Scripts

### Frontend (Root)
| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server (port 5173) |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm format` | Format source code with oxfmt |
| `pnpm lint` | Check formatting (CI-friendly) |
| `pnpm typecheck` | Run TypeScript type checking |

### Backend (`node/`)
| Command | Description |
|---------|-------------|
| `pnpm run build` | Compile TypeScript to `dist/` |
| `pnpm run dev` | Start CLI with tsx watch mode |
| `pnpm run start` | Run compiled CLI |
| `pnpm run test` | Run vitest tests |
| `pnpm run lint` | Check formatting |
| `pnpm run format` | Format source code |

## Project Structure

```
bca/
├── public/
│   ├── favicon.svg
│   ├── images/
│   └── icons/
├── src/                          # Frontend (React)
│   ├── assets/
│   ├── components/
│   │   ├── common/               # Reusable UI components
│   │   └── layout/               # Layout components
│   ├── pages/                    # Page components
│   │   ├── components/           # Page-specific sub-components
│   │   └── *.tsx                 # 12 page components
│   ├── hooks/                    # Custom React hooks (reserved)
│   ├── utils/                    # Utility functions (hashing, mock data)
│   ├── types/                    # Shared TypeScript types
│   ├── styles/                   # Global styles (reserved)
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles + Tailwind
├── node/                         # Backend placeholder (Node.js)
│   ├── src/
│   │   ├── crypto/               # Ed25519 keys, signing
│   │   ├── consensus/            # PBFT implementation
│   │   ├── network/              # libp2p P2P networking
│   │   ├── storage/              # RocksDB persistence
│   │   ├── state/                # Asset ownership state machine
│   │   ├── mempool/              # Transaction pool
│   │   ├── block/                # Block builder, Merkle trees
│   │   ├── sync/                 # Block fetch, verification, replay
│   │   ├── api/                  # REST/gRPC for clients
│   │   ├── cli/                  # Commands: start, submit, query
│   │   ├── config/               # Genesis, peer list, keys
│   │   └── types/                # Shared backend types
│   ├── package.json
│   └── tsconfig.json
├── docker/                       # Multi-node Docker Compose
│   ├── docker-compose.yml
│   └── Dockerfile
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI
├── .gitignore
├── .gitattributes
├── .env.example
├── CONTRIBUTING.md
├── ARCHITECTURE.md               # Full distributed system design
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` for local overrides (currently no required variables):

```bash
cp .env.example .env.local
```

### Theme

The application supports light/dark themes persisted in `localStorage` (`verilock-theme` key). Toggle via the topbar sun/moon icon.

## Deployment

### Frontend — Static Hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages)

```bash
pnpm build
# Deploy the `dist/` directory
```

The build outputs a fully static SPA. Configure your host to serve `index.html` for all routes.

### Frontend — Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "5173"]
```

### Backend — Multi-Node (Planned)

```bash
cd docker
docker-compose up --build
```

This will start 4 validator nodes + 1 bootstrap node for local testing.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `pnpm: command not found` | Run `corepack enable pnpm` or install via `npm i -g pnpm` |
| Port 5173 in use | Change port in `vite.config.ts` or kill existing process |
| Build fails with type errors | Run `pnpm typecheck` for details; ensure Node ≥ 20.19 |
| Styles not updating | Restart dev server; Tailwind 4 uses CSS variables |
| Theme not persisting | Check `localStorage` is enabled (not in private browsing) |

## Backend Implementation Roadmap

See [ARCHITECTURE.md](ARCHITECTURE.md) for the complete design. Summary:

| Phase | Focus | Timeline |
|-------|-------|----------|
| **1** | Single-node core (crypto, state machine, blocks, storage, CLI) | 1-2 weeks |
| **2** | P2P networking + leader-based consensus | 2-3 weeks |
| **3** | Full PBFT + view changes + fault injection | 2-3 weeks |
| **4** | Hardening (checkpointing, metrics, stress tests) | 1-2 weeks |

**Target:** 4-node permissioned network tolerating 1 Byzantine fault, with real Ed25519 signatures, Merkle proofs, and sync/recovery.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Development setup
- Branch naming and commit conventions
- Code formatting and linting
- Pull request process

## License

This project is currently **unlicensed**. All rights reserved. A license will be added once the project maintainer selects one.

## Acknowledgments
- Real-world motivation: **De Beers Tracr** — blockchain-based diamond provenance platform

---

**VERILOCK** — Local browser model · v1.4 · Educational simulation
