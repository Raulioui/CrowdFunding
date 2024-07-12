import Icon from "./Icon"
import Link from "next/link"
import ConnectButton from "./ConnectButton"
import HeaderModal from "./HeaderModal"

export default function Header() {

    return(
        <div className="m-auto flex md:relative w-full px-16 xl:px-32 fixed top-0 left-0 items-center flex py-8 justify-between backdrop-blur-sm md:backdrop-blur-none border-b">
            <Link href="/request" className="hover:bg-[#232426] duration-100 hidden md:block border-2 border-white py-2 px-6 rounded-lg font-bold">
                Create request
            </Link>
            
            <Link href="/" >
                <Icon />
            </Link>

            <div className="hidden md:block">
                <ConnectButton />
            </div>

            <div className="block md:hidden">
                <HeaderModal />
            </div>
        </div>
    )
}