import Link from "next/link";
import Image from "next/image";
import Footer from "./components/Footer";

export default function Home() {

  return (
    <main className="text-sm">      
        <section className="mt-[100px] lg:mt-40 lg:flex items-center justify-center gap-[200px]">
          <div className=""> 
            <h1 className="text-5xl lg:text-7xl font-bold  text-center mb-[80px]">Your home for help</h1>
          </div>

          <div className="flex m-auto text-center md:text-left lg:m-0 flex-col lg:gap-28 gap-8 max-w-[400px] w-[50%]">
            <div className="mb-[80px]">
              <h2 className="text-2xl font-bold mb-2">Get funding & grow your ecosystem</h2>
              <p className="mb-8">Participate in our quadratic funding program for open-source & impact-oriented proyects</p>
              <Link href="/grants" className="bg-[#232426] py-2 px-6 rounded-xl font-bold">Explore grants</Link>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Launch your own crowdfunding</h2>
              <p className="mb-8">Easily manage your on-chain decentralized crowdfunding</p>
              <Link href="/crowdfundings" className="bg-[#232426] py-2 px-6 rounded-xl font-bold">Crowdfundings</Link>
            </div>
          </div>
        </section>

        <section className="mt-16 px-4 md:px-0 bg-[#222426]">
          <h2 className="text-4xl md:text-5xl font-bold pt-20 text-center">Quadratic funding</h2>

          <div className="flex flex-col xl:flex-row items-center justify-around gap-16 pt-16 xl:mb-16">
            <div>
                <div className="max-w-[600px] mt-8 text-base">
                  <p className="my-4">
                    A matching pool is a pool of money that is provided by the matching partners.
                    Matching partners are companies, individuals or even protocols supporting public goods projects. 
                  </p>
                  <p className="mb-4">
                    The funds collected in the matching pool are used to magnify the individual contributions to different projects. 
                  </p>
                  <p>
                    To understand the concept of quadratic funding better, let’s go through a quick example. 
                  </p>
                </div>
            </div>

              
            <div className="pb-12 md:pb-0">
              <Image src="/MatchingPool.png" height={800} width={500}/>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-around gap-16 pb-20">
            
            <div className="pb-12 md:pb-0">
              <Image src="/Formula.png" height={800} width={500}/>
              <p className="text-center">Formula of the quadratic funding</p>
            </div>

            <div className="max-w-[600px]  text-base mt-16">
              <p className="mb-8 text-lg">
                Imagine that we have $10,000 in a matching pool that was provided by our matching
                partners and we have 3 projects participating in a funding round. 
              </p>
          
              <ul>
                  <li className="mb-6">
                    Project A got $1,000 in funding from 5 contributors ($200 each).
                  </li>
                  <li className="mb-6">
                    Project B also received $1,000 but from 2 contributors ($500 each).
                  </li>
                  <li>
                    Project C received the same amount – $1,000 – from 20 contributors ($50 each). 
                  </li>
              </ul>          
            </div>
          </div>
        </section>

        <Footer />
    </main>
  );
}
