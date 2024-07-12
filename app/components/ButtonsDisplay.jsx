"use client"
import Link from "next/link"
import Menu from '@mui/material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";
import grantAbi from "../../utils/Grant.json"
import { useMetaMask } from "../../context/Web3Connect";
import { useNotification } from "@web3uikit/core"
import { ethers } from "ethers"

export default function ButtonsDisplay({buttons, id, status}) {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { signer } = useMetaMask()
    const dispatch = useNotification()

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const endRequestPeriod = async () => {
        const contract = new ethers.Contract(id, grantAbi, signer);
        
        const tx = await contract.endRequestPeriod()
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "",
                title: "Request period ended",
                position: "topR",
            })
      
        } else {
            throw new Error("Failed")
        } 

    }

    const endFundingPeriod = async () => {
        const contract = new ethers.Contract(id, grantAbi, signer)
        
        const tx = await contract.distributeFunds()
        await tx.wait(1)
        if(tx) {
            dispatch({
                type: "success",
                message: "",
                title: "Funding period ended",
                position: "topR",
            })
    
        } else {
            throw new Error("Failed")
        }
      
    }

    return (
        <div className="text-center">
            <MoreHorizIcon onClick={handleClick} className="hover:bg-[#232426] mb-4 rounded-md hover:cursor-pointer" fontSize="large"/>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                className="px-2"
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >

                {buttons.map((b) => {
                    return (
                        <MenuItem onClick={handleClose}>
                            <Link href={b.link}>
                                {b.text}
                            </Link>
                        </MenuItem>
                    )
                })}

                {status == 0 && (
                    <MenuItem onClick={endRequestPeriod}>
                        End request period
                    </MenuItem>
                
                )}

                {status == 1 && (
                    <MenuItem onClick={endFundingPeriod}>
                        End funding period
                    </MenuItem>
                )}
            </Menu>
        </div>
    )
}