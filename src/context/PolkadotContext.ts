import React from "react"
import {ApiPromise} from "@polkadot/api"

export default React.createContext<ApiPromise | null>(null)