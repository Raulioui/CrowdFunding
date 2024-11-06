"use client"
import Loader from "../components/Loader";
import { useState, useEffect } from "react"
import { useNotification } from '@web3uikit/core';
import { ethers } from "ethers";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import quequeAbi from "../../utils/Queque.json"
import {Input} from "@web3uikit/core"
import { useRouter } from 'next/navigation'
import multihashes from 'multihashes';
import { useMetaMask } from "../../context/Web3Connect";
import {Step, Stepper} from '@chakra-ui/react'
import CheckIcon from '@mui/icons-material/Check';
import grantAbi from "../../utils/Grant.json"

export default function RequestForm({isCrowdfundig, pair}) {
    const [name, setName] = useState("")
    const [about, setAbout] = useState("")
    const [useOfFunds, setUseOfFunds] = useState("") 
    const [rfp, setRfp] = useState("") 
    const [repository, setRepository] = useState("") 
    const [team, setTeam] = useState("") 
    const [milestones, setMilestones] = useState("") 
    const [reachPlan, setReachPlans] = useState("") 
    const [cid, setCid] = useState("");
    const [target, setTarget] = useState(0)
    const [date, setDate] = useState(null)
    const [conversion, setConversion] = useState(0)
    const [eth, setEth] = useState(0)
    const [isFileUploading, setIsFileUploading] = useState(false)
    const [isFileUploaded, setIsFileUploaded] = useState(false)

    const [loading, setLoading] = useState(true);
    const dispatch = useNotification()
    const router = useRouter()

    const {alchemyProvider, signer} = useMetaMask()
    const [step, setStep] = useState(1);
  
    const handleNextStep = () => {
      if (step < 12) setStep(step + 1);
    };
  
    const handlePrevStep = () => {
      if (step > 1) setStep(step - 1);
    };

    function fromDolToEth(dol) {
		setEth(dol * conversion)
	}

    const handleChange = (e) => {
        setIsFileUploading(true)
        uploadFile(e.target.files[0]);
    };

    const createRequestCrowdfunding = async (cid) => {
        setLoading(true)
        const contract = new ethers.Contract("0x1c5fc443B990002d34d7711Ddcc3C436C9219826", quequeAbi, signer);
        const _date = new Date(date)
		const  timeLimit = Math.floor(_date.getTime() / 1000);
		const _target = target * 1000000000
     
        const tx = await contract.createRequest(cid, _target, timeLimit, {value: ethers.parseEther("0.1")})
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "Crowdfunding created",
                title: "Created",
                position: "topR",
            })
            router.push("/")
        } else {
            throw new Error("Failed creating the crowdfunding")
        } 
        setLoading(false)
    }

    const createRequestGrant = async (cid) => {
        setLoading(true)
        const contract = new ethers.Contract(pair, grantAbi, signer);
        
        const tx = await contract.sendProyectRequest(cid, {value: ethers.parseEther("0.1")})
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "Request submited",
                title: "",
                position: "topR",
            })
        } else {
            throw new Error("Failed creating the crowdfunding")
        }
        setLoading(false)
    }

    function getBytes32FromIpfsHash(ipfsListing) {
        const decoded = multihashes.decode(multihashes.fromB58String(ipfsListing));
    
        if (decoded.digest.length !== 32) {
            throw new Error('Invalid CID');
        }
        
        const bytes32Hex = '0x' + Buffer.from(decoded.digest).toString('hex');

        if(isCrowdfundig) {
            createRequestCrowdfunding(bytes32Hex)
        } else {
            createRequestGrant(bytes32Hex)
        }
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                method: "POST",
                headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZmY2ZmNlNC04ZmUzLTQ5MjYtYTNiMS0yZTE2YTU0NDBjYjgiLCJlbWFpbCI6InJhdWxtdWVsYW1vcmV5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmOWRhNzE1MGJmN2YwYTIyNzhkOSIsInNjb3BlZEtleVNlY3JldCI6IjNkNGEzOTlhN2M5YmRjZDEzMGQwODVkYTZiOTIxMjEwYmZhMWJjMmJkYmNiMzNlMTU1ZjIzZTMzNDYwNzI1YzUiLCJpYXQiOjE3MDg1MDUzOTN9.K1BJWGJhEUhZt5Nqm80u3cHP5lfln1QxnEZQJarJ2O8', 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: name,
                    about: about,
                    useOfFunds: useOfFunds,
                    rfp: rfp,
                    repository: repository,
                    team: team,
                    milestones: milestones,
                    reachPlan: reachPlan,
                    iconCid: cid
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

    const steps = [
        {
            title: "Title",
            description: 'Title of the proyect',
            setter: function (value) {
                setName(value)
            }
        },
        {
            title: "About",
            description: 'About the proyect',
            setter: function (value) {
                setAbout(value)
            }
        },
        {
            title: "UOF",
            description: 'How will you use these funds? Please make a detailed plan for expenditures',
            setter: function (value) {
                setUseOfFunds(value)
            }
        },
        {
            title: "RFP",
            description: 'Which RFP is this project covering?',
            setter: function (value) {
                setRfp(value)
            }
        },
        {
            title: "Repository",
            description: 'Is this project open-source? (If yes, share the repository link)',
            setter: function (value) {
                setRepository(value)
            }
        },
        {
            title: "Team",
            description: 'Who is your team? (Please provide details of the team members and their roles)',
            setter: function (value) {
                setTeam(value)
            }
        },
        {
            title: "Milestones",
            description: 'What are the Project Milestones? (Be very specific and write a roadmap highlighting critical deliverables of the project; mention how you will ensure to supervise and track them)',
            setter: function (value) {
                setMilestones(value)
            }
        },
        {
            title: "ReachPlan",
            description: 'How do you plan to reach these milestones? (Explain the project feasibility)',
            setter: function (value) {
                setReachPlans(value)
            }
        },
    ];

    const requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

    const uploadFile = async (file) => {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZmY2ZmNlNC04ZmUzLTQ5MjYtYTNiMS0yZTE2YTU0NDBjYjgiLCJlbWFpbCI6InJhdWxtdWVsYW1vcmV5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmOWRhNzE1MGJmN2YwYTIyNzhkOSIsInNjb3BlZEtleVNlY3JldCI6IjNkNGEzOTlhN2M5YmRjZDEzMGQwODVkYTZiOTIxMjEwYmZhMWJjMmJkYmNiMzNlMTU1ZjIzZTMzNDYwNzI1YzUiLCJpYXQiOjE3MDg1MDUzOTN9.K1BJWGJhEUhZt5Nqm80u3cHP5lfln1QxnEZQJarJ2O8`,
                    },
                    body: formData,
                });
                  const resData = await res.json();
                  setCid(resData.IpfsHash);
                  dispatch({
                    type: "success",
                    message: "File uploaded to IPFS",
                    title: "Created",
                    position: "topR",
                    })
                    setIsFileUploaded(true)
            } catch (error) {
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
            setIsFileUploading(false)
    };

    useEffect(() => {
        fetch("https://api.coincap.io/v2/assets/ethereum", requestOptions)
          .then(res => res.json())
          .then(dat => setConversion(dat?.data.priceUsd))
        setLoading(false)
    },[alchemyProvider])

    if(loading) return <Loader />

    return(
        <>
        <form onSubmit={handleSubmit} className={`${!isCrowdfundig && "mt-44"} mb-20 px-8 md:p-0`}>      
            <Stepper activeStep={step} className="flex items-center justify-center text-center mt-16">
                <div>    
                    {steps.map((st, index) => {
                        return (
                            <Step>
                                <div
                                    className={`step-content ${step == index + 1 ? "block" : "hidden"}`}
                                >
                                    <div>
                                        <p className="text-4xl font-bold underline">{index + 1}</p>
                                        <h2>{st.title}</h2>
                                        <p className="mt-2">{st.description}</p>
                                    </div>
                                    <div>
                                        <input type="text" required onChange={(e) => steps[index].setter(e.target.value)} 
                                            className="focus:outline-none focus:border-[#26C06A] mt-8 px-4 hover:border-[#26C06A] duration-500  bg-transparent border-[#303030] border-[1px] flex justify-between items-center w-[200px] md:w-[400px] xl:w-[500px] m-auto rounded-full py-2"
                                        />
                                    </div>
                                </div>
                            </Step>
                        )
                    })}
                        <Step>
                            {isFileUploaded ? (
                                <div className={`step-content ${step == 9 ? "block" : 'hidden'} `}>
                                    <div>
                                        <p className="text-4xl font-bold underline">{step}</p>
                                        <p className="mt-2">Icon of the project:</p>
                                    </div>
                                <div class="flex flex-col relative items-center justify-center px-4 py-8 font-sans w-full md:w-[50%] m-auto mt-8">
                                    <label for="dropzone-file" class="absolute top-0 left-0 cursor-pointer flex w-full flex-col items-center rounded-xl border-2 border-dashed border-[#26C06A]  p-6 h-full text-center"/>
                                      
                                        <CheckIcon className="h-10 w-10 text-green-500" />
                                        <p class="mt-2 px-20 font-bold text-white tracking-wide">Uploaded</p>          
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {isFileUploading ? <Loader /> : (
                                        <div className={`step-content ${step == 9 ? "block" : 'hidden'} `}>
                                            <div>
                                                <p className="text-4xl font-bold underline">{step}</p>
                                                <p className="mt-2">Icon of the project:</p>
                                            </div>
                                            <div class="flex flex-col relative items-center justify-center px-4 py-8 font-sans w-full md:w-[50%] m-auto mt-8">
                                                <label for="dropzone-file" class="absolute top-0 left-0 cursor-pointer flex w-full flex-col items-center rounded-xl border-2 border-dashed border-blue-400  p-6 h-full text-center"/>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-500" fill="none" viewdiv="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
        
                                                <h2 class="mt-1 text-xl font-medium text-gray-700 tracking-wide">Icon</h2>
        
                                                <p class="mt-2 text-white tracking-wide">Upload or darg & drop your file SVG, PNG, JPG. </p>
        
                                                <input onChange={handleChange} required id="dropzone-file" type="file" class="hidden" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                )}
                        </Step>

                        {isCrowdfundig && (
                            <div>
                                <Step>
                                    <div className={`step-content ${step == 10 ? "block" : 'hidden'} `}>
                                        <div className="mb-8">
                                            <p className="text-4xl font-bold underline">{step}</p>
                                            <p className="mt-2">Finish date of the crowdfunding</p>
                                        </div>
                                        <DemoContainer components={['DateCalendar']}>
                                            <DemoItem label="Select the time limit">
                                                <DateCalendar disablePast={true} value={date} onChange={(newValue) => setDate(newValue)} />
                                            </DemoItem>
                                        </DemoContainer>
                                    </div>
                                </Step>

                                <Step>
                                    <div className={`step-content ${step == 11 ? "block" : 'hidden'}`}>
                                        <div className="mb-8">
                                            <p className="text-4xl font-bold underline">{step}</p>
                                            <p className="mt-2">Target</p>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                                            <Input
                                                onChange={(e) => {
                                                    fromDolToEth(e.target.value)
                                                    setTarget(Number(e.target.value))
                                                }}
                                                    placeholder="Eth"
                                                    type="number"
                                                    required
                                                /> 
                                            <p>{eth}</p>
                                        </div>

                                    </div> 
                                </Step> 
                            </div>
                        )}
                </div>
            </Stepper>
        </form>

        <div>
            {isCrowdfundig ? (
                <div>
                    {step > 1 && <button className="block mx-auto mb-16 md:absolute bottom-0 hover:bg-[#232426] md:m-16 duration-100 xl:m-20 border-2 border-[#232426] hover:cursor-pointer  rounded-2xl py-3 px-8" onClick={handlePrevStep}>Previous</button>}
                    {step < 11 && <button className="block mx-auto md:absolute bottom-0 right-0 md:m-16 hover:bg-[#232426] duration-100 xl:m-20 border-2 border-[#232426] hover:cursor-pointer  rounded-2xl py-3 px-8" onClick={handleNextStep}>Next</button>}
                    {step == 11 && <button className="block mx-auto md:absolute bottom-0 right-0 md:m-16 hover:bg-[#232426] duration-100 xl:m-20 border-2 border-white hover:cursor-pointer rounded-2xl py-3 px-8" onClick={handleSubmit}>FInish</button>}
                </div>
            ) : (
                <div>
                    {step > 1 && <button className="block mx-auto mb-16 md:absolute bottom-0 hover:bg-[#232426] md:m-16 duration-100 xl:m-20 border-2 border-[#232426] hover:cursor-pointer  rounded-2xl py-3 px-8" onClick={handlePrevStep}>Previous</button>}
                    {step < 9 && <button className="block mx-auto md:absolute bottom-0 right-0 md:m-16 hover:bg-[#232426] duration-100 xl:m-20 border-2 border-[#232426] hover:cursor-pointer  rounded-2xl py-3 px-8" onClick={handleNextStep}>Next</button>}
                    {step == 9 && <button className="block mx-auto md:absolute bottom-0 right-0 md:m-16 hover:bg-[#232426] duration-100 xl:m-20 border-2 border-white hover:cursor-pointer rounded-2xl py-3 px-8" onClick={handleSubmit}>FInish</button>}
                </div>
            )}
        </div>

        </>
    )
}