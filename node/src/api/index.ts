export interface APIServerConfig {
  readonly port: number;
  readonly host: string;
}

export interface APIServer {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export function createAPIServer(config: APIServerConfig): APIServer {
  return {
    async start() {
      console.log(`API server starting on ${config.host}:${config.port}`);
    },
    async stop() {
      console.log('API server stopped');
    },
  };
}

export interface SubmitTransactionRequest {
  assetId: string;
  action: string;
  actorId: string;
  payload: Record<string, unknown>;
  signature: string;
  nonce: number;
}

export interface SubmitTransactionResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface QueryAssetRequest {
  assetId: string;
}

export interface QueryAssetResponse {
  assetId: string;
  currentOwner: string | null;
  history: readonly {
    transactionId: string;
    action: string;
    actorId: string;
    timestamp: number;
    payload: Record<string, unknown>;
  }[];
  status: string;
}

export interface QueryBlockRequest {
  height?: number;
  hash?: string;
}

export interface QueryBlockResponse {
  height: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  timestamp: number;
  validatorId: string;
  transactions: readonly {
    id: string;
    assetId: string;
    actorId: string;
    action: string;
    timestamp: number;
  }[];
}