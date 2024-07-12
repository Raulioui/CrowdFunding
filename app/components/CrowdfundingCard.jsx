"use client"
import { useEffect, useState } from "react";
import bs58 from 'bs58'
import Image from "next/image";
import Link from "next/link";
import Loader from "../components/Loader";
import { motion } from 'framer-motion';

export default function crowdfundingCard({cid, target, timeLimit, pair, searchParam}) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})
    const [date, setDate] = useState()

    async function retrieveCid() {
        const hashHex = "1220" + cid.slice(2)
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = bs58.encode(hashBytes)

        const date = new Date(Number(timeLimit) * 1000)
        setDate(date.toDateString())
    
        const res = await fetch(`https://ipfs.io/ipfs/${hashStr}`)
        const data = await res.json();

        setData(data)
    }

    useEffect(() => {
        retrieveCid()
        setLoading(false)
    },[])

    if(loading) return (<Loader />)

    if(searchParam == "") return (
        <div>
            <Link href={`/crowdfundings/${cid}}`}> 
                <div className="h-[300px]  hover:bg-[#232426] duration-300 p-4 w-[250px] rounded-t-[50px] border mb-8">
                    <div>
                        <Image 
                            src={`https://ipfs.io/ipfs/${data?.iconCid}`}
                            width={100}
                            height={100}
                            className="rounded-full m-auto"
                        />
                    </div>
                    <div className="">
                        <h1 className="font-bold  mt-4 mb-2 text-xl">{data?.name}</h1>
                        {timeLimit !== undefined && <p className="mb-2"><span className="font-bold text-lg ">Ends: <span className="ml-2 text-grey text-sm">{date}</span></span> </p>}
                        
                        <p className="text-sm text-base text-ellipsis line-clamp-4  leading-relaxed h-[90px] overflow-hidden ">{data.about}</p>
                    </div>
                </div>
            </Link> 
        </div>
    ) 

    const isEqual = data?.name.toLowerCase().includes(searchParam?.toLowerCase())

    return(
        <>
            {data?.length == 0  ? (<Loader />) : (
                <div className={`${!isEqual && "hidden"}`}>    
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 100, y: 0 }}
                        transition={{ duration: 3 }}
                    >
                        <div>
                            <Link href={`/crowdfundings/${cid}}`}> 
                                <div className="h-[300px] hover:bg-[#232426] duration-300 p-3 w-[250px] rounded-t-[50px] border mb-8">
                                    <div>
                                        <Image 
                                            src={`https://ipfs.io/ipfs/${data?.iconCid}`}
                                            width={100}
                                            height={100}
                                            className="rounded-full m-auto"
                                        />
                                    </div>
                                    <div >
                                        <h1 className="font-bold  mt-4 mb-2 text-xl">{data?.name}</h1>
                                        {timeLimit !== undefined && <p className="mb-2"><span className="font-bold text-lg ">Ends: <span className="ml-2 text-grey text-sm">{date}</span></span> </p>}
                                                    
                                        <p className="text-sm text-base text-ellipsis line-clamp-4  leading-relaxed h-[90px] overflow-hidden">{data.about}</p>
                                    </div>
                                </div>
                            </Link> 
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    )
}