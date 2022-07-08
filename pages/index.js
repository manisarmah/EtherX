/* eslint-disable @next/next/link-passhref */
import styles from "../styles/home.module.css";
import logo from "../public/logo.png";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import Link from "next/link";
const ADMIN = "0x2Cd4cdb8D4e7d1CFC6468f82A4e54141947384E7";
let linkAddress;
export default function Home() {
  const { authenticate, authError, isAuthenticated, user, Moralis, logout } =
    useMoralis();
  // if (authError) alert(`${authError.name} ${authError.message}`);
  return (
    <>
      <div className={styles.parent_Welcome}>
        <div className={styles.navbar}>
          <div className={styles.logos}>
            <div>
              <Image src={logo} alt="EtherX" height="30px" width="30px" />
            </div>
            <div className={styles.dummy}></div>
            <div className={styles.logoName}>EtherX</div>
          </div>

          <div className={styles.buttons}>
            {authError && (
              <div>
                {authError.name}
                {authError.message}
              </div>
            )}
            <Link
              href={
                isAuthenticated && user.attributes.ethAddress == ADMIN
                  ? "/admin"
                  : "/"
              }
            >
              <button
                disabled={isAuthenticated}
                id="wallet"
                className={styles.walletBtn}
                onClick={authenticate}
              >
                {isAuthenticated
                  ? `${user.attributes.ethAddress} Connected`
                  : "Connect Wallet"}
              </button>
            </Link>

            <div></div>

            <button
              id="admin"
              className={styles.adminBtn}
              onClick={isAuthenticated ? logout : authenticate}
            >
              {!isAuthenticated ? "Admin" : "Logout"}
            </button>
          </div>
        </div>
        <div className={styles.welcome_msg}>
          <h1>
            ~ Welcome To <span>EtherX</span> ~
          </h1>
        </div>
        <div className={styles.choose_profile}>
          <div className={styles.profile_investor}>
            <a href="/investor">I want to invest ...</a>
          </div>
          <div className={styles.profile_asker}>
            <a href="/asker">I want funding ...</a>{" "}
          </div>
        </div>
      </div>
    </>
  );
}
