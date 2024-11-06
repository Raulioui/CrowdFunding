"use client"
import { useState, useEffect } from 'react'
import quequeAbi from '../../utils/Queque.json'
import CrowdfundingCard from '../components/CrowdfundingCard'
import Skeleton from '@mui/material/Skeleton';
import {useSearchParams, usePathname, useRouter} from "next/navigation"
import {useDebouncedCallback} from 'use-debounce'
import { ethers } from 'ethers'
import SearchIcon from '@mui/icons-material/Search';
import {useMetaMask} from '../../context/Web3Connect'

export default function Crowdfundings() {
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const {replace} = useRouter()
    const [loading, setLoading] = useState(true)

    const [requestsExecuted, setRequestsExecuted] = useState([])
    const [param, setParam] = useState("")
    const { alchemyProvider } = useMetaMask()

    const handleSearch = useDebouncedCallback((string) => {
        const param = new URLSearchParams(searchParams)
        setParam(string)
        if(string) {
            param.set("search", string)
        } else {
            param.delete("search")
        }
        replace(`${pathName}?${param.toString()}`)
    }, 100)

    const retrieveData = () => {
        setTimeout(async () => {
            if(alchemyProvider) {
                const contract = new ethers.Contract("0x1c5fc443B990002d34d7711Ddcc3C436C9219826", quequeAbi, alchemyProvider);
                const filterExecuted = contract.filters.ProyectExecuted()
                const eventsExecuted = await contract.queryFilter(filterExecuted)
                setRequestsExecuted(eventsExecuted)
                setLoading(false)
            }
        }, 1000) 
    }

    useEffect(() => { 
        retrieveData()
    },[alchemyProvider]) 
 
    return(
        <div>
            {loading ? (
                <div className='px-4 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-28'>
                    <Skeleton className='rounded-t-[50px] mb-16' variant="rectangular" width={250} height={300} />

                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />

                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />

                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />

                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />

                    <Skeleton className='rounded-t-[50px] mb-16' variant="rectangular" width={250} height={300} />

                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />

                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />

                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />

                    <Skeleton className='rounded-t-[50px]' variant="rectangular" width={250} height={300} />
                </div>
            ) : ( 
                <div>
                    
                    <div className='text-center'>
                        <div className="p-2 hover:border-[#26C06A] duration-500  bg-transparent border-[#303030] border-[1px] flex justify-between items-center w-[200px] md:w-[500px] xl:w-[650px] m-auto rounded-full py-1">
                            <SearchIcon className='w-[15%] md:w-[8%] m-auto'/>
                            <input 
                                defaultValue={searchParams.get("query")?.toString()} 
                                onChange={(e) => handleSearch(e.target.value)} 
                                placeholder='Search for Proyects' 
                                className='py-2 font-bold border-none outline-none w-[85%] md:w-[90%] rounded-lg bg-transparent'>
                            </input>
                        </div>
                    </div>
                    <div>
                        {requestsExecuted?.length == 0 ? (
                            <p className='text-xl font-bold'>No active crowdfundings</p>
                        ) : (
                            <div className='px-4 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-28'>
                                {requestsExecuted?.map((r) => {
                                    return (
                                        <CrowdfundingCard 
                                            key={r?.args[0]}
                                            cid={r?.args[4]}
                                            target={r?.args[2]}
                                            timeLimit={r?.args[3]}
                                            pair={r?.args[1]}
                                            searchParam={param.toString()}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
             )} 
        </div>
    )
}