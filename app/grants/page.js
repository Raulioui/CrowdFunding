import GrantsDisplay from "../components/GrantsDisplay"
import Link from "next/link"
import Footer from "../components/Footer"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function grants() {

    return(
        <div className="w-[95%]  m-auto h-screen">
            <Link className="relative top-0 left-8 md:top-20 md:left-20" href={"/"}>
                <ArrowBackIcon fontSize="large"/>
            </Link>

            <div className="p-16 mt-[60px]">
                <h2 className="text-4xl lg:text-5xl text-center font-bold">Grants Program</h2>
            </div>

            <GrantsDisplay />
            
            <Footer />
        </div>
    )
}   