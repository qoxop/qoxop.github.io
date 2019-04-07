import {connect} from 'react-redux'
import React from 'react'
interface Iprop {
    aaa: number
    bbb: string
}

const Comp = (props: Iprop) => {
    return <div>{props.toString()}</div>
}
const CComp: (props: Iprop) => JSX.Element = connect<Iprop>()(Comp)

var a = <CComp aaa bbb></CComp>