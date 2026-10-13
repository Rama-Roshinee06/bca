import { randomBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import type { NodeConfig, OrganizationId, KeyPair, Block, BlockHeader, ConsensusConfig, NetworkConfig, PeerInfo, GenesisConfig } from '../types';

export function generateGenesisConfig(validators: readonly OrganizationId[]): GenesisConfig {
  return {
    chainId: 'verilock-mainnet',
    timestamp: Date.now(),
    validators: validators.map((v, i) => ({
      id: v,
      stake: 100,
      address: `validator-${i}`,
    })),
    initialAssets: [],
    consensusParams: {
      viewTimeoutMs: 10000,
      maxFaultyNodes: Math.floor((validators.length - 1) / 3),
    },
  };
}

export function buildGenesisBlock(
  genesisConfig: GenesisConfig,
  validatorKeyPairs: Map<OrganizationId, KeyPair>
): Block {
  const primaryValidator = genesisConfig.validators[0].id;

  const header: BlockHeader = {
    height: 0,
    timestamp: genesisConfig.timestamp,
    previousHash: new Uint8Array(32),
    merkleRoot: sha256(new TextEncoder().encode('genesis')),
    validatorId: primaryValidator,
    consensusProof: {
      type: 'pbft',
      view: 0,
      sequenceNumber: 0,
      signatures: new Map(),
    },
  };

  return { header, transactions: [] };
}

export function loadConfig(path: string): NodeConfig {
  const fs = require('fs');
  const config = JSON.parse(fs.readFileSync(path, 'utf-8'));

  return {
    nodeId: { value: config.nodeId, encoding: 'ed25519' },
    keyPair: {
      publicKey: { bytes: Uint8Array.from(config.keyPair.publicKey), encoding: 'ed25519' },
      privateKey: { bytes: Uint8Array.from(config.keyPair.privateKey), encoding: 'ed25519' },
    },
    genesisBlock: config.genesisBlock,
    peers: config.peers.map((p: any) => ({
      id: p.id,
      address: p.address,
      publicKey: { bytes: Uint8Array.from(p.publicKey), encoding: 'ed25519' },
      lastSeen: p.lastSeen,
    })),
    consensusConfig: config.consensusConfig,
    networkConfig: config.networkConfig,
    storagePath: config.storagePath,
  };
}

export function saveConfig(config: NodeConfig, path: string): void {
  const fs = require('fs');
  const data = {
    nodeId: config.nodeId.value,
    keyPair: {
      publicKey: Array.from(config.keyPair.publicKey.bytes),
      privateKey: Array.from(config.keyPair.privateKey.bytes),
    },
    genesisBlock: config.genesisBlock,
    peers: config.peers.map((p) => ({
      id: p.id,
      address: p.address,
      publicKey: Array.from(p.publicKey.bytes),
      lastSeen: p.lastSeen,
    })),
    consensusConfig: config.consensusConfig,
    networkConfig: config.networkConfig,
    storagePath: config.storagePath,
  };
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

export function generateNodeId(): OrganizationId {
  const bytes = randomBytes(16);
  return { value: `org-${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}`, encoding: 'ed25519' };
}