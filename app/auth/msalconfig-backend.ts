import { ConfidentialClientApplication } from "@azure/msal-node";
//require('dotenv').config();

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_CLIENTID || "",   // Replace with your Azure AD App Client ID
    authority: process.env.NEXT_PUBLIC_AUTHORITY || "",   // Replace with your Tenant ID
    clientSecret: process.env.NEXT_PUBLIC_CLIENTSECRET || "",   // The client secret generated for this app
  },
};

const msalInstance = new ConfidentialClientApplication(msalConfig);

export default msalInstance;
