import styles from "../styles/askerCard.module.css";
import Countdown from "react-countdown";
import { useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import CrowdFunding from "../src/artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
export default function AdminCards({ data }) {
  const [expired, setExpired] = useState(false);
  const [makePayment, setMakePayment] = useState(data[8]);

  setInterval(() => {
    let now = new Date();
    if (now.getTime() >= data[3] * 1000) {
      setExpired(true);
    }
  }, 1);

  const Completionist = () => <span>Expired!</span>;

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
      setMakePayment(true);
      console.log("dusra padau");
      console.log(tx);
      console.log("---------------------------");
      // getFundRequests();
    } catch (error) {
      const erroJson = JSON.stringify(error);
      const errorToDisplay = JSON.parse(erroJson).reason;
      if (errorToDisplay.includes("cannot estimate gas")) {
        alert("Payment already done!");
      } else alert(errorToDisplay);
    }
  }

  async function getFundRequests() {
    const provider = new ethers.providers.AlchemyProvider(
      "rinkeby",
      process.env.RINKEBY_RPC_URL
    );
    // const signer = new ethers.Wallet(
    //   "c994f9983960c7c9b4c651f3805bfb350e3425ad818cfcdea50429596772f3c0",
    //   provider
    // );
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS,
      CrowdFunding.abi,
      provider
    );
    try {
      const data = await contract.getFundRequest();
      const JSONdata = JSON.stringify(data);
      console.log(JSONdata);
      // setGetFundRequests(JSONdata);
    } catch (error) {
      console.log(error);
    }
  }
  // async function getPaymentStatus() {
  //   const provider = new ethers.providers.AlchemyProvider(
  //     "rinkeby",
  //     process.env.RINKEBY_RPC_URL
  //   );
  //   // const signer = new ethers.Wallet(
  //   //   "c994f9983960c7c9b4c651f3805bfb350e3425ad818cfcdea50429596772f3c0",
  //   //   provider
  //   // );
  //   const contract = new ethers.Contract(
  //     process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS,
  //     CrowdFunding.abi,
  //     provider
  //   );
  //   try {
  //     const data = await contract.paymentCompletedStatus();
  //     const JSONdata = JSON.stringify(data);
  //     console.log(JSONdata);
  //     // setGetFundRequests(JSONdata);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <>
      {expired && (
        <div className={styles.cardWrapper}>
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
              {!data[8] ? (
                <button
                  onClick={makePaymentWithoutMeta}
                  className={styles.buttonMakePayment}
                >
                  Make Payment
                </button>
              ) : (
                <p>Payment Successful!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
