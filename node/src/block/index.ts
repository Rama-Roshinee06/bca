import { sha256 } from '@noble/hashes/sha256';
import { concatBytes } from '@noble/hashes/utils';
import type { Block, BlockHeader, Transaction, OrganizationId } from '../types';

export function buildMerkleRoot(transactions: readonly Transaction[]): Uint8Array {
  if (transactions.length === 0) {
    return sha256(new TextEncoder().encode('empty'));
  }

  let layer = transactions.map((tx) => hashTransaction(tx));

  while (layer.length > 1) {
    const nextLayer: Uint8Array[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = i + 1 < layer.length ? layer[i + 1] : left;
      nextLayer.push(sha256(concatBytes(left, right)));
    }
    layer = nextLayer;
  }

  return layer[0];
}

function hashTransaction(tx: Transaction): Uint8Array {
  const data = JSON.stringify({
    id: tx.id,
    assetId: tx.assetId.value,
    actorId: tx.actorId.value,
    action: tx.action,
    timestamp: tx.timestamp,
    payload: tx.payload,
    nonce: tx.nonce,
    signature: Array.from(tx.signature.bytes),
  });
  return sha256(new TextEncoder().encode(data));
}

export function buildBlock(
  height: number,
  previousHash: Uint8Array,
  transactions: readonly Transaction[],
  validatorId: OrganizationId,
  consensusProof: BlockHeader['consensusProof']
): Block {
  const timestamp = Date.now();
  const merkleRoot = buildMerkleRoot(transactions);

  const header: BlockHeader = {
    height,
    timestamp,
    previousHash,
    merkleRoot,
    validatorId,
    consensusProof,
  };

  return { header, transactions };
}

export function hashBlockHeader(header: BlockHeader): Uint8Array {
  const data = JSON.stringify({
    height: header.height,
    timestamp: header.timestamp,
    previousHash: Array.from(header.previousHash),
    merkleRoot: Array.from(header.merkleRoot),
    validatorId: header.validatorId.value,
  });
  return sha256(new TextEncoder().encode(data));
}

export function verifyBlock(block: Block, expectedPreviousHash: Uint8Array): boolean {
  const merkleRoot = buildMerkleRoot(block.transactions);
  if (!bytesEqual(merkleRoot, block.header.merkleRoot)) {
    return false;
  }
  if (!bytesEqual(block.header.previousHash, expectedPreviousHash)) {
    return false;
  }
  return true;
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}