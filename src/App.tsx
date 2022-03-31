//@ts-nocheck
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import ApiContext from "../src/context/PolkadotContext";
import ChainChooser, { Network } from "../src/context/chainChooser";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { RecoilRoot } from "recoil";
import { HashRouter } from "react-router-dom";
function App() {
  const [api, setApi] = useState<any | null>(null);
  const [network, setNetwork] = useState(Network.MOON_ALPHA);
  useEffect(() => {
    let task = async () => {
      const wsProvider = new WsProvider(
        "wss://moonbeam-alpha.api.onfinality.io/public-ws"
      );
      let api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);
    };

    let td;
    td = setInterval(() => {
      if (api === null) {
        console.log("Start");
        task();
        clearInterval(td);
      }
    }, 2000);
  }, []);
  return (
    <HashRouter>
      <RecoilRoot>
        <ChainChooser.Provider
          value={{
            network,
            moonbeam() {
              let task = async () => {
                const wsProvider = new WsProvider(
                  "wss://moonbeam.api.onfinality.io/ws?apikey=e5101f77-433d-4934-820a-6e83715ffa44"
                );
                let api = await ApiPromise.create({ provider: wsProvider });
                setApi(api);
                setNetwork(Network.MOONBEAM);
              };

              task();
            },
            moonriver() {
              let task = async () => {
                const wsProvider = new WsProvider(
                  "wss://moonriver.api.onfinality.io/ws?apikey=e5101f77-433d-4934-820a-6e83715ffa44"
                );
                let api = await ApiPromise.create({ provider: wsProvider });
                setApi(api);
                setNetwork(Network.MOONRIVER);
              };

              task();
            },

            moonalpha() {
              let task = async () => {
                const wsProvider = new WsProvider(
                  "wss://moonbeam-alpha.api.onfinality.io/public-ws"
                );
                let api = await ApiPromise.create({ provider: wsProvider });
                setApi(api);
                setNetwork(Network.MOON_ALPHA);
              };

              task();
            }
          }}
        >
          <ApiContext.Provider value={api}>
            <Home />
          </ApiContext.Provider>
        </ChainChooser.Provider>
      </RecoilRoot>
    </HashRouter>
  );
}

export default App;
