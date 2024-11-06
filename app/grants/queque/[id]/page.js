"use client"
import { useState, useEffect } from "react"
import grantAbi from "../../../../utils/Grant.json"
import grantQuequeAbi from "../../../../utils/GrantQueque.json"
import { ethers } from "ethers"
import Loader from "../../../components/Loader"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GrantComponent from "../../../components/GrantComponent"
import Link from "next/link"
import {useMetaMask} from "../../../../context/Web3Connect"

export default function Page({params}) {
    const { id } = params

    const [loading, setLoading] = useState(true)
    const [proyectsInQueque, setProyectsInQueque] = useState([])
    const [quequeAddress, setQuequeAddress] = useState()
    const {alchemyProvider} = useMetaMask()
    
    async function retrieveData() {
        const grant = new ethers.Contract(id, grantAbi, alchemyProvider)
        const filterProyectsExecuted = grant.filters.ProyectAccepted()
        const proyectsExecuted = await grant.queryFilter(filterProyectsExecuted)
        const quequeAddress = await grant.queque()
    
        const queque = new ethers.Contract(quequeAddress, grantQuequeAbi, alc)
        const filterProyectsInQueque = queque.filters.ProyectRequested()
        const quequeProyects = await queque.queryFilter(filterProyectsInQueque)
        const proyectsInQueque = quequeProyects.filter(p => {
            return !proyectsExecuted.some(ej => ej.args.cid === p.args.cid)
        }) 
        setQuequeAddress(quequeAddress)
        setProyectsInQueque(proyectsInQueque)
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.ethereum) {
                retrieveData();
            } else {
              console.error("Please install MetaMask!");
            }
        }
        setLoading(false)
    },[])

    if(loading) {
        return <Loader/>
    }

    return (
        <div>
            <div className="w-[95%] md:w-[70%] m-auto  mt-[100px]">
                <Link href={`/grants/${id}`}>
                    <ArrowBackIcon fontSize="large"/>
                </Link>
                
                <h2 className="font-bold mt-16 text-2xl text-center mb-[60px]">Proyects in the queque</h2>
                        {proyectsInQueque.length == 0 ? (
                            <p>No current proyects</p>
                        ) : (
                            <div className="flex items-center gap-8 justify-center flex-wrap">
                                {proyectsInQueque?.map((p, i) => {
                                    return (
                                        <GrantComponent requestPeriod={true}  key={i} cid={p.args.cid} id={p.args.id} isApproved={false} quequeAddress={quequeAddress}/>
                                    )
                                })}
                            </div>
                        )}
                    </div>
        </div>
    )
}