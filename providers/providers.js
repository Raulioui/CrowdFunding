"use client"
import { NotificationProvider } from "@web3uikit/core";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {MetaMaskProvider} from "../context/Web3Connect";

export function Providers({children}) {
    const theme = createTheme({
        palette: {
            primary: {
                main: "#26C06A" 
            },
            mode: 'dark',
        }
    });

    return(
        <NotificationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={theme}>
                    <MetaMaskProvider>
                        {children}  
                    </MetaMaskProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </NotificationProvider>
    )
}