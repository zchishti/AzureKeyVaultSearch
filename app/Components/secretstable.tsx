"use client"; // Client-side component

import React, { useState } from 'react';
import CopyIcon from '../assets/copy_icon.png';
import Image from 'next/image';
import toast from "react-hot-toast";

interface SecretsTableProps {
    data: {
        secrets: { name: string; value: string, status: string }[];
        status: string;
        success: boolean;
    };
    modalOpen: (type: string, secretName: string, secretValue: string) => void;
    deleteSecret: (secretName: string) => void;
}

interface ViewSecretValueProps {
    value: string;
}

const copyToClipboard = ({ text }: { text: string }) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
}

const SecretsTable: React.FC<SecretsTableProps> = ({ data, modalOpen, deleteSecret}) => {
  const [searchText, setSearchText] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState<{ [key: string]: boolean }>({});

  const viewSecretValue = (secretName: string) => {
    setVisibleSecrets(prevState => ({
        ...prevState,
        [secretName]: !prevState[secretName]
    }));
  };

  const clearSearch = () => {
    setSearchText("");
  }

  return (
    data.secrets.length === 0 ? (
        <></>
    ) : (
        <section className="mt-10 flex flex-col justify-center pt-8 border-t-2 border-gray-500 border-opacity-20">
            <div className="flex justify-between mb-2 relative">
                <button onClick={() => modalOpen("Add","","")} className="flex items-center px-2 mr-4 text-white bg-blue-500 rounded hover:bg-blue-700">
                    Add Secret    
                </button>
                <input
                    type="text"
                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-64"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                {
                    searchText && 
                    <span onClick={clearSearch} className="absolute cursor-pointer right-1 top-1.5 text-gray-300 hover:text-gray-400">x</span>
                }
            </div>
            <table className="shadow-md">
                <thead>
                    <tr>
                        <th scope="col" className="px-4 py-3 text-start font-bold text-gray-500 uppercase w-1/4">Name</th>
                        <th scope="col" className="px-4 py-3 text-start font-bold text-gray-500 uppercase w-1/2">Value</th>
                        <th scope="col" className="px-4 py-3 text-start font-bold text-gray-500 uppercase w-1/8">Status</th>
                        <th scope="col" className="px-4 py-3 text-start font-bold text-gray-500 uppercase w-1/8">Actions</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {
                        data.secrets
                            .filter(secret => secret.name.toLowerCase().includes(searchText.toLowerCase()))
                            .map((secret: any) => (
                                <tr key={secret.name} className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 border-b border-gray-200">
                                    <td className="px-4 py-3">{secret.name}</td>
                                    <td className="px-4 py-3 flex align-center justify-between">
                                        {visibleSecrets[secret.name] ? secret.value : (secret.value.length <= 100 ? Array(secret.value.length).fill('*').join('') : Array(100).fill('*').join(''))} 
                                        <i className={`cursor-pointer fa-solid ${visibleSecrets[secret.name] ? 'fa-eye-slash' : 'fa-eye'} p-2 text-stone-400 hover:text-stone-500`} onClick={() => viewSecretValue(secret.name)}></i>
                                        </td>
                                    <td className="px-4 py-3">{secret.status}</td>
                                    <td className="px-4 py-3 flex justify-between">
                                        <i className="cursor-pointer fa-solid fa-copy p-2 text-stone-400 hover:text-emerald-500" onClick={() => copyToClipboard({ text: secret.value })}></i>
                                        <i className="cursor-pointer fa-solid fa-edit p-2 text-stone-400 hover:text-amber-500" onClick={() => modalOpen("Edit", secret.name, secret.value)}></i>
                                        <i className="cursor-pointer fa-solid fa-trash p-2 text-stone-400 hover:text-rose-500" onClick={() => deleteSecret(secret.name)}></i>
                                    </td>
                                </tr>
                            ))
                    }
                </tbody>
                </table>
        </section>
        )
    )
}

export default SecretsTable
