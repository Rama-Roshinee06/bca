# VERILOCK Architecture

## Current State (v1.4)

**Frontend-only educational simulation** — All computation runs in a single browser tab with deterministic mock data. No backend, no P2P network, no real consensus.

### What Works Today
- 12 interactive pages (Overview, Blocks, Transactions, Crypto, Merkle, Topology, Consensus, Provenance, Recovery, Security, Benchmarks, Docs)
- Real SHA-256 hashing via Web Crypto API
- Visual PBFT consensus animation
- Asset provenance tracking
- Attack simulations (tampering, forgery, replay, Byzantine, partition)
- Dark/light theme persistence
- Responsive layout with mobile sidebar

### What's Simulated (Not Real)
| Feature | Current Implementation | Real Implementation Needed |
|---------|------------------------|---------------------------|
| Transaction validation | Fixture "Verified" labels | Ed25519 signature verification |
| Consensus | CSS animation stages | PBFT with view changes |
| Block building | Pre-computed mock blocks | Canonical encoding + Merkle root |
| P2P network | None | libp2p gossip + block propagation |
| Replicated ledger | Single `blocks` array | 4 independent RocksDB stores |
| Fault tolerance | UI toggles changing CSS | Real crash/Byzantine/partition handling |
| Recovery | Progress bar animation | Block fetch + verify + replay |

---

## Target Architecture: Distributed Provenance Ledger

### System Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Client A   │     │  Client B   │     │  Client C   │     │  Client D   │
│  (Org A)    │     │  (Org B)    │     │  (Org C)    │     │  (Org D)    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       └───────────────────┼───────────────────┼───────────────────┘
                           ▼
              ┌────────────────────────┐
              │   VERILOCK NETWORK     │
              │  (4 Validator Nodes)   │
              └───────────┬────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │ Node 1  │      │ Node 2  │      │ Node 3  │
    │ (Primary)│      │(Replica)│      │(Replica)│
    └────┬────┘      └────┬────┘      └────┬────┘
         │                │                │
         └────────────────┼────────────────┘
                          ▼
                 ┌─────────────────┐
                 │   Consensus     │
                 │   (PBFT)        │
                 └────────┬────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │ Ledger  │      │ Ledger  │      │ Ledger  │
    │  (DB)   │      │  (DB)   │      │  (DB)   │
    └─────────┘      └─────────┘      └─────────┘
```

### Layer 1: Asset/Provenance Model
- **Asset** — Generic identifier (`AssetId`), not domain-specific (diamonds, pharma, etc.)
- **State Transitions** — CREATED → TRANSFERRED → PROCESSED → INSPECTED → CERTIFIED → DELIVERED
- **Ownership** — Each asset has a single current owner (OrganizationId)

### Layer 2: Cryptography
- **Ed25519** — Key pairs per organization, signatures on every transaction
- **SHA-256** — Block hashing, Merkle trees, transaction IDs
- **Canonical Serialization** — Protocol Buffers for deterministic encoding

### Layer 3: Transaction Validation
```
Transaction → Signature Valid? → Actor Authorized? → Asset State Valid? → Nonce Unique? → ACCEPT/REJECT
```

### Layer 4: Mempool
- Validated transactions wait for consensus inclusion
- Max size, TTL eviction, priority ordering

### Layer 5: Merkle Trees
- Transactions hashed in binary tree
- Root commits to full block transaction set
- Inclusion proofs require O(log n) sibling hashes

### Layer 6: Block Structure
```
Block N
├── Height
├── Timestamp
├── Previous Hash (Hash(Block N-1))
├── Merkle Root
├── Validator ID
├── Consensus Proof (PBFT signatures)
└── Transactions[]
```

### Layer 7: Consensus (PBFT)
```
VIEW v, SEQUENCE n
       │
       ▼
┌──────────────────┐
│   PRE-PREPARE    │  Primary proposes block
│  (Primary → All) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│     PREPARE      │  Replicas validate + sign
│   (All → All)    │
└────────┬─────────┘
         │  2f+1 prepares
         ▼
┌──────────────────┐
│     COMMIT       │  Replicas commit + sign
│   (All → All)    │
└────────┬─────────┘
         │  2f+1 commits
         ▼
┌──────────────────┐
│    FINALIZE      │  Block appended to ledger
└──────────────────┘
```
- **4 validators** → tolerate **1 Byzantine fault** (3f+1 = 4)
- **View changes** on primary timeout/failure
- **Checkpointing** for log truncation

### Layer 8: P2P Network (libp2p)
- **WebSocket transport** for browser/node compatibility
- **Noise** for encrypted connections
- **Mplex** for stream multiplexing
- **Gossipsub** for transaction/block propagation
- **Peer discovery** via bootstrap nodes

### Layer 9: Fault Tolerance
| Fault Type | Detection | Recovery |
|------------|-----------|----------|
| Crash | Missed heartbeats | Restart, sync from peers |
| Byzantine | Invalid signatures, conflicting proposals | Quorum rejects, view change |
| Partition | No peer messages | Pause commits, resume on heal |
| Omission | Missing prepare/commit | Retransmit, timeout escalation |

### Layer 10: Sync/Recovery
```
Reconnecting Node:
1. Announce local height
2. Request blocks [local+1 .. maxPeerHeight]
3. For each block:
   a. Verify previous hash
   b. Verify Merkle root
   c. Verify all transactions
   d. Verify consensus proof (2f+1 signatures)
   e. Apply to state machine
4. Mark synced, resume consensus
```

### Layer 11: Attack Surface (Tested)
- **Ledger tampering** → Hash chain mismatch
- **Forged signatures** → Ed25519 verification fails
- **Double transfer** → State machine rejects
- **Byzantine primary** → View change, quorum rejects
- **Replay attack** → Nonce/state validation catches
- **Network partition** → Commits pause without quorum

---

## Backend Implementation Roadmap

### Phase 1: Single-Node Core (Week 1-2)
- [ ] Ed25519 key generation + signing
- [ ] Transaction serialization + validation
- [ ] Asset state machine
- [ ] Block builder + Merkle trees
- [ ] RocksDB persistence
- [ ] CLI: start, submit, query, peers, status

### Phase 2: P2P + Simple Consensus (Week 3-4)
- [ ] libp2p networking (WebSocket + Noise)
- [ ] Gossipsub for tx/block propagation
- [ ] Leader-based consensus (simplified PBFT)
- [ ] Block verification on receipt
- [ ] Basic sync protocol

### Phase 3: Full PBFT + Fault Injection (Week 5-6)
- [ ] Complete PBFT (pre-prepare/prepare/commit)
- [ ] View change protocol
- [ ] Byzantine fault simulation CLI
- [ ] Network partition simulation
- [ ] Crash/restart recovery

### Phase 4: Hardening (Week 7-8)
- [ ] Checkpointing + log truncation
- [ ] Metrics + observability
- [ ] Integration tests (4-node Docker)
- [ ] Stress testing (throughput, latency)
- [ ] Documentation + deployment guides

---

## Frontend Integration Plan

### Current → Future
| Current | Future |
|---------|--------|
| Mock data in `mockData.ts` | API calls to node REST/gRPC |
| Local SHA-256 | Node returns verified proofs |
| CSS consensus animation | Real-time consensus events via WebSocket |
| Simulated attacks | Actual fault injection via node API |
| LocalStorage theme | Same (no change) |

### Dashboard Features to Add
- Real-time peer status
- Consensus view/phase indicator
- Mempool depth
- Sync progress
- Attack injection controls

---

## Deployment Topology

### Development (Docker Compose)
```
4 validator containers + 1 bootstrap
- Shared bridge network
- Persistent volumes for RocksDB
- Ports: 8000 (API), 9000 (P2P), 4001 (bootstrap)
```

### Production (Kubernetes/VMs)
- 4+ validator nodes in different AZs
- Load balancer for client API
- Private network for P2P
- Monitoring: Prometheus + Grafana
- Logs: Loki or ELK

---

## Security Considerations

- **Keys never leave node** — Private keys generated/stored locally
- **TLS for client API** — mTLS between organizations
- **Rate limiting** — Prevent mempool spam
- **Audit logging** — All consensus decisions logged
- **Upgrade mechanism** — Governance for protocol changes

---

## References

- Castro & Liskov, "Practical Byzantine Fault Tolerance" (1999)
- libp2p specification
- @noble/ed25519 implementation
- De Beers Tracr case study (real-world motivation)