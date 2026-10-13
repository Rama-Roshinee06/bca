import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@libp2p/noise';
import { mplex } from '@libp2p/mplex';
import { identify } from '@libp2p/identify';
import type { PeerInfo, NetworkConfig } from '../types';

export interface NetworkEvents {
  peerConnected: (peer: PeerInfo) => void;
  peerDisconnected: (peerId: string) => void;
  messageReceived: (peerId: string, data: Uint8Array) => void;
  error: (error: Error) => void;
}

export class P2PNetwork {
  private libp2p: Awaited<ReturnType<typeof createLibp2p>> | null = null;
  private readonly config: NetworkConfig;
  private readonly events: Partial<NetworkEvents> = {};
  private knownPeers = new Map<string, PeerInfo>();

  constructor(config: NetworkConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    this.libp2p = await createLibp2p({
      addresses: {
        listen: this.config.listenAddresses,
      },
      transports: [webSockets()],
      connectionEncryption: [noise()],
      streamMuxers: [mplex()],
      services: {
        identify: identify(),
      },
    });

    this.libp2p.addEventListener('peer:connect', (evt) => {
      const peer = evt.detail;
      this.knownPeers.set(peer.toString(), {
        id: peer.toString(),
        address: peer.toString(),
        publicKey: { bytes: new Uint8Array(0), encoding: 'ed25519' },
        lastSeen: Date.now(),
      });
      this.events.peerConnected?.(this.knownPeers.get(peer.toString())!);
    });

    this.libp2p.addEventListener('peer:disconnect', (evt) => {
      const peerId = evt.detail.toString();
      this.knownPeers.delete(peerId);
      this.events.peerDisconnected?.(peerId);
    });

    for (const bootstrap of this.config.bootstrapPeers) {
      try {
        await this.libp2p.dial(bootstrap);
      } catch (err) {
        console.warn(`Failed to dial bootstrap peer ${bootstrap}:`, err);
      }
    }
  }

  async stop(): Promise<void> {
    await this.libp2p?.stop();
    this.libp2p = null;
  }

  async broadcast(topic: string, data: Uint8Array): Promise<void> {
    if (!this.libp2p) throw new Error('Network not started');
    // Implement pubsub broadcast
  }

  async send(peerId: string, data: Uint8Array): Promise<void> {
    if (!this.libp2p) throw new Error('Network not started');
    // Implement direct send
  }

  getPeers(): readonly PeerInfo[] {
    return Array.from(this.knownPeers.values());
  }

  on<K extends keyof NetworkEvents>(event: K, handler: NetworkEvents[K]): void {
    this.events[event] = handler;
  }
}