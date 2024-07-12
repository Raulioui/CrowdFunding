import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Page() {
    return (
        <div className="w-[90%] xl:w-[70%] m-auto">
            <Link className='relative top-0  md:top-20 ' href={"../request"}>
                <ArrowBackIcon fontSize="large"/>
            </Link >

            <h1 className="text-xl mt-[200px] font-bold mb-2 mt-8">Name</h1>
            <p className="leading-8 mb-12">Ephora</p>

            <h2 className="text-xl font-bold mb-2 mt-8">About</h2>
            <p className="leading-8 mb-12">ephema is a research group focused on unravelling truth in the Ethereum ecosystem.
            Our research expands across a couple of different areas related to scaling, data availability and
            incentive design.
            Specific examples are EIP-4844 (proto-danksharding) and blobspace, based preconfirmations
            and execution tickets, proposer-builder separation and the MEV supply chain.
            We are positioning us as unique knowledge leader for the advancement of the Ethereum
            ecosystem, scalability and rollup/L2 landscape.</p>

            <h2 className="text-xl font-bold mb-2 mt-8">How will you use these funds? Please make a detailed plan for expenditures.</h2>
            <p className="leading-8 mb-12">To conduct the project costs occur. Our project costs are largely driven by personnel costs. The
            team is in place and motivated to start, however living expenses have to be covered. In more
            detail the costs consist of:
            For personnel expenses we have budgeted a total of $172,800 including ancillary wage costs.
            This consists of a total team size of 5.5 FTE (full time equivalent) for a project period of four
            months. This includes in detail: 1.0 FTE Project Lead ($7,500/m), 1.0 FTE Research Lead
            ($7,500/m), 2.0 FTE Senior Software/Blockchain Engineers ($6,000/m per FTE) and 1.5 FTE
            Research Specialists ($6,000/m).
            Further, the project requires technical infrastructure costs of $6,400 for the four months period.
            This includes $3,200 for servers and hosting, $2,400 for technical tooling and an estimate of
            $800 for domains.
            Additionally, for some team members office space is necessary to allow for efficient work and
            collaboration. To keep these expenses at a minimum, when feasible team members will work
            from home. However, we estimate to have a need of four office seats at an estimated full cost of
            $300 per month. This totals to $4,800. Additionally, we estimate that miscellaneous costs of $500
            per month will occur.
            In total this adds up to a total cost of $186,000 for the project.
            </p>

            <h2 className="text-xl font-bold mb-2 mt-8">Which RFP is this proyect covering?</h2>
            <p className="leading-8 mb-12">Open contribution</p>

            <h2 className="text-xl font-bold mb-2 mt-8">Is this project open-source? (If yes, share the repository link).</h2>
            <p className="leading-8 mb-12">Not yet, but planning to open source the technical parts once finalized.
            </p>

            <h2 className="text-xl font-bold mb-2 mt-8">Who are the members of the team?</h2>
            <p className="leading-8 mb-12">Christian Haug - Project & Research Lead
            Pascal Stichler - Project & Research Lead
            Marc Nitzsche - Senior Fullstack Engineer
            Gabriel Fior - Senior Blockchain Engineer
            Nicolas De Luz - Blockchain Engineer
            Jason Chaskin - Researcher
            Advisors:
            Akaki Mamageishvili - Chief Researcher at Offchain Labs (Arbitrum)
            Conor McMenamin - Senior Researcher at Nethermind (Ethereum, PBS, based rollups)
            Kydo - Protocol Designer at Eigenlayer (DA layer, scaling, AVS)
            </p>

            <h2 className="text-xl font-bold mb-2 mt-8">What are the Project Milestones? (Be very specific and write a roadmap highlighting
            critical deliverables of the project; mention how you will ensure to supervise and track
            them).
            </h2>
            <p className="leading-8 mb-12">We will split the main milestones for the project into the following four main deliverables.
            We plan to implement a real-time data transparency dashboard and make it publicly available.
            The dashboard will include the information about transactions on Uniswap and Arbitrum, their
            inclusion into blocks (prospectively blobs). This will give first predictions of future blobspace
            utilization over time. Further other L2s / rollups can be added for more comparative data.
            We will develop a prototype for a blob merging solution. The solution will include the
            functionality outlined above with a specific focus on solving the NP-hard space allocation
            problem and implementing a pareto-efficient pricing mechanism. It will allow different
            consumers of blobspace to combine their requests and have them stored in the blobspace. This
            prototype will be open sourced and publicly available.
            Based on the previously conducted research we will implement a prototype demonstrating that
            it is feasible to implement an economic gas prices discovery mechanism, most likely a futures /
            derivatives market for block / blobspace. The v1 will include the functionality documented
            above. We will build the prototype in a way that it is scalable towards a fully fledged solution in
            the future.
            1.  Uniswap & Arbitrum TX and mempool Data Dashboard:
            1.  Blob Merging Protocol Prototype:
            1.  Gas Prices Discovery Mechanism Prototype:
            We will publish the blog post / white paper on our combined research findings on how the
            blobspace can be best utilized. This will include especially how the blobspace can be most
            efficiently allocated and how the secondary pricing can be done and implemented. We will
            include the findings of our implementations of the prototypes including a thorough analysis of
            its strengths and weaknesses emphasizing on learnings for the future. We aim to as well answer
            the working hypotheses outlined above.
            </p>

            <h2 className="text-xl font-bold mb-2 mt-8">How do you plan to reach these milestones? (Explain the project feasibility).</h2>
            <p className="leading-8 mb-12">To reach the milestones we plan to parallelize the research and implementation phase to
            already benefit from first findings in the implementation that reflect back to the research. As
            common in exploratory research we will work with an hypothesis driven approach to quickly
            gain quantifiable results.
            We have already done extensive knowledge gathering, information aggregation and laid out the
            technical basis for prototypes. Following our philosophy of transparency we have shared the
            most relevant resources online under ephema.io. Furthermore we built-up the relationships
            with the most knowledgeable researchers and developers in the space. We have further defined
            the necessary research hypothesis that we aim to verify or falsify. This will be a continued
            process as we work in an adaptive approach given the fast-paced nature of the field and the
            high level of uncertainty.
            The defined research hypothesis will be the foundation for the data dashboard of milestone 1.
            Defining the key elements of the data dashboard will be the responsibility of the research lead,
            as it will be the foundation for the future research and implementations.
            The prototype for the blob merging is currently in development. We have one research scientist
            giving input on the theoretical side and a software engineer as well as a protocol engineer are
            working on the implementation.
            The gas price futures marketplace is the main responsibility of the second protocol engineer
            together with a part-time research advisor. To ensure a timely delivery the team will receive
            support from the other protocol engineer after the finalization of the first version of the blob
            merging protocol as well as from the research lead.
            The blog post / whitepaper on general findings, blobspace market predictions and price
            discovery will be a joint effort by the research team under the guidance of the research lead. It
            will include the findings from the different research areas as well as the implementations of the
            two prototypes and their ongoing development.
            </p>
        </div>
    )
}