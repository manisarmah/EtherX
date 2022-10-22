import "../styles/globals.css";
import { MoralisProvider, useMoralis } from "react-moralis";
function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId="THMRpAqVEixYJ2l3zg8Gd8BPafQNcK712QHuSJZX"
      serverUrl="https://3xqncbzw60nj.grandmoralis.com:2053/server"
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
