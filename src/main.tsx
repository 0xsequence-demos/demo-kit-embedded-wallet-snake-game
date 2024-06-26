import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { sequence } from '0xsequence'
import { KitConfig, KitProvider } from '@0xsequence/kit'
import { getDefaultWaasConnectors } from '@0xsequence/kit-connectors' // Adding Embedded Wallet Config
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig, createConfig, http } from 'wagmi'
import { Chain, arbitrumNova, arbitrumSepolia, mainnet, polygon } from 'wagmi/chains'
 
const queryClient = new QueryClient()
 
const chains: readonly [Chain, ...Chain[]] = [arbitrumNova as Chain, arbitrumSepolia as Chain, mainnet as Chain, polygon as Chain]
 
// replace with your keys, and better to use env vars
const projectAccessKey = process.env.VITE_PROJECT_ACCESS_KEY!
const waasConfigKey = process.env.VITE_WAAS_CONFIG_KEY!
const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID!
const walletConnectId = process.env.VITE_WALLET_CONNECT_PROJECT_ID!
 
function Dapp() {
 
const connectors = [
  ...getDefaultWaasConnectors({
    walletConnectProjectId: walletConnectId,
    enableConfirmationModal: false, // Optional confirmation modal - can update this dynamically on your application using local storage or set a default property 
    defaultChainId: 42170,
    waasConfigKey,
    googleClientId,
    // appleClientId,
    // appleRedirectURI,
    appName: 'Snake Game FOSS Demo',
    projectAccessKey
  })
]
 
/* @ts-expect-error-next-line */
const transports: Record<number, HttpTransport> = {}
 
chains.forEach(chain => {
  const network = sequence.network.findNetworkConfig(sequence.network.allNetworks, chain.id)
  if (!network) return
 
  transports[chain.id] = http(network.rpcUrl)
})
 
const config = createConfig({
  transports,
  chains,
  connectors
})
 
const kitConfig: KitConfig = {
  projectAccessKey,
  defaultTheme: 'dark',
  signIn: {
    projectName: 'Snake Game FOSS Demo'
  }
}
 
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}> 
        <KitProvider config={kitConfig}>
          <App />
        </KitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Dapp />
  </React.StrictMode>,
)
