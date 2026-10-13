import type { AssetId, OrganizationId, Transaction, AssetAction } from '../types';

export interface AssetState {
  readonly assetId: AssetId;
  readonly currentOwner: OrganizationId | null;
  readonly history: readonly StateTransition[];
  readonly status: 'active' | 'transferred' | 'delivered' | 'archived';
}

export interface StateTransition {
  readonly transactionId: string;
  readonly action: AssetAction;
  readonly actorId: OrganizationId;
  readonly timestamp: number;
  readonly payload: Record<string, unknown>;
}

export class AssetStateMachine {
  private states = new Map<string, AssetState>();

  getState(assetId: AssetId): AssetState | undefined {
    return this.states.get(assetId.value);
  }

  applyTransaction(tx: Transaction): { success: boolean; error?: string } {
    const current = this.states.get(tx.assetId.value);

    switch (tx.action) {
      case 'CREATED':
        if (current) {
          return { success: false, error: 'Asset already exists' };
        }
        this.states.set(tx.assetId.value, {
          assetId: tx.assetId,
          currentOwner: tx.actorId,
          history: [{
            transactionId: tx.id,
            action: tx.action,
            actorId: tx.actorId,
            timestamp: tx.timestamp,
            payload: tx.payload,
          }],
          status: 'active',
        });
        return { success: true };

      case 'TRANSFERRED':
      case 'PROCESSED':
      case 'INSPECTED':
      case 'CERTIFIED':
        if (!current) {
          return { success: false, error: 'Asset not found' };
        }
        if (current.currentOwner?.value !== tx.actorId.value && tx.action !== 'TRANSFERRED') {
          return { success: false, error: 'Actor is not current owner' };
        }
        const newOwner = tx.action === 'TRANSFERRED'
          ? tx.payload.recipient as OrganizationId
          : current.currentOwner;
        this.states.set(tx.assetId.value, {
          ...current,
          currentOwner: newOwner,
          history: [...current.history, {
            transactionId: tx.id,
            action: tx.action,
            actorId: tx.actorId,
            timestamp: tx.timestamp,
            payload: tx.payload,
          }],
          status: tx.action === 'CERTIFIED' ? 'delivered' : 'active',
        });
        return { success: true };

      case 'DELIVERED':
        if (!current) {
          return { success: false, error: 'Asset not found' };
        }
        this.states.set(tx.assetId.value, {
          ...current,
          currentOwner: tx.actorId,
          history: [...current.history, {
            transactionId: tx.id,
            action: tx.action,
            actorId: tx.actorId,
            timestamp: tx.timestamp,
            payload: tx.payload,
          }],
          status: 'delivered',
        });
        return { success: true };

      default:
        return { success: false, error: `Unknown action: ${tx.action}` };
    }
  }

  canApply(tx: Transaction): boolean {
    const current = this.states.get(tx.assetId.value);
    if (!current) return tx.action === 'CREATED';
    if (tx.action === 'CREATED') return false;
    if (current.currentOwner?.value !== tx.actorId.value && tx.action !== 'TRANSFERRED') return false;
    return true;
  }

  getAllStates(): readonly AssetState[] {
    return Array.from(this.states.values());
  }
}