import Link from 'next/link'
import RequestForm from "../components/RequestForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Page() {

    return(
        <div>
            <Link className='relative top-0 left-8 md:top-20 md:left-20' href={"/"}>
                <ArrowBackIcon fontSize="large"/>
            </Link >

            <div className="text-center mt-8 md:mt-36">
                <h2 className="mb-6 text-4xl lg:text-5xl font-bold font bold">Let's begin your fundraising jounery!</h2>
                <p className="mb-8 text-lg">We're here to guide you every step of the way.</p>
                    
                <p>Cost of the request: 0.1 ether</p>
                <Link  href={'./request/example'}  className="font-bold underline texl-xl mt-8">View use example</Link>
            </div>

            <RequestForm isCrowdfundig={true}/>
            
        </div>
    )
}