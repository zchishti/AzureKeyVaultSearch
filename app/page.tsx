"use client"; // Client-side component

import { MsalProvider } from "@azure/msal-react";
import msalInstance from "./auth/msalconfig";
import { useMsal } from "@azure/msal-react";
import SignIn from "./Components/signin";
import Header from "./Components/header";
import KeyVaultUriInput from "./Components/keyvaulturiinput";
import { useState } from "react";
import SecretsTable from "./Components/secretstable";
import AddSecretModal from "./Components/modal";
import toast from "react-hot-toast";


export default function Home() {
  const { instance, accounts } = useMsal();
  interface SecretsTableProps {
    data: {
        secrets: { name: string; value: string, status: string }[];
        status: string;
        success: boolean;
    };
    modalOpen: (type: string, secretName: string, secretValue: string) => void;
}
  
  const [secrets, setSecrets] = useState<SecretsTableProps["data"]>({
    secrets: [],
    status: "",
    success: false,
  });
  const [connectionMessage , setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ type: string, secretName: string; secretValue: string }>({ type: "Add", secretName: "", secretValue: "" });

  const handleLogin = async () => {
    try {
      await instance.loginPopup({
        scopes: ["openid", "profile", "email"],
      });
    } catch (error) {
      console.error(error);
    }
  };

   const handleLogout = async () => {
    try {
      await instance.logoutPopup();
    } catch (error) {
      console.error(error);
    }
  };

  const getKeyVaultSecrets = async (keyVaultUri: string) => {
    const account = accounts[0];
    const tokenResponse = await instance.acquireTokenSilent({
      scopes: ["https://vault.azure.net/.default"],
      account,
    });

    const response = await fetch("/api/keyvault", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenResponse.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyVaultUri, // Use the keyVaultUri passed as parameter
      }),
    });

    const data = await response.json();
    if (data.success) {
      setSecrets(data);
      setMessage("Connected to Key Vault");
    } else {
      console.error("Failed to fetch secret", data);
      setMessage("Failed to connect to Key Vault");
    }
  };

  const sumbitSecret = async (secretName: string, secretValue: string) => {
    const account = accounts[0];
    const tokenResponse = await instance.acquireTokenSilent({
      scopes: ["https://vault.azure.net/.default"],
      account,
    });

    const response = await fetch("/api/keyvault", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${tokenResponse.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyVaultUri: "https://generalpurposekeyvault.vault.azure.net/",
        secretName,
        secretValue,
      }),
    });

    const data = await response.json();
    if (data.success) {
      setSecrets({
        secrets: [...secrets.secrets, { name: data.secret.name, value: data.secret.value, status: data.secret.status }],
        status: data.status,
        success: true,
      });
      toast.success("Secret added successfully!");
    } else {
      toast.error(data.error);
      console.error("Failed to add secret");
    }
    return {
      status: response.status,
      message: data.error || data.success,
    };
  }

  const deleteSecret = async (secretName: string) => {
    const account = accounts[0];
    const tokenResponse = await instance.acquireTokenSilent({
      scopes: ["https://vault.azure.net/.default"],
      account,
    });

    const response = await fetch("/api/keyvault", {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${tokenResponse.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyVaultUri: "https://generalpurposekeyvault.vault.azure.net/",
        secretName,
      }),
    });

    const data = await response.json();
    if (data.success) {
      setSecrets({
        secrets: secrets.secrets.filter((secret) => secret.name !== secretName),
        status: data.message,
        success: true,
      });
      toast.success(data.message);
    } else {
      toast.error(data.error);
      console.error("Failed to delete secret");
  }
}

  const openModal = (type: string, secretName: string, secretValue: string) => {
    setModalData({ type, secretName, secretValue });
    setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
  };

  return (
    <MsalProvider instance={msalInstance}>
      {isModalOpen && <AddSecretModal submitSecret={sumbitSecret} onClose={closeModal} type={modalData.type} secretName={modalData.secretName} secretValue={modalData.secretValue} />}
      <div className="container mx-auto">
        {accounts.length > 0 ? (
          <>
            <Header IsAuthenticated={true} UserName={accounts[0].name} SignOut={handleLogout} />
            <KeyVaultUriInput handleGetSecret={getKeyVaultSecrets} connectionMessage={connectionMessage}/>
            <SecretsTable data={secrets} modalOpen={openModal} deleteSecret={deleteSecret}/>
          </>
        ) : (
          <>
            <Header IsAuthenticated={false} SignOut={handleLogin} />
            <SignIn signIn={handleLogin} />
          </>
        )}
      </div>
    </MsalProvider>
  );
}

