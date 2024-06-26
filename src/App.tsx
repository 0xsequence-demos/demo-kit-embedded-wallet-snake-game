import { useEffect, useState } from 'react'
import './App.css'
// @ts-ignore
import Snake from 'react-simple-snake'
import { useOpenConnectModal } from '@0xsequence/kit'
import { useDisconnect, useAccount, useWalletClient } from 'wagmi'
 
function SignatureDisplay({ signature }: any) {
  return (
    <div className='container'>
      <div className="signature-container">
        {signature && `Score signature: ${signature}`}
      </div>
    </div>
  );
}

function App() {
  const { setOpenConnectModal } = useOpenConnectModal()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: walletClient } = useWalletClient()
  const [signature, setSignature]= useState<any>(null)

  useEffect(() => {}, [signature])

  return (
    <>
      {
        isConnected && <div style={{position:'fixed', top:'30px', left:'30px'}}>{address?.slice(0,10)}...</div>
      }
      {
        isConnected && <div style={{position:'fixed', top:'30px', right:'30px'}}><button onClick={() => disconnect()}>sign out</button></div>
      }
      {
        !isConnected && <div className='main'><br/><br/><p>Snake Game</p><br/><br/><br/><button className='sign-in' onClick={() => setOpenConnectModal(true)}>Sign in</button></div>
      }
      {
        isConnected && <Snake callback={async (val: any) => {

          if(!walletClient) return;

          const message = `score: ${val.callbackReturnScore}`
          const sig = await walletClient.signMessage({
            account: address || ('' as `0x${string}`),
            message
          })

          console.log('signature:', sig)
          setSignature(sig)
        }}/>
      }
      {
        signature && <SignatureDisplay signature={signature}/>
      }
    </>
  )
}

export default App
