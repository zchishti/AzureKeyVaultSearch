"use client"

import React, { useState } from 'react';

interface KeyVaultInputProps {
    handleGetSecret: (keyVaultUri: string) => void;
    connectionMessage: string;
  }

const KeyVaultUriInput: React.FC<KeyVaultInputProps> = ({ handleGetSecret, connectionMessage }) => {
    const [uri, setUri] = useState<string>('https://generalpurposekeyvault.vault.azure.net/');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUri(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!uri) {
            return;
        }
        setIsLoading(true);
        await handleGetSecret(uri);
        setIsLoading(false);
    };

    return (
        <section className="flex w-full mt-12">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center space-x-4">
                    <label htmlFor="keyvault-uri" className="w-52">Key Vault URI:</label>
                    <input
                        type="text"
                        id="keyvault-uri"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={uri}
                        onChange={handleChange}
                    />
                    <button
                    type="submit"
                    className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700 w-48"
                    disabled={isLoading}
                    >
                    {isLoading ? 'Connecting...' : 'Get Secrets'}
                    </button>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                    {connectionMessage === "Failed to connect to Key Vault" && (
                        <span className="connection_dot rounded-full bg-red-500"></span>
                    )}
                    {connectionMessage === "Connected to Key Vault" && (
                        <span className="connection_dot rounded-full bg-emerald-500"></span>
                    )}
                    <p>{connectionMessage}</p>
                </div>
            </form>
        </section>
    );
};

export default KeyVaultUriInput;