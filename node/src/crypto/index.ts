import { ed25519 } from '@noble/ed25519';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import type { KeyPair, PublicKey, PrivateKey, Signature, Transaction } from '../types';

export async function generateKeyPair(): Promise<KeyPair> {
  const privateKey = randomBytes(32);
  const publicKey = await ed25519.getPublicKey(privateKey);
  return {
    publicKey: { bytes: publicKey, encoding: 'ed25519' },
    privateKey: { bytes: privateKey, encoding: 'ed25519' },
  };
}

export async function signMessage(
  privateKey: PrivateKey,
  message: Uint8Array
): Promise<Signature> {
  const signature = await ed25519.sign(message, privateKey.bytes);
  return { bytes: signature, algorithm: 'ed25519' };
}

export async function verifySignature(
  publicKey: PublicKey,
  message: Uint8Array,
  signature: Signature
): Promise<boolean> {
  try {
    return await ed25519.verify(signature.bytes, message, publicKey.bytes);
  } catch {
    return false;
  }
}

export function hashMessage(message: Uint8Array): Uint8Array {
  return sha256(message);
}

export function serializeTransaction(tx: Transaction): Uint8Array {
  const data = JSON.stringify({
    id: tx.id,
    assetId: tx.assetId.value,
    actorId: tx.actorId.value,
    action: tx.action,
    timestamp: tx.timestamp,
    payload: tx.payload,
    nonce: tx.nonce,
  });
  return new TextEncoder().encode(data);
}

export async function signTransaction(
  keyPair: KeyPair,
  tx: Omit<Transaction, 'signature'>
): Promise<Transaction> {
  const message = serializeTransaction({ ...tx, signature: { bytes: new Uint8Array(0), algorithm: 'ed25519' } });
  const signature = await signMessage(keyPair.privateKey, message);
  return { ...tx, signature };
}

export async function verifyTransaction(
  publicKey: PublicKey,
  tx: Transaction
): Promise<boolean> {
  const message = serializeTransaction(tx);
  return verifySignature(publicKey, message, tx.signature);
}