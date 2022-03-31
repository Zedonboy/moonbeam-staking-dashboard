import {atom} from "recoil"

export const web3AccountState = atom({
    key: 'web3Account', // unique ID (with respect to other atoms/selectors)
    default: null, // default value (aka initial value)
});