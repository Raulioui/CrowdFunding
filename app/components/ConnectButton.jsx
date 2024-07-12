'use client'
import { useState } from 'react'
import { useMetaMask } from '../../context/Web3Connect';
import truncateEthAddress from 'truncate-eth-address'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ConnectButton() {
  const [showModal, setShowModal] = useState(false)
  const { connect, disconnect, address, isConnected} = useMetaMask()

  return (
    <div>
      {isConnected ? (
          <div>
            <div className='hover:bg-[#232426] duration-100 border-2 border-[#232426] hover:cursor-pointer inline-block rounded-2xl py-3 px-8' >
                <p onClick={() => setShowModal(true)}>{truncateEthAddress(address)}</p>
            </div>
            {showModal && (
              <div className="absolute top-[110px] bg-[#191B1F] rounded-lg w-[300px] right-10 border-2 border-[#232426] rounded-2xl p-2">
                  <div className='text-sm text-gray-400'>
                    <div>
                      <ArrowBackIcon className='hover:cursor-pointer' onClick={() => setShowModal(false)} />
                    </div>
                    
                    <div className='pt-4 flex gap-4 items-center'>
                      <p>Connected wallet</p>
                      <div className='rounded-full h-[10px] w-[10px] bg-[#01B984]'></div>
                    </div>
                    <p className='pt-2 '>{truncateEthAddress(address)}</p>
                    {/* <p className='pb-4 pt-2'>Chain id: {chainId}</p> */}
                  </div>
                  <div>
                    <button className='bg-[#232426] rounded-full py-2 mt-2  w-full' onClick={disconnect}>
                      Disconnect
                    </button>
                  </div>
              </div>
            )}
          </div>
        ) : (
            <button onClick={connect} className='hover:bg-[#232426] duration-100 border-2 border-[#232426] hover:cursor-pointer inline-block rounded-2xl py-3 px-8'>
              Connect wallet
            </button>
        )}
    </div>
  )
}