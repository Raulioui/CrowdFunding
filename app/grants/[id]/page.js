"use client"
import { useEffect, useState } from "react"
import grantAbi from "../../../utils/Grant.json"
import Loader from "../../components/Loader"
import { ethers } from "ethers"
import Link from 'next/link'
import bs58 from 'bs58'
import GrantComponent from "../../components/GrantComponent"
import { useMetaMask } from "../../../context/Web3Connect"
import Footer from "../../components/Footer"
import ButtonsDisplay from "../../components/ButtonsDisplay"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Page({params}) {
    const {id} = params

    const [loading, setLoading] = useState(true)

    const [proyectsExecuted, setProyectsExecuted] = useState([])
    const [fundsDistributed, setFundsDistributed] = useState([])
    const [amountShared, setAmountShared] = useState(0)

    const [status, setStatus] = useState(0)
    const [candidates, setCandidates] = useState(0)
    const [data, setData] = useState({})
    const [quequeAddress, setQuequeAddress] = useState()
    const [date, setDate] = useState()
    const [amountToShare, setAmountToShare] = useState(0)
    const {alchemyProvider , signer} = useMetaMask()

    async function retrieveData() {
        const contract = new ethers.Contract(id, grantAbi, alchemyProvider);

        const filterProyectsExecuted = contract.filters.ProyectAccepted()
        const proyectsExecuted = await contract.queryFilter(filterProyectsExecuted)

        const quequeAddress = await contract.queque()
        setQuequeAddress(quequeAddress)

        const filterFundsDistributed = contract.filters.FundsDistributed()
        const fundsDistributed = await contract.queryFilter(filterFundsDistributed)
        setFundsDistributed(fundsDistributed)

        const filterFundDistributed = contract.filters.PoolDistributionCompleted()
        const fundDistributed = await contract.queryFilter(filterFundDistributed)
        setAmountShared(Number(fundDistributed[0]?.args.totalAmountDistributed))
        
        const amountToShare = await alchemyProvider.getBalance(id)
        setAmountToShare(ethers.formatEther(amountToShare.toString())) 

        const status = await contract.fundingStatus()
        setStatus(status)

        const candidates = await contract.candidates()
        setCandidates(candidates)

        const cid = await contract.cid()
        const hashHex = "1220" + cid.slice(2)
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = bs58.encode(hashBytes)
    
        const res = await fetch(`https://ipfs.io/ipfs/${hashStr}`)
        const data = await res.json();

        setData(data)

        if(status == 0) {
            const requestPeriodEnding = await contract.requestPeriodEnding()
            const date = new Date(Number(requestPeriodEnding) * 1000)
            setDate(date.toDateString())
        }

        if(status == 1) {
            const requestPeriodEnding = await contract.fundingPeriod()
            const date = new Date(Number(requestPeriodEnding) * 1000)
            setDate(date.toDateString())
        }
 
        setProyectsExecuted(proyectsExecuted)
    }

    async function handleEndRequestPeriod(e) {
        e.preventDefault()
        setLoading(true)
        const contract = new ethers.Contract(id, grantAbi, signer);
        
        const tx = await contract.endRequestPeriod()
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "Request period ended",
                title: "Ended",
                position: "topR",
            })
        } else {
            throw new Error("Failed ending request period")
        }
        setLoading(false)
    }

    useEffect(() => {
        retrieveData();
        setLoading(false)
    },[alchemyProvider])

    if(loading) {
        return <Loader/>
    }

    if(status == 0) {
        return(
            <div>
                <div className="px-8 mt-20 flex items-center justify-between mb-16 w-[95%] lg:w-[65%] m-auto">
                        <Link className="" href={"/"}>
                            <ArrowBackIcon fontSize="large"/>
                        </Link>
                    <ButtonsDisplay buttons={
                        [{text: "View proyects in queque ", link: `/grants/queque/${id}`}]
                    } id={id} status={0}/> 
                </div>

                <div className="w-[95%] lg:w-[70%] mt-[25px] md:mt-[50px] mx-auto text-center ">  
                    <h2 className="mb-[50px] font-bold text-4xl text-center  lg:text-5xl">{data?.title}</h2>
                    <p className="leading-8 text-md mb-[50px]">{data?.description}</p>
                </div>

                <div className=" w-[95%] my-16  lg:w-[80%] m-auto text-lg flex flex-col justify-center items-center">
                    <h2 className="mb-4">Amount to share:  {amountToShare.toString()} ethers</h2>
                    <p className="mb-4">Request period ending: {date}</p>
                    
                    <Link className={`${proyectsExecuted?.length == Number(candidates) && "hover:cursor-not-allowed"} order border-2 rounded-md mt-4 hover:bg-[#232426] duration-100 font-bold px-16 py-2`} href={`apply/${id}`}>
                        Apply
                    </Link>

                    <div className="mt-[100px] flex flex-col items-center lg:items-start">
                        <div className="flex items-center  gap-8 mb-[60px]">
                            <h2 className="font-bold text-2xl ">Proyects</h2>
                            <p>{proyectsExecuted?.length} of {candidates.toString()}</p>
                        </div>

                        <div className="">
                            {proyectsExecuted.length == 0 ? (
                                <p>No current proyects</p>
                            ) : (
                                <div className="flex items-center justify-center lg:justify-start gap-8 flex-wrap">
                                    {proyectsExecuted?.map((p, i) => {
                                        return (
                                            <GrantComponent 
                                                owner={p.args.proyectOwner}
                                                qfManagerAddress={id}
                                                key={i} 
                                                cid={p.args.cid} 
                                                id={p?.args?.proyectId} 
                                                quequeAddress={quequeAddress} 
                                                isApproved={true}
                                            />
                                        )
                                    })}
                            
                                </div>
                                )}
                        </div>
                    </div>

                    <button onClick={handleEndRequestPeriod} className="bg-[#232426] text-white px-8 py-2 rounded-md mt-12 hover:bg-[#232426] duration-100 ">
                        End Request Period (only owner) 
                    </button>

                </div>

                <Footer/>
            </div>
        )
    }

    if(status == 1) {
        return(
            <div>
                <div className="px-8 mt-20 flex items-center justify-between mb-16 w-[95%] lg:w-[65%] m-auto">
                    <Link className="" href={"/"}>
                        <ArrowBackIcon fontSize="large"/>
                    </Link>
                    <ButtonsDisplay status={1}/>
                </div>

                <div>
                    <div className="w-[95%] mb-12 lg:w-[60%] m-auto text-lg mt-8 flex flex-col justify-center items-center">
                        <h2 className="mb-4">Amount to share: {Number(ethers.utils.formatEther(Number(amountToShare).toString()))} ethers</h2>
                        <p className="mb-4">Funding period ends: date</p>
                    </div>

                    <div className="text-center w-[95%] lg:w-[70%] m-auto">
                        <h2 className="mb-[50px] font-bold text-4xl">{data?.title}</h2>
                        <p className="text-md mb-[50px]">{data?.description}</p>
                    </div>

                    <div>
                        {proyectsExecuted == [] ? (
                            <p>No current proyects</p>
                        ) : (
                            <div className="flex flex-wrap gap-8 p-8 justify-start items-center">
                                {proyectsExecuted?.map((p, i) => {
                                    return (
                                        <GrantComponent requestPeriod={false} owner={p.args.proyectOwner} qfManagerAddress={id} key={i} cid={p.args.cid} id={p?.args?.proyectId} quequeAddress={quequeAddress} isApproved={true} />
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className="mt-[200px] text-center pb-28">
                        <button onClick={handleFundingEnded}>
                            End funding period (only owner)
                        </button>
                    </div>
                </div>

                <Footer />

            </div>
        )
    }

    if(status == 2) {
        return(
            <div>
                <div className="px-8 mt-20 flex items-center justify-between mb-16 w-[95%] lg:w-[65%] m-auto">
                    <Link className="" href={"/"}>
                        <ArrowBackIcon fontSize="large"/>
                    </Link>
                    <ButtonsDisplay status={2}/>
                </div>

                <div className="w-[95%] lg:w-[60%] m-auto text-lg mt-8 flex flex-col justify-center items-center">
                    <h1 className="mt-12 font-bold text-4xl">Funding completed</h1>
                    <p className=" mb-12">Amount shared: {Number(ethers.utils.formatEther(Number(amountShared).toString()))} ethers</p>
                    <h2 className="mb-[50px] font-bold text-2xl">{data?.title}</h2>
                    <p className="text-md mb-[50px]">{data?.description}</p>

                    <div className="mt-18  w-full m-auto">
                        {fundsDistributed?.map((f) => {
                            return (
                                <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                                    <p>Proyect owner: {f?.args.proyectOwner}</p>
                                    <p>Amount received: {Number(ethers.utils.formatEther(Number(f?.args.amount).toString()))}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}