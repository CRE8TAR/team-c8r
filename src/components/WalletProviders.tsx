import { useState, useEffect } from "react";

export const DiscoverWalletProviders = () => {
  const [ribbonVisible, setRibbonVisible] = useState(true);
  const [userAccount, setUserAccount] = useState<string | null>(null);

  // Function to check current connection status
  const checkMetaMaskConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setUserAccount(accounts[0]);
          setRibbonVisible(true);
          setTimeout(() => setRibbonVisible(false), 3000);
        } else {
          setUserAccount(null);
          setRibbonVisible(true);
        }
      } catch (error) {
        console.error("Error checking MetaMask accounts:", error);
        setUserAccount(null);
        setRibbonVisible(true);
      }
    } else {
      setUserAccount(null);
      setRibbonVisible(true);
    }
  };

  useEffect(() => {
    checkMetaMaskConnection();

    // Listen for account changes (connect or disconnect)
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setUserAccount(accounts[0]);
          setRibbonVisible(true);
          setTimeout(() => setRibbonVisible(false), 3000);
        } else {
          // User disconnected their wallet or no accounts available
          setUserAccount(null);
          setRibbonVisible(true);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Cleanup listener on unmount
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  const ribbonMessage = userAccount
    ? "Meta Mask Wallet Connected"
    : "No Meta Mask Wallet Selected";

  if (!ribbonVisible) return null;

  return (
    <div
      style={{
        display: "inline-block",
        padding: "10px 40px",
        background: "linear-gradient(5deg, #6c63ff, #a78bfa)",
        color: "#DCDCDC",
        fontWeight: "600",
        fontSize: "1rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
        boxShadow: "0 0 15px 1px #6c63ff",
        animation: "shining 3.5s infinite",
        borderRadius: "8px",
        zIndex: 1000,
      }}
      className="wallet-ribbon"
    >
      {ribbonMessage}

      <style>
        {`
          @keyframes shining {
            0% { box-shadow: 0 0 10px 2px #6c63ff; }
            50% { box-shadow: 0 0 10px 4px #a78bfa; }
            100% { box-shadow: 0 0 10px 2px #6c63ff; }
          }

          .wallet-ribbon::before, .wallet-ribbon::after {
            content: "";
            position: absolute;
            bottom: 0;
            width: 20px;
            height: 20px;
            background: linear-gradient(45deg, #6c63ff, #a78bfa);
            border-radius: 4px;
          }

          .wallet-ribbon::before {
            left: -15px;
            transform: rotate(45deg);
            box-shadow: 0 0 15px 3px #6c63ff;
          }

          .wallet-ribbon::after {
            right: -15px;
            transform: rotate(-45deg);
            box-shadow: 0 0 15px 3px #6c63ff;
          }
        `}
      </style>
    </div>
  );
};
