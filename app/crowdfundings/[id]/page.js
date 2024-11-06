"use client"
import { useEffect, useState } from "react";
import bs58 from 'bs58'
import Image from "next/image";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import crowdfundingAbi from "../../../utils/Crowdfunding.json"
import quequeAbi from "../../../utils/Queque.json"
import { useNotification } from '@web3uikit/core'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Loader from "../../components/Loader"
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { ethers } from 'ethers'
import { useMetaMask } from "../../../context/Web3Connect";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function CustomTabPanel(props) {
    const { children, value, index } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && (
          <Box  sx={{ p: 3}}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

export default function page({params}) {
    const {id} = params
    const [loading, setLoading] = useState(true)
    const [crowdfunding, setCrowdfunding] = useState({})
    const [data, setData] = useState({})
    const [donations, setDonations] = useState([])
    const [donation, setDonation] = useState(0)
    const [date, setDate] = useState()
    const [crowdfundingCompleted, setCrowdfundingCompleted] = useState(false)

    const [balance, setBalance] = useState(0)
    const [target, setTarget] = useState(0)
    const [owner, setOwner] = useState()
    const { address, signer, alchemyProvider } = useMetaMask()

    const [userDonations, setUserDonations] = useState(0)

    const dispatch = useNotification()

    const [message, setMessage] = useState("")
    const [value, setValue] = useState(0);
    
    async function retrieveData() {
       const hash = id.slice(0, -3)
       const hashHex = "1220" + hash.slice(2)
       const hashBytes = Buffer.from(hashHex, 'hex');
       const hashStr = bs58.encode(hashBytes)
       const res = await fetch(`https://ipfs.io/ipfs/${hashStr}`)
       const data = await res.json(); 

       const contract = new ethers.Contract("0x1c5fc443B990002d34d7711Ddcc3C436C9219826", quequeAbi, alchemyProvider);
        
       const filter = contract.filters.ProyectExecuted()
       const events = await contract.queryFilter(filter)
     
       const crowdfunding = events.find((r) => r?.args[4] === hash)
       setCrowdfunding(crowdfunding)
      
       const contractPair = new ethers.Contract(crowdfunding?.args.pair, crowdfundingAbi, alchemyProvider)
   
       const userDonations = await contractPair.donations((signer.address))
       setUserDonations(Math.round(Number(userDonations)))  
 
       const owner = await contractPair.owner()
       setOwner(owner)
   
        const filterDonations = contractPair.filters.Donation()
        const event = await contractPair.queryFilter(filterDonations)
        setDonations(event) 

        const isCompleted = await contractPair.isCompleted()
        setCrowdfundingCompleted(isCompleted)

        const balance = await alchemyProvider.getBalance(crowdfunding?.args[1])
        setBalance(Number(ethers.formatEther(balance)))
       
        const date = new Date(Number(crowdfunding.args[3]) * 1000)
        setTarget(ethers.formatEther(crowdfunding.args[2]))
        setDate(date.toDateString())
        setData(data)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

   async function handleDonation(e) {
        e.preventDefault()
        setLoading(true)
        const contract = new ethers.Contract(crowdfunding?.args[1], crowdfundingAbi, signer);
    
        const tx = await contract.donate(message, {value: ethers.parseEther(donation.toString())})    
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "Donation completed",
                title: "Completed",
                position: "topR",
            })
        } else {
            throw new Error("Failed donation")
        }   
        setLoading(false)
    }

    async function handleWithdraw(e) {
        e.preventDefault()
        setLoading(true)
        const contract = new ethers.Contract(crowdfunding?.args[1], crowdfundingAbi, signer);
        
        const tx = await contract.withdrawUser()
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "Withdraw completed",
                title: "Withdrawed",
                position: "topR",
            })
        } else {
            throw new Error("Failed withdrawal")
        }
        setLoading(false)
    }

    async function handleWithdrawOwner(e) {
        e.preventDefault()
        setLoading(true)
        const contract = new ethers.Contract(crowdfunding?.args[1], crowdfundingAbi, signer);
        
        const tx = await contract.withdrawOwner()
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "Withdraw completed",
                title: "Withdrawed",
                position: "topR",
            })
        } else {
            throw new Error("Failed withdrawal")
        }
        setLoading(false)
    }

    useEffect(() => {
        retrieveData();
        setLoading(false)
    },[alchemyProvider])

    return(
        <div>
            {loading ? (<Loader />) : (
                <div>
                    <div className="w-[90%] xl:w-[70%] m-auto   h-[100px] md:h-[150px] xl:h-[200px] mt-12">
                        <Link href={"/crowdfundings"}>
                            <ArrowBackIcon fontSize="large"/>
                        </Link >
                        <div className="flex justify-between items-center my-24 ">
                            <div>
                                <Image 
                                    src={`https://ipfs.io/ipfs/${data?.iconCid}`}
                                    width={150}
                                    height={150}
                                    className="rounded-full"
                                />  
                                <h1 className="text-4xl lg:text-5xl font-bold mt-8">{data?.name}</h1>
                            </div>
                            <div className="flex flex-col justify-center gap-8 items-start">
                                <div className="flex items-center justify-center gap-2">
                                    <CalendarMonthIcon />
                                    <p className="font-bold">{date}</p>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <AccountCircleIcon />
                                    <p className="font-bold">{owner}</p>
                                </div>

                                {crowdfundingCompleted ? (
                                    <div className="border my-8 w-full rounded-xl flex flex-col items-center justify-center">
                                        <p className="my-4">Crowdfunding completed</p>
                                        <p className="mb-4">target collected</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Image src="/icons8-ethereum-50.png" height={25} width={25}/> 
                                        <p className="font-bold">Ethers collected: {balance} / {target}</p> 
                                    </div>
                                )}
                            </div>
                        </div>

                        <Box>
                            <Tabs textColor="white" indicatorColor="primary" value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Crowdfunding" className="text-xs md:text-sm "/>
                                <Tab label="Donations" className="text-xs md:text-sm" />
                                <Tab label="Manage funds" className="text-xs md:text-sm" />
                            </Tabs>
                        </Box>

                        <CustomTabPanel value={value} index={0}>
  
                            <h2 className="text-xl font-bold mb-2 mt-8">About</h2>
                            <p className="leading-8 mb-12">{data?.about}</p>
                                                       
                            <h2 className="text-xl font-bold mb-2">How will you use these funds? Please make a detailed plan for expenditures.</h2>
                            <p className="leading-8 mb-12">{data?.useOfFunds}</p>
                            
                            <h2 className="text-xl font-bold mb-2">Which RFP is this project covering?</h2>
                            <p className="leading-8 mb-12">{data?.rfp}</p>
                            
                            <h2 className="text-xl font-bold mb-2">Is this project open-source? (If yes, share the repository link).</h2>
                            <p className="leading-8 mb-12">{data?.repository}</p>
                            
                            <h2 className="text-xl font-bold mb-2">Who are the members of the team?</h2>
                            <p className="leading-8 mb-12">{data?.team}</p>
                            
                            <h2 className="text-xl font-bold mb-2">What are the Project Milestones? (Be very specific and write a roadmap highlighting critical deliverables of the project; mention how you will ensure to supervise and track them).</h2>
                            <p className="leading-8 mb-12">{data?.milestones}</p>
                            
                            <h2 className="text-xl font-bold mb-2">How do you plan to reach these milestones? (Explain the project feasibility).</h2>
                            <p className="leading-8">{data?.reachPlan}</p>
                        
                        </CustomTabPanel> 
 
                        <CustomTabPanel value={value} index={1}>
                            <div className="mt-12">
                                {donations.length == 0 ? (
                                    <p>No donations yet</p>
                                ) : (
                                    <div>
                                        {donations?.map((d) => {
                                            return (
                                                <div key={d?.args[1]} className='flex-col md:flex-row md:flex  gap-8 mb-24 text-center'>
                                                    <Jazzicon diameter={50} seed={jsNumberForAddress(d?.args[0])} />
                                                    <div className='flex flex-col gap-2 text-center'>
                                                        <p>{d?.args[0]}<span className="ml-4 mr-1">{ethers.formatEther(d?.args[2])}</span>ethers</p>
                                                        <p className="text-left">{d?.args[1]}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </CustomTabPanel>  

                        <CustomTabPanel value={value} index={2}>
                            {crowdfundingCompleted ? (
                                <p>Crowdfunding completed</p>
                            ) : (
                                <form className='pb-20' onSubmit={handleDonation}>
                                     {userDonations.length == 0 ? (
                                        <p>No donations</p>
                                    ) : (
                                        <div>
                                            <div className="flex flex-col justify-center items-center  text-center">
                                                <p className="text-xl font-bold my-8">Amount donated: {Number(ethers.formatEther(userDonations.toString()))} ether</p>

                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Amount" 
                                                        required 
                                                        className='w-[150px] mb-2 h-10 border bg-transparent border rounded-lg  p-2' 
                                                        onChange={(e) => {
                                                            setDonation(Number(e.target.value))
                                                        }}
                                                    />
                                                    <input type="text" onChange={(e) => setMessage(e.target.value)} placeholder="Message" required className='bg-transparent w-[150px] mb-2 h-10 border rounded-lg  p-2'/>
                                                </div>

                                                <button type="submit" className='w-full m-auto h-10 bg-transparent border rounded-lg font-bold text-white mt-2  max-w-[300px]'>Donate</button>
                                                <button  type="button" onClick={handleWithdraw} className='w-full mt-8 h-10 bg-transpraent border font-bold rounded-lg max-w-[300px] text-white'>Withdraw (5% fee)</button>
                                                {address == owner && (
                                                    <button className="absolute  m-4 md:m-12 xl:m-16 bottom-0 right-0 w-full mt-6 h-10 bg-transpraent border font-bold rounded-lg max-w-[200px] text-white" onClick={handleWithdrawOwner}>
                                                        Withdraw (owner)
                                                    </button>
                                                )}
                                            </div> 
                                        </div>                                       
                                    )}
                                </form>
                            )}
                        </CustomTabPanel>
                    </div>
                </div>
            )}
        </div>
    )
}