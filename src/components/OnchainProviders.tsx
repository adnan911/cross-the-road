import React from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

// Setup Wagmi Config
const wagmiConfig = createConfig({
    chains: [base],
    connectors: [
        coinbaseWallet({
            appName: 'Cross The Road',
        }),
    ],
    transports: {
        [base.id]: http(),
    },
});

const queryClient = new QueryClient();

export function OnchainProviders({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    chain={base}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
