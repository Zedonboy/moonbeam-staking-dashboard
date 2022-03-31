import React from "react"
import {ApiPromise, WsProvider} from "@polkadot/api"

export default React.createContext<ApiPromise | null>(null)