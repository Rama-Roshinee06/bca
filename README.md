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

All computation runs in the browser — no backend, no network, no external dependencies.

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

- **React 19** — Modern React with concurrent features
- **TypeScript 5.9** — Strict type checking
- **Vite 8** — Fast build tool and dev server
- **Tailwind CSS 4** — Utility-first styling with CSS variables for theming
- **oxfmt** — Fast code formatter (Oxc-based)
- **pnpm 10** — Package manager

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

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server (port 5173) |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm format` | Format source code with oxfmt |
| `pnpm lint` | Check formatting (CI-friendly) |
| `pnpm typecheck` | Run TypeScript type checking |

## Project Structure

```
bca/
├── public/
│   ├── favicon.svg
│   ├── images/
│   └── icons/
├── src/
│   ├── assets/           # Static assets (images, fonts)
│   ├── components/
│   │   ├── common/       # Reusable UI components (Button, Badge, Hash, Panel, etc.)
│   │   └── layout/       # Layout components (Sidebar, Topbar, Breadcrumb)
│   ├── pages/            # Page components (one per route)
│   │   ├── components/   # Page-specific sub-components
│   │   ├── Overview.tsx
│   │   ├── Blocks.tsx
│   │   ├── Transactions.tsx
│   │   ├── CryptoLab.tsx
│   │   ├── MerkleLab.tsx
│   │   ├── Topology.tsx
│   │   ├── Consensus.tsx
│   │   ├── Provenance.tsx
│   │   ├── Recovery.tsx
│   │   ├── Security.tsx
│   │   ├── Benchmarks.tsx
│   │   └── Docs.tsx
│   ├── hooks/            # Custom React hooks (future use)
│   ├── utils/            # Utility functions (hashing, mock data)
│   ├── types/            # Shared TypeScript types
│   ├── styles/           # Global styles (future use)
│   ├── App.tsx           # Root component with routing/state
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles + Tailwind import
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions CI
├── .gitignore
├── .gitattributes
├── .env.example
├── CONTRIBUTING.md
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

### Static Hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages)

```bash
pnpm build
# Deploy the `dist/` directory
```

The build outputs a fully static SPA. Configure your host to serve `index.html` for all routes.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "5173"]
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `pnpm: command not found` | Run `corepack enable pnpm` or install via `npm i -g pnpm` |
| Port 5173 in use | Change port in `vite.config.ts` or kill existing process |
| Build fails with type errors | Run `pnpm typecheck` for details; ensure Node ≥ 20.19 |
| Styles not updating | Restart dev server; Tailwind 4 uses CSS variables |
| Theme not persisting | Check `localStorage` is enabled (not in private browsing) |



## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Development setup
- Branch naming and commit conventions
- Code formatting and linting
- Pull request process

