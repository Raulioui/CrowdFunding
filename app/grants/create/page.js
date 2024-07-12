"use client"
import factoryAbi from "../../../utils/Factory.json"
import { useState } from "react"
import { ethers } from "ethers"
import { useNotification } from '@web3uikit/core';
import Loader from "../../components/Loader"
import { useRouter } from 'next/navigation'
import {useMetaMask} from "../../../context/Web3Connect"
import multihashes from 'multihashes';

export default function Page() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [candidates, setCandidates] = useState(0)

    const [loading, setLoading] = useState(false)
    const dispatch = useNotification()
    const router = useRouter()
    const { signer } = useMetaMask()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                method: "POST",
                headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZmY2ZmNlNC04ZmUzLTQ5MjYtYTNiMS0yZTE2YTU0NDBjYjgiLCJlbWFpbCI6InJhdWxtdWVsYW1vcmV5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmOWRhNzE1MGJmN2YwYTIyNzhkOSIsInNjb3BlZEtleVNlY3JldCI6IjNkNGEzOTlhN2M5YmRjZDEzMGQwODVkYTZiOTIxMjEwYmZhMWJjMmJkYmNiMzNlMTU1ZjIzZTMzNDYwNzI1YzUiLCJpYXQiOjE3MDg1MDUzOTN9.K1BJWGJhEUhZt5Nqm80u3cHP5lfln1QxnEZQJarJ2O8', 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: title,
                    description: description,
                }),
            });
            const resData = await res.json();
            getBytes32FromIpfsHash(resData.IpfsHash)
        } catch(error) {
            console.log("Error sending File to IPFS: ")
            console.log(error)
        }
        setLoading(false)
    }

    function getBytes32FromIpfsHash(ipfsListing) {
        const decoded = multihashes.decode(multihashes.fromB58String(ipfsListing));
    
        if (decoded.digest.length !== 32) {
            throw new Error('Invalid CID');
        }
        
        const bytes32Hex = '0x' + Buffer.from(decoded.digest).toString('hex');
        handleQFCreation(bytes32Hex)
    }

    async function handleQFCreation(bytes32) {
        setLoading(true)
        const contract = new ethers.Contract("0x4402f4cAF0912431C60e9528D1e365cb3d16d208", factoryAbi, signer)
        const tx = await contract.deployGrant(bytes32, candidates, ["0x13FFba08c4C6636062c4fD812A97a67EAfc2Fe2B","0x9a25776f75119E6345f4B04BEe675b408e244485"], 1)
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "",
                title: "Created",
                position: "topR",
            })
          router.push("/grants")
        } else {
            throw new Error("Failed creating")
        }
        setLoading(false)
    }

    if(loading) return <Loader />

    return(
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center text-center gap-12 my-16">
                <div className="w-full flex flex-col items-center m-auto">
                    <div>
                        <p className="text-4xl font-bold underline">1</p>
                        <p className="mt-2">Title</p>
                    </div>
                    <div>
                        <input type="text" required onChange={(e) => setTitle(e.target.value)} className=" p-2 w-full h-[50px] bg-[#232426] border border-white w-[200px] sm:w-[400px] mt-8 rounded-md"/>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center m-auto mt-12">
                    <div>
                        <p className="text-4xl font-bold underline">2</p>
                        <p className="mt-2">About the grant</p>
                    </div>
                    <div>
                        <input type="text" required onChange={(e) => setDescription(e.target.value)} className="w-full overflow-y-auto p-2 h-[100px] bg-[#232426] border border-white w-[200px] sm:w-[400px] mt-8 rounded-md"/>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center m-auto mt-12">
                    <div>
                        <p className="text-4xl font-bold underline">3</p>
                        <p className="mt-2">Select maximum candidates of the grant</p>
                    </div>
                    <div>
                        <input type="number" required onChange={(e) => setCandidates(e.target.value)} className="w-full overflow-y-auto p-2 h-[50px] bg-[#232426] border border-white w-[200px] sm:w-[400px] mt-8 rounded-md"/>
                    </div>
                </div>

                <button className="border border-2 rounded-md mb-12 m-auto font-bold px-4 py-2 w-[150px]">
                    Submit
                </button>
            
            </form>
        </div>
    )

}