import router from "next/router";
import { useMoralis } from "react-moralis";

export default function Master() {
  const { isAuthenticated, logout, user } = useMoralis();
  const handleClick = () => {
    logout();
    router.push("/");
  };
  return (
    <>
      {isAuthenticated && (
        <div>
          <button onClick={handleClick}>Log Out</button>
        </div>
      )}
      <div>{JSON.stringify(user)};</div>
    </>
  );
}
