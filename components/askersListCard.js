import styles from "../styles/askerCard.module.css";
import Countdown from "react-countdown";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CrowdFunding from "../src/artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import { hasEthereum } from "../utils/ethereum";
export default function AskersListCard({ data }) {
  const [ethAmount, setEthAmount] = useState("");
  const [expired, setExpired] = useState(false);
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState("");
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
        setConnectedWalletAddressState(signerAddress);
      } catch {
        setConnectedWalletAddressState("No wallet connected");
        return;
      }
    }
    setConnectedWalletAddress();
  }, []);
  const setExpiredFunc = () => {
    if (Date.now() >= data[3] * 1000) setExpired(true);
  };
  useEffect(() => {
    setExpiredFunc();
    // checkVotingEligibilty();
  });
  const Completionist = () => <span>Expired!</span>;

  const handleClick = (e) => {
    // console.log(data);
    e.preventDefault();
    sendEth();
  };
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function sendEth() {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS,
      CrowdFunding.abi,
      signer
    );
    const transaction = await contract.sendEth(data[7], { value: ethAmount });
    await transaction.wait();
    console.log(transaction);
    alert(`Amount worth ${ethAmount / 10e18} ETH invested!`);
    // alert("Fund request created!");
    // router.push("/");
  }
  async function checkVotingEligibilty() {
    if (!hasEthereum) {
      setConnectedWalletAddressState(`Metamask unavailable!`);
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
      const contributorsData = await contract.getContributors(data[7]);
      const JSONdata = JSON.stringify(contributorsData);
      console.log(JSONdata);
      if (JSONdata.includes(connectedWalletAddress))
        alert("Voted successfully!");
      else alert("You can't vote!");
    } catch (error) {
      console.log(error);
    }
  }
  const handleVotingCheck = (e) => {
    e.preventDefault();
    checkVotingEligibilty();
  };
  // const timestamp = 1657816830000;
  // setInterval(() => {
  //   // let date = new Date();
  //   //86400000 represents 10 hours in milliseconds Change it as you like
  //   if (Date.now() == timestamp) {
  //     //your code
  //     alert("Ok!");
  //   }
  // }, 1);
  return (
    <div className={expired ? styles.cardWrapper : styles.cardWrapperGreen}>
      <div className={styles.cardWrapper2}>
        <h3>
          <span>ABOUT : </span>
          {data[0]}
        </h3>
        <p>
          <span>Target Asked : </span>
          {data[2]} Wei
        </p>
        <p>
          <span>Deadline : </span>
          {/* {data[3]} */}

          <Countdown date={data[3] * 1000}>
            <Completionist />
          </Countdown>
        </p>
        <p>
          <span>Accept if amount raised less than target : </span>
          {data[4] == true ? "YES" : "NO"}
        </p>
        <p>
          <span>Profit Percentage to Investor : </span>
          {data[6]}%
        </p>
        <div className={styles.buttonWrapper}>
          {!expired && (
            <input
              type="number"
              step="100"
              min="100"
              required
              value={ethAmount}
              onChange={(e) => {
                setEthAmount(e.target.value);
              }}
              placeholder="Amount in Wei"
            />
          )}
          <button
            onClick={handleClick}
            className={expired ? styles.buttonExpired : styles.buttonFund}
            disabled={expired}
          >
            Fund
          </button>
        </div>
      </div>
    </div>
  );
}
