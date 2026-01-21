
import fs from 'fs';
import path from 'path';
import solc from 'solc';
import dotenv from 'dotenv';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

dotenv.config();

const CONTRACT_FILENAME = 'CrossTheRoadNFT.sol';
const CONTRACT_PATH = path.resolve('contracts', CONTRACT_FILENAME);

function findImports(importPath) {
    try {
        const nodeModulesPath = path.resolve('node_modules', importPath);
        if (fs.existsSync(nodeModulesPath)) {
            return { contents: fs.readFileSync(nodeModulesPath, 'utf8') };
        }
    } catch (e) {
        return { error: 'File not found' };
    }
    return { error: 'File not found' };
}

async function main() {
    console.log(`Compiling ${CONTRACT_FILENAME}...`);
    const content = fs.readFileSync(CONTRACT_PATH, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            [CONTRACT_FILENAME]: {
                content,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode'],
                },
            },
        },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    if (output.errors) {
        output.errors.forEach((err) => {
            console.error(err.formattedMessage);
        });
        if (output.errors.some(e => e.severity === 'error')) {
            process.exit(1);
        }
    }

    const contract = output.contracts[CONTRACT_FILENAME]['CrossTheRoadNFT'];
    const abi = contract.abi;
    const bytecode = `0x${contract.evm.bytecode.object}`;

    console.log('Compilation successful!');

    const account = privateKeyToAccount(process.env.PRIVATE_KEY);
    const client = createWalletClient({
        account,
        chain: base,
        transport: http()
    }).extend(publicActions);

    console.log(`Deploying from ${account.address} to Base Mainnet...`);

    const hash = await client.deployContract({
        abi,
        bytecode,
        args: [],
    });

    console.log('Transaction Hash:', hash);

    const receipt = await client.waitForTransactionReceipt({ hash });

    if (receipt.contractAddress) {
        console.log(`Contract deployed at: ${receipt.contractAddress}`);

        // Update abi.ts
        const abiTsPath = path.resolve('src', 'contracts', 'abi.ts');
        let abiTsContent = fs.readFileSync(abiTsPath, 'utf8');

        // Replace address
        abiTsContent = abiTsContent.replace(
            /export const CONTRACT_ADDRESS = ".*" as const;/,
            `export const CONTRACT_ADDRESS = "${receipt.contractAddress}" as const;`
        );

        // We could also update the ABI in the file if needed, but for now just address
        fs.writeFileSync(abiTsPath, abiTsContent);
        console.log('Updated src/contracts/abi.ts');

    } else {
        console.error('Deployment failed: No contract address in receipt');
    }
}

main().catch(console.error);
