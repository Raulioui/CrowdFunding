"use client"
import { useEffect, useState } from "react";
import bs58 from 'bs58'
import Loader from "./Loader";
import Link from "next/link";

export default function GrantCard({candidates, cid, pair}) {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)

    async function retrieveCid() {
        const hashHex = "1220" + cid.slice(2)
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = bs58.encode(hashBytes)
    
        const res = await fetch(`https://ipfs.io/ipfs/${hashStr}`)
        const data = await res.json();

        setData(data)
    }

    useEffect(() => {
        retrieveCid()
        setLoading(false)
    },[])

    if(loading) return <Loader />

    return(
        <Link href={`grants/${pair}`}>
            <div className="h-[300px] hover:bg-[#232426] duration-100 p-6 w-[250px] rounded-t-[50px] border mb-8">
                <h2 className="font-bold text-lg mb-4">{data.title}</h2>
                <p className="mb-4"><span className="font-bold">Max candidates: </span>{candidates.toString()}</p>
                <p className="text-md text-base text-ellipsis line-clamp-4  leading-relaxed h-[130px] overflow-hidden">{data.description}</p>
            </div>
        </Link>
    )
} 