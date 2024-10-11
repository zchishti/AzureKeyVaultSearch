import React from 'react'
import Image from 'next/image'
import AzureKeyVaultImg from '../assets/azurekeyvault_img.png'

interface HeaderProps {
  IsAuthenticated: boolean;
  SignOut: () => void;
  UserName?: string;
}

const Header: React.FC<HeaderProps> = ({ IsAuthenticated, UserName, SignOut }) => {
  return (
    <section className="p-4 flex border-b-2 border-amber-400">
        <div className="flex w-3/4 justify-start">
            <Image className="mt-2" src={AzureKeyVaultImg} alt="Logo" width={80} height={50} />
            <h1 className="text-xl mt-3">Azure Key Vault Secrets Search</h1>
        </div>
        <div className="flex w-1/4 justify-end">
        {(IsAuthenticated) ? (
          <>
            <p className="mr-4 mt-3">{UserName}</p>
            <button
                className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
                onClick={() => {
                    SignOut();
                }}
            >
                Sign Out
            </button>
          </>
        ): null}
        </div>
    </section>
  )
}

export default Header
