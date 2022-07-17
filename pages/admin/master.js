import router from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import styles from "../../styles/master.module.css";
import AdminCards from "../../components/adminCards";
import CrowdFunding from "../../src/artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";

import { ethers } from "ethers";
export default function Master() {
  const { isAuthenticated, logout, user } = useMoralis();
  const [getFundRequest, setGetFundRequests] = useState();
  useEffect(() => {
    getFundRequests();
  });
  const handleClick = () => {
    logout();
    router.push("/");
  };
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
    <>
      {isAuthenticated && (
        <div className={styles.logoutNav}>
          <button onClick={handleClick}>Log Out</button>
        </div>
      )}
      <div className={styles.allCards}>
        {getFundRequest
          ? dataAll(getFundRequest).map(function (data, idx) {
              data.push(idx);
              data.push(false);
              return <AdminCards key={idx} data={data} />;
            })
          : `No requests yet!`}
      </div>
    </>
  );
}
