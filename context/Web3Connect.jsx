import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MetaMaskContext = createContext();

export const MetaMaskProvider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [address, setAddress] = useState("");
    const [signer, setSigner] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [alchemyProvider, setAlchemyProvider] = useState(null);   
    const [isConnectedToSepolia, setIsConnectedToSepolia] = useState(false)

    const connect = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            const alchemyProvider = new ethers.JsonRpcProvider("https://arb-sepolia.g.alchemy.com/v2/-qVqxEJQ4_RaXuaz7iEZckBmQ9t1rnHk");

            const browserProvider = new ethers.BrowserProvider(window.ethereum);

            // Check if user is connected to Arbitrum Sepolia
            const network = await browserProvider.getNetwork();
            if (network.chainId !== 421614) { // Arbitrum Sepolia chainId
                try {
                    // Request to switch to Arbitrum Sepolia
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x66eee' }] // Arbitrum Sepolia chainId in hex
                    });

                    setIsConnectedToSepolia(true)
                } catch (error) {
                    if (error.code === 4902) {
                        console.error("Arbitrum Sepolia network is not available in your wallet");
                    } else {
                        console.error("Failed to switch network:", error.message);
                    }
                    return;
                }
            }

            setProvider(browserProvider);
            const signer = await browserProvider.getSigner();
            const address = await signer.getAddress()

            setSigner(signer);
            setAddress(address);
            setIsConnected(true)
            setAlchemyProvider(alchemyProvider);
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
                    const alchemyProvider = new ethers.JsonRpcProvider("https://arb-sepolia.g.alchemy.com/v2/-qVqxEJQ4_RaXuaz7iEZckBmQ9t1rnHk");

                    const browserProvider = new ethers.BrowserProvider(window.ethereum);

                    // Check if user is connected to Arbitrum Sepolia
                    const network = await browserProvider.getNetwork();
                    if (network.chainId !== 421614) { // Arbitrum Sepolia chainId
                        try {
                            // Request to switch to Arbitrum Sepolia
                            await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: '0x66eee' }] // Arbitrum Sepolia chainId in hex
                            });

                            setIsConnectedToSepolia(true)
                        } catch (error) {
                            if (error.code === 4902) {
                                console.error("Arbitrum Sepolia network is not available in your wallet");
                            } else {
                                console.error("Failed to switch network:", error.message);
                            }
                            return;
                        }
                    }

                    setProvider(browserProvider);
                    const signer = await browserProvider.getSigner();
                  
                    const address = await signer.getAddress()
            
                    setSigner(signer);
                    setAddress(address);
                    setIsConnected(true)
                    setAlchemyProvider(alchemyProvider);
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
        <MetaMaskContext.Provider value={{ provider, connect, disconnect, address, isConnected, signer, alchemyProvider, isConnectedToSepolia}}>
            {children}
        </MetaMaskContext.Provider>
    );
};

export const useMetaMask = () => {
    return useContext(MetaMaskContext);
};