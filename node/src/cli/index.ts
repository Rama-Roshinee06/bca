import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import type { NodeConfig, OrganizationId, KeyPair } from '../types';

export interface CLIContext {
  config: NodeConfig;
}

export function createCLI(): yargs.Argv<{}> {
  return yargs(hideBin(process.argv))
    .scriptName('verilock-node')
    .usage('$0 <command> [options]')
    .command(
      'start',
      'Start the VERILOCK node',
      (y) => y
        .option('config', {
          alias: 'c',
          type: 'string',
          description: 'Path to config file',
          demandOption: true,
        })
        .option('genesis', {
          alias: 'g',
          type: 'string',
          description: 'Path to genesis block file',
        }),
      async (argv) => {
        console.log('Starting node with config:', argv.config);
      }
    )
    .command(
      'submit <action>',
      'Submit a transaction',
      (y) => y
        .positional('action', {
          type: 'string',
          description: 'Action type (CREATED, TRANSFERRED, PROCESSED, etc.)',
          demandOption: true,
        })
        .option('asset-id', { type: 'string', demandOption: true })
        .option('actor-id', { type: 'string', demandOption: true })
        .option('payload', { type: 'string', default: '{}' })
        .option('nonce', { type: 'number', default: 0 }),
      async (argv) => {
        console.log('Submitting transaction:', argv);
      }
    )
    .command(
      'query <type>',
      'Query the ledger',
      (y) => y
        .positional('type', {
          type: 'string',
          choices: ['asset', 'block', 'tx'],
          demandOption: true,
        })
        .option('id', { type: 'string', demandOption: true }),
      async (argv) => {
        console.log('Querying:', argv.type, argv.id);
      }
    )
    .command(
      'peers',
      'List connected peers',
      () => {},
      async () => {
        console.log('Peers:');
      }
    )
    .command(
      'status',
      'Show node status',
      () => {},
      async () => {
        console.log('Node status:');
      }
    )
    .command(
      'generate-keys',
      'Generate a new Ed25519 key pair',
      () => {},
      async () => {
        console.log('Generating keys...');
      }
    )
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .version('0.1.0');
}

export async function runCLI(): Promise<void> {
  const cli = createCLI();
  await cli.parse();
}