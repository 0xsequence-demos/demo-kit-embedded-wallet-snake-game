import './App.css'
// @ts-ignore
import Snake from 'react-simple-snake'
import { useOpenConnectModal } from '@0xsequence/kit'
import { useDisconnect, useAccount, useWalletClient } from 'wagmi'
 
function App() {
  const { setOpenConnectModal } = useOpenConnectModal()
  const { isConnected, address } = useAccount()
  const {disconnect} = useDisconnect()
  const { data: walletClient } = useWalletClient()

  return (
    <>
      {
        isConnected && <div style={{position:'fixed', top:'30px', right:'30px'}}><button onClick={() => disconnect()}>sign out</button></div>
      }
      {
        !isConnected && <div className='main'><p>Snake Game</p><button onClick={() => setOpenConnectModal(true)}>sign in</button></div>
      }
      {
        isConnected && <Snake callback={async (val: any) => {
          console.log(val)

          if(!walletClient) return;
          const message = `score: ${val.callbackReturnScore}`
          const sig = await walletClient.signMessage({
            account: address || ('' as `0x${string}`),
            message
          })
          
          console.log('address', address)
          console.log('signature:', sig)
        }}/>
      }
    </>
  )
}

export default App
