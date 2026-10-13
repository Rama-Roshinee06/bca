export interface PublicKey {
  readonly bytes: Uint8Array;
  readonly encoding: 'ed25519';
}

export interface PrivateKey {
  readonly bytes: Uint8Array;
  readonly encoding: 'ed25519';
}

export interface KeyPair {
  readonly publicKey: PublicKey;
  readonly privateKey: PrivateKey;
}

export interface Signature {
  readonly bytes: Uint8Array;
  readonly algorithm: 'ed25519';
}

export interface AssetId {
  readonly value: string;
}

export interface OrganizationId {
  readonly value: string;
}

export type AssetAction =
  | 'CREATED'
  | 'TRANSFERRED'
  | 'PROCESSED'
  | 'INSPECTED'
  | 'CERTIFIED'
  | 'DELIVERED'
  | 'CUSTOM';

export interface Transaction {
  readonly id: string;
  readonly assetId: AssetId;
  readonly actorId: OrganizationId;
  readonly action: AssetAction;
  readonly timestamp: number;
  readonly payload: Record<string, unknown>;
  readonly signature: Signature;
  readonly nonce: number;
}

export interface BlockHeader {
  readonly height: number;
  readonly timestamp: number;
  readonly previousHash: Uint8Array;
  readonly merkleRoot: Uint8Array;
  readonly validatorId: OrganizationId;
  readonly consensusProof: ConsensusProof;
}

export interface Block {
  readonly header: BlockHeader;
  readonly transactions: readonly Transaction[];
}

export interface ConsensusProof {
  readonly type: 'pbft';
  readonly view: number;
  readonly sequenceNumber: number;
  readonly signatures: Map<OrganizationId, Signature>;
}

export interface MempoolEntry {
  readonly transaction: Transaction;
  readonly receivedAt: number;
  readonly validated: boolean;
}

export interface PeerInfo {
  readonly id: string;
  readonly address: string;
  readonly publicKey: PublicKey;
  readonly lastSeen: number;
}

export interface SyncState {
  readonly status: 'idle' | 'syncing' | 'complete' | 'error';
  readonly targetHeight: number;
  readonly currentHeight: number;
  readonly error?: string;
}

export interface NodeConfig {
  readonly nodeId: OrganizationId;
  readonly keyPair: KeyPair;
  readonly genesisBlock: Block;
  readonly peers: readonly PeerInfo[];
  readonly consensusConfig: ConsensusConfig;
  readonly networkConfig: NetworkConfig;
  readonly storagePath: string;
}

export interface ConsensusConfig {
  readonly algorithm: 'pbft';
  readonly viewTimeoutMs: number;
  readonly maxFaultyNodes: number;
}

export interface NetworkConfig {
  readonly listenAddresses: readonly string[];
  readonly bootstrapPeers: readonly string[];
  readonly maxPeers: number;
}