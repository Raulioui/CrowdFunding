"use client"
import RequestForm from "../../../components/RequestForm"

export default function Page({params}) {
    const {id} = params

    return (
        <div>
            <RequestForm isCrowdfundig={false} pair={id}/>
        </div>
    )
}