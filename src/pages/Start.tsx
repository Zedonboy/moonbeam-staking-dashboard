//@ts-nocheck
import { useState, useContext, useEffect } from "react";
import ChainContext from "../context/chainChooser";
import Button from "../components/Button";
import ApiContext from "../context/PolkadotContext";
import { formatBalance } from "@polkadot/util";
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";
import { useRecoilState } from "recoil";
import { web3AccountState } from "../atoms";
import {Link} from 'react-router-dom'

export default function Start() {
  const [candidatePool, setCandidatePool] = useState([]);
  const [collatorAddress, setCollatorAddress] = useState("");
  const [stakeAmt, setStakeAmt] = useState("");
  const chainChooser = useContext(ChainContext);
  const [balance, setBalance] = useState(0);
  const api = useContext(ApiContext);
  const [web3Account, setAccount] = useRecoilState(web3AccountState);

  useEffect(() => {
    const task = async () => {
      console.log(api);
      api?.query?.parachainStaking?.candidatePool((pool) => {
        let nPool = pool?.map((v) => v.toHuman());
        setCandidatePool(nPool);
      });
    };
    task();
  }, [api]);

  useEffect(() => {
    if (!web3Account) setBalance(0);
    else {
      api?.query?.system?.account(
        web3Account.address,
        ({ data: { free: currentFree }, nonce: currentNonce }) => {
          let account = formatBalance(currentFree, { withSi: false }, 18);
          setBalance(parseFloat(account));
        }
      );
    }
  }, [web3Account, api]);

  return (
    <div className="py-4">
      <div className="border-4 border-dashed border-gray-200 rounded-lg">
        <div className="flex py-8 px-4">
          <div className="border border-accent text-accent rounded-md p-8">
            <p className="text-xs">balance</p>
            <p className="text-xl mt-1">{balance}</p>
            <p className="text-sm mt-1">
              {chainChooser.network === "moonbeam" ? "GLMR" : "MOVR"}
            </p>
          </div>
        </div>
        <div className="flex-col space-y-4 flex justify-center items-center p-2 border rounded border-accent">
          <input
            onChange={(e) => setCollatorAddress(e.target.value)}
            className="form-input w-full rounded-md bg-primary text-accent"
            placeholder="Collator Address"
          />
          <input
            onChange={(e) => setStakeAmt(e.target.value)}
            className="form-input w-full rounded-md bg-primary text-accent"
            type="number"
            min={0}
            placeholder="Stake Amount"
          />
          <Button
            disabled={!web3Account}
            onClick={(e) => {
              let task = async () => {
                let info = await api?.query?.parachainStaking?.candidateInfo(
                  collatorAddress
                );
                let count = info?.toHumman()["delegationCount"];
                const yourDelegatorAccount = "YOUR_ADDRESS_HERE";
                const delegatorInfo =
                  await api.query.parachainStaking.delegatorState(
                    yourDelegatorAccount
                  );
                let delegateCount =
                  delegatorInfo.toHuman()["delegations"].length;
                let txn = api?.tx?.parachainStaking?.delegate(
                  collatorAddress,
                  stakeAmt,
                  count,
                  delegateCount
                );

                const injector = await web3FromSource(web3Account.meta.source);
                txn?.signAndSend(
                  web3Account.address,
                  { signer: injector.signer },
                  ({ status }) => {
                    if (status.isInBlock) {
                      // worked.
                    }
                  }
                );
              };

              task();
            }}
          >
            Stake
          </Button>
        </div>

        <div className="p-2">
          <h1 className="text-blue-100 text-3xl">Collators</h1>
          <table class="table-auto w-full">
            <thead>
              <tr className="text-blue-100">
                <th>Collator address</th>
                <th>Staked Amount</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {
                candidatePool?.map(v => (
                  <tr>
                  <td className="text-blue-500">
                    <Link to={`/collator/${v?.owner}`}>
                    {v?.owner}</Link></td>
                  <td className="text-green-500 text-xs">{(function () {
                  let a = v.amount.replace(/\,/g, "");
                  return formatBalance(
                    a,
                    {
                      withSi: false,
                    },
                    18
                  );
                })()}</td>
                  <td>
                  <button className="text-blue-400 text-sm">Copy</button>
                  </td>
                </tr>
                ))
              }
             
            </tbody>
          </table>
          {/* {candidatePool?.map((v) => (
            <div className="flex justify-between">
              <div className="overflow-clip">
                <a className="text-blue-500">{v?.owner}</a>
              </div>
              <div className="text-green-500 text-xs">
                {(function () {
                  let a = v.amount.replace(/\,/g, "");
                  return formatBalance(
                    a,
                    {
                      withSi: false,
                    },
                    18
                  );
                })()}
              </div>
              <div>
                <button className="text-blue-400">Copy</button>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}
