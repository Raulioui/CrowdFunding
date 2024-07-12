import Link from 'next/link'
import CrowdfundingsDisplay from '../components/CrowdfundingsDisplay'
import Footer from '../components/Footer'
import ButtonsDisplay from '../components/ButtonsDisplay'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Crowdfundings() {

    const buttonsArray = [
        {
            text: "Make a request",
            link: "/request"
        },
        {
            text: "View queque",
            link: "/crowdfundings/queque"
        }
    ]

    return(
        <div>
            <div className="px-8 mt-20 flex items-center justify-between mb-16 w-[95%] lg:w-[65%] m-auto">
                    <Link className="" href={"/"}>
                        <ArrowBackIcon fontSize="large"/>
                    </Link>

                    <ButtonsDisplay buttons={buttonsArray}/>
            </div>

            <h2 className='text-4xl lg:leading-normal lg:text-6xl max-w-[500px] lg:max-w-[800px] font-bold m-auto text-center my-16'>Fund the best Web3 proyects in the blockchain ecosystem</h2>

            <CrowdfundingsDisplay />

            <Footer />

        </div>
    )
}