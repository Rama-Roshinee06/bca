import type { Block, BlockHeader, Transaction, OrganizationId, ConsensusProof, ConsensusConfig } from '../types';

export interface ConsensusMessage {
  readonly type: 'pre-prepare' | 'prepare' | 'commit' | 'view-change';
  readonly view: number;
  readonly sequenceNumber: number;
  readonly block?: Block;
  readonly blockHash?: Uint8Array;
  readonly senderId: OrganizationId;
  readonly signature: Uint8Array;
  readonly timestamp: number;
}

export interface ConsensusState {
  readonly view: number;
  readonly sequenceNumber: number;
  readonly primaryId: OrganizationId;
  readonly phase: 'pre-prepare' | 'prepare' | 'commit' | 'idle';
  readonly preparedBlocks: Map<string, Block>;
  readonly preparedSignatures: Map<string, Map<OrganizationId, Uint8Array>>;
  readonly committedBlocks: Map<string, Map<OrganizationId, Uint8Array>>;
}

export class PBEFTEngine {
  private state: ConsensusState;
  private readonly config: ConsensusConfig;
  private readonly nodeId: OrganizationId;
  private readonly validators: readonly OrganizationId[];
  private messageHandlers: Map<string, (msg: ConsensusMessage) => void> = new Map();

  constructor(
    nodeId: OrganizationId,
    validators: readonly OrganizationId[],
    config: ConsensusConfig
  ) {
    this.nodeId = nodeId;
    this.validators = validators;
    this.config = config;
    this.state = {
      view: 0,
      sequenceNumber: 0,
      primaryId: validators[0],
      phase: 'idle',
      preparedBlocks: new Map(),
      preparedSignatures: new Map(),
      committedBlocks: new Map(),
    };
  }

  async proposeBlock(block: Block): Promise<ConsensusProof | null> {
    if (!this.isPrimary()) {
      return null;
    }

    this.state.phase = 'pre-prepare';
    this.state.preparedBlocks.set(this.blockKey(block), block);
    this.state.preparedSignatures.set(this.blockKey(block), new Map());

    const prePrepareMsg = await this.createMessage('pre-prepare', {
      block,
    });

    await this.broadcast(prePrepareMsg);
    return this.waitForConsensus(block);
  }

  async handleMessage(msg: ConsensusMessage): Promise<void> {
    if (msg.view !== this.state.view) {
      return;
    }

    const key = this.blockKey(msg.block!);

    switch (msg.type) {
      case 'pre-prepare':
        if (!this.isPrimary() && msg.senderId.value === this.state.primaryId.value) {
          this.state.preparedBlocks.set(key, msg.block!);
          this.state.preparedSignatures.set(key, new Map());
          await this.sendPrepare(msg);
        }
        break;

      case 'prepare':
        this.collectSignature(key, msg.senderId, msg.signature);
        if (this.hasQuorum(this.state.preparedSignatures.get(key)!)) {
          await this.sendCommit(msg);
        }
        break;

      case 'commit':
        this.collectCommitSignature(key, msg.senderId, msg.signature);
        if (this.hasQuorum(this.state.committedBlocks.get(key)!)) {
          return this.finalizeBlock(key);
        }
        break;

      case 'view-change':
        await this.handleViewChange(msg);
        break;
    }
  }

  private async sendPrepare(msg: ConsensusMessage): Promise<void> {
    const prepareMsg = await this.createMessage('prepare', {
      blockHash: msg.blockHash || this.hashBlock(msg.block!),
    });
    await this.broadcast(prepareMsg);
    this.state.phase = 'prepare';
  }

  private async sendCommit(msg: ConsensusMessage): Promise<void> {
    const commitMsg = await this.createMessage('commit', {
      blockHash: msg.blockHash || this.hashBlock(msg.block!),
    });
    await this.broadcast(commitMsg);
    this.state.phase = 'commit';
  }

  private collectSignature(key: string, sender: OrganizationId, signature: Uint8Array): void {
    const sigs = this.state.preparedSignatures.get(key);
    if (sigs) sigs.set(sender, signature);
  }

  private collectCommitSignature(key: string, sender: OrganizationId, signature: Uint8Array): void {
    const sigs = this.state.committedBlocks.get(key);
    if (!sigs) {
      this.state.committedBlocks.set(key, new Map([[sender, signature]]));
    } else {
      sigs.set(sender, signature);
    }
  }

  private hasQuorum(signatures: Map<OrganizationId, Uint8Array>): boolean {
    const required = Math.floor((this.validators.length + this.config.maxFaultyNodes) / 2) + 1;
    return signatures.size >= required;
  }

  private async finalizeBlock(key: string): Promise<void> {
    const block = this.state.preparedBlocks.get(key);
    if (block) {
      const commits = this.state.committedBlocks.get(key)!;
      const proof: ConsensusProof = {
        type: 'pbft',
        view: this.state.view,
        sequenceNumber: this.state.sequenceNumber,
        signatures: commits,
      };
      this.emit('finalized', { block, proof });
    }
    this.state.sequenceNumber++;
    this.state.phase = 'idle';
  }

  private async waitForConsensus(block: Block): Promise<ConsensusProof | null> {
    return new Promise((resolve) => {
      const key = this.blockKey(block);
      const handler = (data: { block: Block; proof: ConsensusProof }) => {
        if (data.block === block) {
          this.off('finalized', handler);
          resolve(data.proof);
        }
      };
      this.on('finalized', handler);
      setTimeout(() => {
        this.off('finalized', handler);
        resolve(null);
      }, this.config.viewTimeoutMs);
    });
  }

  private isPrimary(): boolean {
    return this.nodeId.value === this.state.primaryId.value;
  }

  private blockKey(block: Block): string {
    return `${block.header.height}:${Array.from(block.header.merkleRoot).join(',')}`;
  }

  private hashBlock(block: Block): Uint8Array {
    const data = JSON.stringify({
      height: block.header.height,
      merkleRoot: Array.from(block.header.merkleRoot),
    });
    const encoder = new TextEncoder();
    const hash = new Uint8Array(32);
    for (let i = 0; i < data.length; i++) {
      hash[i % 32] ^= data.charCodeAt(i);
    }
    return hash;
  }

  private async createMessage(
    type: ConsensusMessage['type'],
    payload: { block?: Block; blockHash?: Uint8Array }
  ): Promise<ConsensusMessage> {
    return {
      type,
      view: this.state.view,
      sequenceNumber: this.state.sequenceNumber,
      ...payload,
      senderId: this.nodeId,
      signature: new Uint8Array(64),
      timestamp: Date.now(),
    };
  }

  private async broadcast(msg: ConsensusMessage): Promise<void> {
    this.emit('broadcast', msg);
  }

  private async handleViewChange(msg: ConsensusMessage): Promise<void> {
    if (msg.view > this.state.view) {
      this.state.view = msg.view;
      this.state.primaryId = this.validators[msg.view % this.validators.length];
      this.state.phase = 'idle';
    }
  }

  private listeners = new Map<string, Set<Function>>();

  private on(event: string, handler: Function): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
  }

  private off(event: string, handler: Function): void {
    this.listeners.get(event)?.delete(handler);
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach((h) => h(data));
  }
}