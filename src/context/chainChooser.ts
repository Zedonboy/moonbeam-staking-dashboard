import React from "react"

export enum Network {
    MOONBEAM = "moonbeam",
    MOONRIVER = "moonriver",
    MOON_ALPHA = "moon_alpha"
}
export interface IChainChoser {
    network : Network
    moonbeam : () => void
    moonriver : () =>  void
    moonalpha : () => void
}
export default  React.createContext<IChainChoser | null>(null)