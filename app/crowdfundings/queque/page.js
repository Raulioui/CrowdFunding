"use client"
import { useEffect, useState } from "react"
import quequeAbi from "../../../utils/Queque.json"
import { ethers } from "ethers"
import Link from 'next/link'
import Loader from "../../components/Loader"
import truncateEthAddress from 'truncate-eth-address'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useMetaMask} from "../../../context/Web3Connect"

export default function crowdfundingRequests() {
    const [requests, setRequests] = useState([])
    const [requestsConfirmed, setRequestsConfirmed] = useState([])
    const {alchemyProvider} = useMetaMask()

    const [loading, setLoading] = useState(true)

    async function getCrowdfudningsRequests() {
        const contract = new ethers.Contract("0x1c5fc443B990002d34d7711Ddcc3C436C9219826", quequeAbi, alchemyProvider);

        const filterRequests = contract.filters.ProyectRequested()
        const eventsRequests = await contract.queryFilter(filterRequests)

        const filterRequestsConfirmed = contract.filters.ProyectApproved()
        const requestsConfirmed = await contract.queryFilter(filterRequestsConfirmed)

        setRequestsConfirmed(requestsConfirmed)
        setRequests(eventsRequests)
        
    }

    useEffect(() => {
        getCrowdfudningsRequests()
        setLoading(false)
    },[alchemyProvider])

    if(loading) return <Loader />

    return (
        <div>
                <div className="p-8  w-[95%] lg:w-[70%] m-auto">
                    <Link href="../crowdfundings">
                        <ArrowBackIcon />
                    </Link>
                    
                    {requests?.length == 0 ? (
                        <p className="mt-16">No current proyects in queque</p>
                    ) : (
                        <div className="mt-16">
                            {requests?.map((r) => {
                                return (
                                    <div>
                                        <Link className="flex text-sm flex-col md:flex-row justify-between py-4 mb-12 px-8 rounded-xl bg-[#232426] items-center gap-[50px] lg:gap-[150px]" key={r?.args[1]} href={`../crowdfundings/queque/${r?.args[2]}`}>
                                            <p>Owner: {truncateEthAddress(r?.args.owner)}</p>
                                            <div className="flex items-center ">
                                                <p>{Number(requestsConfirmed?.filter((rc) => rc?.args.id == r?.args.id).slice(-1)[0]?.args?.confirmationCount) || 0} / 1 confirmations</p>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
        </div>
    )
}