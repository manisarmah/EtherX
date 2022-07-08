import { useMoralis } from "react-moralis";
import styles from "../styles/adminLogin.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
export default function Admin() {
  const { login, isAuthenticated, user, authenticate, auth } = useMoralis();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const ADMIN = "0x2Cd4cdb8D4e7d1CFC6468f82A4e54141947384E7";
  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleClick = () => {
    setPassword("");
    login(username, password);
    console.log(`user:${JSON.stringify(user)}`);
    if (user) router.push("/admin/master");
    else alert("Invalid Credentials! Clear password and type again!");
  };
  // useEffect(() => {
  //   if (isAuthenticated && user.attributes.ethAddress == ADMIN)
  //     router.push("/admin/master");
  // });

  return (
    <div className={styles.bodyClass}>
      <div className={styles.boxWrapper}>
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={handleChangeUsername}
          autoComplete="off"
          autoSave="off"
        />
        <div className={styles.dummy}></div>
        {/* <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={handleChangeEmail}
        />
        <div className={styles.dummy}></div> */}
        <input
          type="password"
          value={password}
          onChange={handleChangePassword}
          placeholder="Password"
        />
        <div className={styles.dummy}></div>
        <button type="submit" onClick={handleClick}>
          Log In
        </button>
      </div>
    </div>
  );
}
