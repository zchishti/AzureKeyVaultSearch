import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_CLIENTID,  // Replace with your Azure AD App Client ID
      authority: process.env.NEXT_PUBLIC_AUTHORITY,  // Replace with your Tenant ID
      redirectUri: process.env.NEXT_PUBLIC_REDIRECTURI,  // Use the same redirect URI as set in Azure
    },
    cache: {
      cacheLocation: 'localStorage',  // This is optional; sessionStorage is also available
      storeAuthStateInCookie: false,  // Set to true if you're experiencing issues on IE
    },
  };
  
  const msalInstance = new PublicClientApplication(msalConfig);
  
  export default msalInstance;