export const CrossTheRoadNFTABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "score", "type": "uint256" }
        ],
        "name": "mint",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

// Allow the user to fill this in after deployment
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" as const; 
