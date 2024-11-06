"use client"
import Skeleton from '@mui/material/Skeleton';
import GrantCard from "../components/GrantCard"
import factoryAbi from "../../utils/Factory.json"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import {useMetaMask} from "../../context/Web3Connect"

export default function grants() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    const { alchemyProvider } = useMetaMask()

    const retrieveData = () => {
        setTimeout(async () => {
            if(alchemyProvider) {
                const contract = new ethers.Contract("0x4402f4cAF0912431C60e9528D1e365cb3d16d208", factoryAbi, alchemyProvider);
  
                const filter = contract.filters.GrantCreated()
                const events = await contract.queryFilter(filter)
        
                setData(events)
                setLoading(false)
            }
        }, 2000)
    }

    useEffect(() => {
        retrieveData();
    }, [alchemyProvider])

    return(
        <div>
            {loading ? (
                <div className='px-4 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-28'>
                    <Skeleton className='rounded-t-[50px] mb-16' variant="rectangular" width={250} height={300} />
            
                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />
            
                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />
            
                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />
            
                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />
                </div>
            ) : (
                <div>
                    {data.length == 0 ? (
                        <p>No current quadratic fundings</p>
                    ) : (
                        <div className="px-4 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-28">    
                            {data?.map((f) => {
                                return (
                                    <GrantCard 
                                        key={f.transactionHash}
                                        cid={f.args.cid}
                                        pair={f.args.pair}
                                        candidates={f.args[1]}
                                    />
                                )
                            })}
                        </div>
                    )}
                    </div>
                )}
        </div>
    )
}   