import type { Block, SyncState, PeerInfo, OrganizationId } from '../types';
import { verifyBlock, hashBlockHeader } from '../block';

export interface SyncEngineEvents {
  progress: (state: SyncState) => void;
  complete: (blocks: readonly Block[]) => void;
  error: (error: Error) => void;
}

export class SyncEngine {
  private state: SyncState = {
    status: 'idle',
    targetHeight: 0,
    currentHeight: 0,
  };
  private readonly events: Partial<SyncEngineEvents> = {};
  private readonly nodeId: OrganizationId;

  constructor(nodeId: OrganizationId) {
    this.nodeId = nodeId;
  }

  async startSync(
    peers: readonly PeerInfo[],
    localHeight: number,
    getBlock: (height: number) => Promise<Block | null>,
    saveBlock: (block: Block) => Promise<void>
  ): Promise<void> {
    this.state = { status: 'syncing', targetHeight: 0, currentHeight: localHeight };

    const maxPeerHeight = await this.findMaxHeight(peers);
    if (maxPeerHeight <= localHeight) {
      this.state = { status: 'complete', targetHeight: localHeight, currentHeight: localHeight };
      this.events.progress?.(this.state);
      return;
    }

    this.state.targetHeight = maxPeerHeight;

    for (let height = localHeight + 1; height <= maxPeerHeight; height++) {
      const block = await this.fetchBlock(peers, height);
      if (!block) {
        this.state = {
          status: 'error',
          targetHeight: maxPeerHeight,
          currentHeight: height - 1,
          error: `Failed to fetch block ${height}`,
        };
        this.events.error?.(new Error(this.state.error));
        return;
      }

      const prevBlock = await getBlock(height - 1);
      if (!prevBlock && height > 1) {
        this.state = {
          status: 'error',
          targetHeight: maxPeerHeight,
          currentHeight: height - 1,
          error: `Missing previous block ${height - 1}`,
        };
        this.events.error?.(new Error(this.state.error));
        return;
      }

      const prevHash = prevBlock ? hashBlockHeader(prevBlock.header) : new Uint8Array(32);
      if (!verifyBlock(block, prevHash)) {
        this.state = {
          status: 'error',
          targetHeight: maxPeerHeight,
          currentHeight: height - 1,
          error: `Block ${height} verification failed`,
        };
        this.events.error?.(new Error(this.state.error));
        return;
      }

      await saveBlock(block);
      this.state.currentHeight = height;
      this.events.progress?.(this.state);
    }

    this.state.status = 'complete';
    this.events.progress?.(this.state);
    this.events.complete?.([]);
  }

  private async findMaxHeight(peers: readonly PeerInfo[]): Promise<number> {
    return Math.max(...peers.map(() => Math.floor(Math.random() * 100) + 100));
  }

  private async fetchBlock(peers: readonly PeerInfo[], height: number): Promise<Block | null> {
    return null;
  }

  getState(): SyncState {
    return { ...this.state };
  }

  on<K extends keyof SyncEngineEvents>(event: K, handler: SyncEngineEvents[K]): void {
    this.events[event] = handler;
  }
}