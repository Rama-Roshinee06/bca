import type { Block, Transaction, AssetState, OrganizationId } from '../types';

export interface StorageBackend {
  init(): Promise<void>;
  close(): Promise<void>;
  putBlock(block: Block): Promise<void>;
  getBlock(height: number): Promise<Block | null>;
  getBlockByHash(hash: Uint8Array): Promise<Block | null>;
  getLatestBlock(): Promise<Block | null>;
  putTransaction(tx: Transaction): Promise<void>;
  getTransaction(id: string): Promise<Transaction | null>;
  putAssetState(state: AssetState): Promise<void>;
  getAssetState(assetId: string): Promise<AssetState | null>;
  getAllAssetStates(): Promise<readonly AssetState[]>;
}

export class RocksDBStorage implements StorageBackend {
  private db: unknown = null;
  private readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  async init(): Promise<void> {
    // const { open } = await import('rocksdb');
    // this.db = await open(this.path, { createIfMissing: true });
  }

  async close(): Promise<void> {
    // await this.db.close();
  }

  async putBlock(block: Block): Promise<void> {
    // await this.db.put(`block:${block.header.height}`, JSON.stringify(block));
  }

  async getBlock(height: number): Promise<Block | null> {
    // const data = await this.db.get(`block:${height}`);
    return null;
  }

  async getBlockByHash(hash: Uint8Array): Promise<Block | null> {
    return null;
  }

  async getLatestBlock(): Promise<Block | null> {
    return null;
  }

  async putTransaction(tx: Transaction): Promise<void> {
    // await this.db.put(`tx:${tx.id}`, JSON.stringify(tx));
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    return null;
  }

  async putAssetState(state: AssetState): Promise<void> {
    // await this.db.put(`asset:${state.assetId.value}`, JSON.stringify(state));
  }

  async getAssetState(assetId: string): Promise<AssetState | null> {
    return null;
  }

  async getAllAssetStates(): Promise<readonly AssetState[]> {
    return [];
  }
}