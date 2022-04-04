import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatBalance } from "@polkadot/util";


export default function CollatorPage() {
  let param = useParams();
  let collatorAddr = param.address
  let [rewards, setRewards] = useState([])
  useEffect(() => {
    let task = async () => {
      let resp = await fetch(
        "https://api.subquery.network/sq/Zedonboy/subquery-moonbean-staking-dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
                    query {
                        rewards (filter:{address: {equalTo: "${collatorAddr}"}}) {
                            nodes {
                                id
                                amount
                                address
                            }
                        }
                    }
                    `,
          }),
        }
      );

      if(resp.ok){
          let data = await resp.json()
          setRewards(data.data.rewards.nodes)
      }
    };

    task();
  }, []);
  return <div className="py-4 min-h-screen">
       <div className="border border-accent text-accent rounded-md p-8">
            <p className="text-xs">rewards</p>
            <p className="text-xl mt-1">{rewards.length}</p>
          </div>
          <div>
          <table className="table-auto w-full">
            <thead>
              <tr className="text-blue-100">
                <th>Block height</th>
                <th>Amount</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {
                rewards?.map(v => (
                  <tr>
                  <td className="text-blue-500">{v?.blockNumber}</td>
                  <td className="text-green-500 text-xs">{(function () {
                  let a = v?.amount;
                  return formatBalance(
                    a,
                    {
                      withSi: false,
                    },
                    18
                  );
                })()}</td>
                  {/* <td>
                  <button className="text-blue-400 text-sm">Copy</button>
                  </td> */}
                </tr>
                ))
              }
             
            </tbody>
          </table>
          </div>
  </div>;
}
