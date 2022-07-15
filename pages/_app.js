import "../styles/globals.css";
import { MoralisProvider, useMoralis } from "react-moralis";
function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId="20yPHbwCEzU6BuIo3qY739q6ekOhIGOuyVN3xHKB"
      serverUrl="https://fhcrivr8islj.usemoralis.com:2053/server"
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
