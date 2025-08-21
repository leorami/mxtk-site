export const erc20Abi = [
    { "type": "function", "name": "name", "stateMutability": "view", "outputs": [{ "name": "", "type": "string" }], "inputs": [] },
    { "type": "function", "name": "symbol", "stateMutability": "view", "outputs": [{ "name": "", "type": "string" }], "inputs": [] },
    { "type": "function", "name": "decimals", "stateMutability": "view", "outputs": [{ "name": "", "type": "uint8" }], "inputs": [] },
    { "type": "function", "name": "totalSupply", "stateMutability": "view", "outputs": [{ "name": "", "type": "uint256" }], "inputs": [] },
    { "type": "function", "name": "balanceOf", "stateMutability": "view", "outputs": [{ "name": "", "type": "uint256" }], "inputs": [{ "name": "owner", "type": "address" }] }
] as const
