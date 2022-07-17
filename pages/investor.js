/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import styles from "../styles/investor.module.css";
// import router from "next/router";
import { ethers } from "ethers";
import { hasEthereum } from "../utils/ethereum";
import CrowdFunding from "../src/artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import AskersListCard from "../components/askersListCard";
import Clock from "react-digital-clock";
export default function Investor() {
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState("");
  const [getFundRequest, setGetFundRequests] = useState();
  useEffect(() => {
    if (!hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`);
      return;
    }
    async function setConnectedWalletAddress() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const signerAddress = await signer.getAddress();
        setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`);
      } catch {
        setConnectedWalletAddressState("No wallet connected");
        return;
      }
    }
    setConnectedWalletAddress();
    getFundRequests();
  }, []);
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function getFundRequests() {
    if (!hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`);
      return;
    }
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS,
      CrowdFunding.abi,
      provider
    );
    try {
      const data = await contract.getFundRequest();
      const JSONdata = JSON.stringify(data);
      console.log(JSONdata);
      setGetFundRequests(JSONdata);
    } catch (error) {
      console.log(error);
    }
  }

  const hexToDecimal = (hex) => parseInt(hex, 16);
  const dataAll = (getFundRequest) => {
    const dataArr = JSON.parse(getFundRequest);
    for (var i = 0; i < dataArr.length; i++) {
      for (var j = 2; j < 7; j++) {
        if (j == 2 || j == 3 || j == 6) {
          dataArr[i][j] = hexToDecimal(dataArr[i][j].hex);
        }
      }
    }
    return dataArr;
  };

  return (
    <div className={styles.masterInvestor}>
      <div className={styles.heading}>
        <h2>Investor's Portal</h2>
        <div>
          <Clock />
        </div>

        <h3>{connectedWalletAddress}</h3>
      </div>
      <div className={styles.allCards}>
        {getFundRequest
          ? dataAll(getFundRequest).map(function (data, idx) {
              data.push(idx);
              // data.push(false);
              return <AskersListCard key={idx} data={data} />;
            })
          : `No requests yet!`}
      </div>
    </div>
  );
}
