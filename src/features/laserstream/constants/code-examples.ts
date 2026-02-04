// Code examples for Laserstream demo

export const LASERSTREAM_CODE_EXAMPLES: Record<string, CodeExample> = {
  'connect-websocket': {
    typescript: `// Connect to Laserstream WebSocket
const ws = new WebSocket(
  'wss://atlas-mainnet.helius-rpc.com/?api-key=YOUR_API_KEY'
);

ws.onopen = () => {
  console.log('Connected to Laserstream');

  // Subscribe to slot notifications
  ws.send(JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'slotSubscribe',
    params: []
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // Handle subscription confirmation
  if (data.id === 1) {
    console.log('Subscribed with ID:', data.result);
    return;
  }

  // Handle slot notifications
  if (data.method === 'slotNotification') {
    const { slot, parent, root } = data.params.result;
    console.log(\`Slot: \${slot}, Parent: \${parent}, Root: \${root}\`);
  }
};

ws.onerror = (error) => console.error('WebSocket error:', error);
ws.onclose = () => console.log('Disconnected from Laserstream');`,

    curl: `# WebSocket connections require a client library.
# Using websocat for command-line WebSocket:

websocat "wss://atlas-mainnet.helius-rpc.com/?api-key=YOUR_API_KEY"

# Then send subscription request:
{"jsonrpc":"2.0","id":1,"method":"slotSubscribe","params":[]}`,
  },

  'block-subscribe': {
    typescript: `// Subscribe to block notifications with transaction details
ws.send(JSON.stringify({
  jsonrpc: '2.0',
  id: 2,
  method: 'blockSubscribe',
  params: [
    'all', // or { mentionsAccountOrProgram: '<PUBKEY>' }
    {
      commitment: 'confirmed',
      encoding: 'json',
      transactionDetails: 'signatures',
      showRewards: false,
      maxSupportedTransactionVersion: 0
    }
  ]
}));

// Handle block notifications
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.method === 'blockNotification') {
    const block = data.params.result.value.block;
    console.log(\`Block at slot \${data.params.result.context.slot}\`);
    console.log(\`Transactions: \${block.signatures?.length || 0}\`);
    console.log(\`Block time: \${new Date(block.blockTime * 1000)}\`);
  }
};`,

    curl: `# Block subscription request
{"jsonrpc":"2.0","id":2,"method":"blockSubscribe","params":["all",{"commitment":"confirmed","encoding":"json","transactionDetails":"signatures","showRewards":false,"maxSupportedTransactionVersion":0}]}`,
  },

  'account-subscribe': {
    typescript: `// Subscribe to account changes (e.g., monitor a wallet)
const accountPubkey = 'YourAccountPublicKeyHere';

ws.send(JSON.stringify({
  jsonrpc: '2.0',
  id: 3,
  method: 'accountSubscribe',
  params: [
    accountPubkey,
    {
      commitment: 'confirmed',
      encoding: 'jsonParsed'
    }
  ]
}));

// Handle account change notifications
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.method === 'accountNotification') {
    const accountInfo = data.params.result.value;
    console.log('Account updated!');
    console.log(\`Lamports: \${accountInfo.lamports}\`);
    console.log(\`Owner: \${accountInfo.owner}\`);
    console.log(\`Data: \${JSON.stringify(accountInfo.data)}\`);
  }
};`,

    curl: `# Account subscription request
{"jsonrpc":"2.0","id":3,"method":"accountSubscribe","params":["<ACCOUNT_PUBKEY>",{"commitment":"confirmed","encoding":"jsonParsed"}]}`,
  },
};
