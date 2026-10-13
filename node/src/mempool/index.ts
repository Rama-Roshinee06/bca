import type { Transaction, MempoolEntry, OrganizationId } from '../types';

export interface MempoolConfig {
  readonly maxSize: number;
  readonly maxAgeMs: number;
}

export class TransactionMempool {
  private entries = new Map<string, MempoolEntry>();
  private readonly config: MempoolConfig;

  constructor(config: Partial<MempoolConfig> = {}) {
    this.config = {
      maxSize: config.maxSize ?? 10000,
      maxAgeMs: config.maxAgeMs ?? 5 * 60 * 1000,
    };
  }

  add(tx: Transaction, validatorId: OrganizationId): { success: boolean; error?: string } {
    if (this.entries.has(tx.id)) {
      return { success: false, error: 'Transaction already in mempool' };
    }
    if (this.entries.size >= this.config.maxSize) {
      this.evictOldest();
    }
    this.entries.set(tx.id, {
      transaction: tx,
      receivedAt: Date.now(),
      validated: false,
    });
    return { success: true };
  }

  markValidated(txId: string): boolean {
    const entry = this.entries.get(txId);
    if (!entry) return false;
    entry.validated = true;
    return true;
  }

  getValidated(): readonly Transaction[] {
    return Array.from(this.entries.values())
      .filter((e) => e.validated)
      .map((e) => e.transaction);
  }

  getPending(): readonly Transaction[] {
    return Array.from(this.entries.values())
      .filter((e) => !e.validated)
      .map((e) => e.transaction);
  }

  remove(txId: string): boolean {
    return this.entries.delete(txId);
  }

  removeBatch(txIds: readonly string[]): number {
    let count = 0;
    for (const id of txIds) {
      if (this.entries.delete(id)) count++;
    }
    return count;
  }

  private evictOldest(): void {
    let oldest: string | null = null;
    let oldestTime = Infinity;
    for (const [id, entry] of this.entries) {
      if (entry.receivedAt < oldestTime) {
        oldestTime = entry.receivedAt;
        oldest = id;
      }
    }
    if (oldest) this.entries.delete(oldest);
  }

  cleanup(): number {
    const now = Date.now();
    let count = 0;
    for (const [id, entry] of this.entries) {
      if (now - entry.receivedAt > this.config.maxAgeMs) {
        this.entries.delete(id);
        count++;
      }
    }
    return count;
  }

  size(): number {
    return this.entries.size;
  }

  has(txId: string): boolean {
    return this.entries.has(txId);
  }
}