"use client"
import { useEffect, useState } from "react";
import bs58 from 'bs58'
import Image from "next/image";
import quequeAbi from "../../../../utils/Queque.json"
import { ethers } from "ethers";
import { useNotification } from '@web3uikit/core'
import Loader from "../../../components/Loader"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import {useMetaMask} from "../../../../context/Web3Connect"

export default function page({params}) {
    const { id } = params
    const [loading, setLoading] = useState(true)

    const [data, setData] = useState({})

    const [requestId, setRequestId] = useState(0)
    const [target, setTarget] = useState(0)
    const [owner, setOwner] = useState("")  

    const {alchemyProvider, signer} = useMetaMask()

    const dispatch = useNotification()

    async function retrieveCid() {
        const hashHex = "1220" + id.slice(2)
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = bs58.encode(hashBytes)
    
        const res = await fetch(`https://ipfs.io/ipfs/${hashStr}`)
        const data = await res.json(); 

        const contract = new ethers.Contract("0x1c5fc443B990002d34d7711Ddcc3C436C9219826", quequeAbi, alchemyProvider);
        
        const filterRequests = contract.filters.ProyectRequested()
        const eventsVotes = await contract.queryFilter(filterRequests)
        const request = eventsVotes.find((r) => r?.args[2] === id)
       
        setRequestId(request?.args[0])
        setOwner(request?.args.owner)
        
        const target = ethers.formatEther(Number(request?.args[3]).toString())
        setTarget(Number(target))
        setData(data)
    }

    async function handleApprove(id) {
        setLoading(true)
        const contract = new ethers.Contract ("0x1c5fc443B990002d34d7711Ddcc3C436C9219826", quequeAbi, signer);
        
        const tx = await contract.confirmTransaction(id)
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "Approved",
                title: "",
                position: "topR",
            })
            
        } else {
            throw new Error("Failed approving")
        }
        setLoading(false)
    }

    useEffect(() => {
        retrieveCid();
        setLoading(false)
    },[])

    if(loading) return(<Loader />)

    return(
        <div>
                <div className="w-[90%] xl:w-[70%] m-auto   h-[100px] md:h-[150px] xl:h-[200px] mt-12">
                    <Link href="../queque">
                        <ArrowBackIcon />
                    </Link>
                    <div className="flex flex-col items-center">
                        <Image 
                            src={`https://ipfs.io/ipfs/${data?.iconCid}`}
                            width={150}
                            height={150}
                            className="rounded-full"
                        />
                        <h1 className="text-2xl font-bold my-4">{data?.name}</h1>
                        <p className="mb-4"><span className="mr-2 font-bold text-lg">Target: </span>{target} ethers</p>
                        <p><span className="font-bold text-lg mr-2">Owner: </span> {owner}</p>
                    </div>

                    <div className="mt-16 ">
                        <h2 className="text-xl font-bold mb-2">About</h2>
                        <p className="leading-8">{data?.about}</p>
                    </div>

                    <div className="mt-16 ">
                        <h2 className="text-xl font-bold mb-2">Description</h2>
                        <p className="leading-8">{data?.description}</p>
                    </div>

                    <div className="mt-16 ">
                        <h2 className="text-xl font-bold mb-2">How will you use these funds? Please make a detailed plan for expenditures.</h2>
                        <p className="leading-8">{data?.useOfFunds}</p>
                    </div>

                    <div className="mt-16 ">
                        <h2 className="text-xl font-bold mb-2">Which RFP is this project covering?</h2>
                        <p className="leading-8">{data?.rfp}</p>
                    </div>

                    <div className="mt-16 ">
                        <h2 className="text-xl font-bold mb-2">Is this project open-source? (If yes, share the repository link).</h2>
                        <p className="leading-8">{data?.repository}</p>
                    </div>

                    <div className="mt-16 ">
                        <h2 className="text-xl font-bold mb-2">Who are the members of the team?</h2>
                        <p className="leading-8">{data?.team}</p>
                    </div>

                    <div className="mt-16 ">
                        <h2 className="text-xl font-bold mb-2">What are the Project Milestones? (Be very specific and write a roadmap highlighting critical deliverables of the project; mention how you will ensure to supervise and track them).</h2>
                        <p className="leading-8">{data?.milestones}</p>
                    </div>

                    <div className="mt-16 mb-16">
                        <h2 className="text-xl font-bold mb-2">How do you plan to reach these milestones? (Explain the project feasibility).</h2>
                        <p className="leading-8">{data?.reachPlan}</p>
                    </div>

                    <button className="font-bold bg-[#232426] text-lg mb-12 px-4 py-2 rounded-lg" onClick={() => handleApprove(requestId)}>
                        Approve
                    </button>
                </div>
        </div>
    )

}