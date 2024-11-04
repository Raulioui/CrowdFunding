import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers';

const MetaMaskContext = createContext();

export const MetaMaskProvider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [address, setAddress] = useState("");
    const [signer, setSigner] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            const browserProvider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/-qVqxEJQ4_RaXuaz7iEZckBmQ9t1rnHk");
            setProvider(browserProvider);
            const signer = await browserProvider.getSigner();
            const address = await signer.getAddress()
            setAddress(address);
            setSigner(signer);
            setIsConnected(true);
        } else {
            console.error("Please install MetaMask!");
        }
    }

    const disconnect = () => {
        setProvider(null);
        setSigner(null);
        setAddress(null);
        setIsConnected(false);
    }

    useEffect(() => {
        const connectMetaMask = async () => {
            if (typeof window !== "undefined" && window.ethereum) {
                try {
                    const browserProvider = new ethers.BrowserProvider(window.ethereum);
                    setProvider(browserProvider);
                    const signer = await browserProvider.getSigner();
                    const address = await signer.getAddress()
                    setSigner(signer);
                    setAddress(address);
                    setIsConnected(true)
                } catch (error) {
                    console.error("Failed to connect to MetaMask:", error);
                }
            } else {
                console.error("Please install MetaMask!");
            }
        };
        connectMetaMask();
    }, []);

    return (
        <MetaMaskContext.Provider value={{ provider, connect, disconnect, address, isConnected, signer}}>
            {children}
        </MetaMaskContext.Provider>
    );
};

export const useMetaMask = () => {
    return useContext(MetaMaskContext);
};