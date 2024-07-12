"use client"
import { useState } from "react"
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {motion} from "framer-motion";

export default function HeaderModal() {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-8 w-8 transition-transform duration-300 transform ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>

            {isOpen && (
                <motion.div
                    className="absolute flex flex-col gap-12 text-xl items-end p-10 top-35 right-0 w-full h-screen bg-[#191B1F]"
                    initial={{ opacity: 0, y: 0, x: 100 }}
                    animate={{ opacity: 1, y: 0, x: 0}}
                    transition={{ duration: 0.5 }}
                  >
                    <Link href="/request" className="pt-8 flex items-center justify-center font-bold gap-4">
                        <ArrowBackIcon />
                        <p onClick={() => setIsOpen(!isOpen)}>Create Crowdfunding Request</p>
                    </Link>

                    <Link href="/crowdfundings" className="flex items-center justify-center font-bold gap-4">
                        <ArrowBackIcon />
                        <p onClick={() => setIsOpen(!isOpen)}>Explore crowdfundings</p>
                    </Link>

                    <Link href="/grants" className="flex items-center justify-center font-bold gap-4">
                        <ArrowBackIcon />
                        <p onClick={() => setIsOpen(!isOpen)}>Explore grants</p>
                    </Link>
                </motion.div>
            )}
          </div>
    )
}