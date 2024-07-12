"use client"
import { useEffect, useState } from "react"
import Loader from "./Loader"
import { ethers } from "ethers"
import Image from "next/image"
import grantQueque from "../../utils/GrantQueque.json"
import grant from "../../utils/Grant.json"
import bs58 from 'bs58'
import { useNotification } from "@web3uikit/core"

export default function GrantComponent({cid, id, quequeAddress, isApproved, grantAddress, owner, requestPeriod}) {
    
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState({})

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const dispatch = useNotification()

    const [donation, setDonation] = useState("")

    async function retrieveData() {
        const hashHex = "1220" + cid.slice(2)
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = bs58.encode(hashBytes)
    
        const res = await fetch(`https://ipfs.io/ipfs/${hashStr}`)
        const data = await res.json();

        setData(data)
    }

    useEffect(() => {
        setLoading(true)
        retrieveData()
        setLoading(false)
    },[])
    
    const handleApproval = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(quequeAddress, grantQueque, signer)
      
        const tx = await contract.confirmTransaction(id)
        setLoading(true)
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "",
                title: "Approved",
                position: "topR",
            })
            setLoading(false)
        } else {
            
            dispatch({
                type: "error",
                message: "",
                title: "Failed approving",
                position: "topR",
            })

            throw new Error("Failed approving")
        } 
    }

    async function handleDonation(e) {
        e.preventDefault()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract (
            grantAddress, grant, signer
        );
 
        const tx = await contractInstance.donate(id, {value: ethers.utils.parseEther(donation.toString())})
        setLoading(true)
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "Donation completed",
                title: "Completed",
                position: "topR",
            })
            setLoading(false)
        } else {
            throw new Error("Failed donation")
        }
    }

    if(loading) return <Loader />

    return(
        <div >
            <div  onClick={handleOpen} className="h-[300px] hover:bg-[#232426] duration-300 p-3 w-[250px] rounded-t-[50px] border mb-8">
                <Image 
                    src={`https://ipfs.io/ipfs/${data?.iconCid}`}
                    width={80}
                    height={80}
                    className="rounded-full m-auto my-4"
                />
                <div className="flex  justify-between mb-4 items-center mt-4">
                    <h2 className="font-bold text-xl m-auto">{data.name}</h2>
                </div>
            
                <p className="text-sm text-base text-ellipsis line-clamp-4  leading-relaxed h-[90px] overflow-hidden">{data.about}</p>
            </div>

            {open && (
                <div
                    data-twe-modal-init
                    class="fixed p-4 md:p-12 left-0 top-0 z-[1055]  h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                    id="exampleModalCenteredScrollable"
                    tabindex="-1"
                    aria-labelledby="exampleModalCenteredScrollableLabel"
                    aria-modal="false"
                    role="dialog">
                    <div
                        data-twe-modal-dialog-ref
                        class="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center  transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-[calc(100%-3.5rem)] min-[576px]:max-w-[95%] lg:min-[576px]:max-w-[70%] p-4">
                        <div
                            class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-[#232426] bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
                            <div
                            class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">

                            <h5
                                class="text-xl font-medium leading-normal text-surface dark:text-white"
                                id="exampleModalCenteredScrollableLabel">
                                {data.name}
                            </h5>
                            
                            <button
                                type="button"
                                onClick={handleClose}
                                class="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                data-twe-modal-dismiss
                                aria-label="Close">
                                <span class="[&>svg]:h-6 [&>svg]:w-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor">
                                    <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round" 
                                    d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                </span>
                            </button>
                            </div>
                            <div className="p-4 lg:p-12 text-left">
                                <Image 
                                    src={`https://ipfs.io/ipfs/${data?.iconCid}`}
                                    width={150}
                                    height={150}
                                    className="rounded-full m-auto mb-12"
                                />

                                <h3 className="mb-8 text-center"><span className="font-bold">Owner: </span>{owner}</h3>

                                <h2 className="text-xl font-bold mt-2 mb-4">About</h2>
                                <p className="mb-16 leading-8">{data.about}</p>
                                                                            
                                <h2 className="text-xl  font-bold mb-4">How will you use these funds? Please make a detailed plan for expenditures.</h2>
                                <p className="leading-8 mb-16">{data?.useOfFunds}</p>
                            
                                <h2 className="text-xl  font-bold mb-4">Which RFP is this project covering?</h2>
                                <p className="leading-8 mb-16">{data?.rfp}</p>
                                                
                                <h2 className="text-xl  font-bold mb-4">Is this project open-source? (If yes, share the repository link).</h2>
                                <p className="leading-8 mb-16">{data?.repository}</p>
                                                
                                <h2 className="text-xl  font-bold mb-4">Who are the members of the team?</h2>
                                <p className="leading-8 mb-16">{data?.team}</p>
                                                
                                <h2 className="text-xl  font-bold mb-4">What are the Project Milestones? (Be very specific and write a roadmap highlighting critical deliverables of the project; mention how you will ensure to supervise and track them).</h2>
                                <p className="leading-8 mb-16">{data?.milestones}</p>
                                                
                                <h2 className="text-xl  font-bold mb-4">How do you plan to reach these milestones? (Explain the project feasibility).</h2>
                                <p className="leading-8 mb-12">{data?.reachPlan}</p>

                                <div>
                                    {isApproved ? (
                                        <div>
                                            {requestPeriod && (
                                                <form onSubmit={handleDonation} className="flex flex-col items-center justify-center">
                                                    <div className="flex items-center  gap-2">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Amount" 
                                                            required 
                                                            className='w-[150px] mb-2 h-10 border bg-transparent border rounded-lg  p-2' 
                                                            onChange={(e) => {
                                                            setDonation(e.target.value)
                                                        }}
                                                    />
                                                </div>

                                                <button type="submit" className='w-full m-auto h-10 bg-transparent border rounded-lg font-bold text-white mt-2  max-w-[300px]'>Donate</button>
                                            </form>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <button onClick={handleApproval}>Approve</button>
                                        </div>
                                    )}
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            )}
           
        </div>
    )
}