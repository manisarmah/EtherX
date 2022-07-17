import styles from "../styles/askerCard.module.css";
import Countdown from "react-countdown";
import { useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import CrowdFunding from "../src/artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import { hasEthereum } from "../utils/ethereum";
export default function AskersListCard({ data }) {
  const [ethAmount, setEthAmount] = useState("");
  const [expired, setExpired] = useState(false);
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState("");
  const [paymentMade, setPaymentMade] = useState(false);
  useEffect(() => {
    console.log(data);
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
    // console.log(data);
  }, []);
  // const setExpiredFunc = () => {
  //   if (Date.now() >= data[3] * 1000) setExpired(true);
  // };

  setInterval(() => {
    let now = new Date();
    if (now.getTime() >= data[3] * 1000) {
      setExpired(true);
    }
  }, 1);
  // setInterval(() => {
  //   let now = new Date();
  //   if (now.getTime() >= data[3] * 1000 && !paymentMade) {
  //     setPaymentMade(true);
  //     makePaymentWithoutMeta();
  //   }
  // }, 1000 * 30);

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
  }

  // async function getPaymentStatusAsker() {
  //   const provider = new ethers.providers.AlchemyProvider(
  //     "rinkeby",
  //     process.env.RINKEBY_RPC_URL
  //   );
  //   const signer = new ethers.Wallet(
  //     "c994f9983960c7c9b4c651f3805bfb350e3425ad818cfcdea50429596772f3c0",
  //     provider
  //   );
  //   const contract = new ethers.Contract(
  //     process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS,
  //     CrowdFunding.abi,
  //     signer
  //   );
  //   try {
  //     const data = await contract.getPaymentStatus();
  //     const JSONdata = JSON.stringify(data);
  //     console.log(JSONdata);
  //     // setGetFundRequests(JSONdata);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function makePaymentWithoutMeta() {
    const provider = new ethers.providers.AlchemyProvider(
      "rinkeby",
      process.env.RINKEBY_RPC_URL
    );
    const signer = new ethers.Wallet(
      "c994f9983960c7c9b4c651f3805bfb350e3425ad818cfcdea50429596772f3c0",
      provider
    );
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS,
      CrowdFunding.abi,
      signer
    );
    try {
      console.log("pehla padau");
      const tx = await contract.makePayment(data[7]);
      await tx.wait();
      console.log("dusra padau");
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  }

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
          {/* <button
            onClick={() => {
              getPaymentStatusAsker();
              // makePaymentWithoutMeta();
            }}
          >
            MAKE
          </button> */}
        </div>
      </div>
    </div>
  );
}
