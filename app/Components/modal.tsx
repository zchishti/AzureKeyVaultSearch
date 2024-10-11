import React, { useState } from 'react'
import toast from "react-hot-toast";

interface ModalProps {
  onClose: () => void;
  submitSecret: (secretName: string, secretValue: string) => Promise<{status: number, message: string}>;
  type: string;
  secretName: string;
  secretValue: string;
}


const AddSecretModal: React.FC<ModalProps> = ({ onClose, submitSecret, type, secretName: initialSecretName, secretValue: initialSecretValue }) => {
    const [secretName, setSecretName] = useState<string>(initialSecretName);
    const [secretValue, setSecretValue] = useState<string>(initialSecretValue);
    const [errors, setErrors] = useState<string[]>([]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecretName(event.target.value);
    };

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecretValue(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        validateSecretNameAndValue();
        if(errors.length == 0){
            const response = await submitSecret(secretName, secretValue);
            if(response.status === 200){
                onClose();
            }
            // else{
            //     toast.error(response.message);
            // }
        }
    }

    const validateSecretNameAndValue = () => {
        let newErrors: string[] = [];

        if (secretName.length <= 0 || secretName.length > 127) {
            newErrors.push("Secret Name length must be between 1 and 127");
        }

        const nameRegex = /^[a-zA-Z0-9-]+$/;
        if (!nameRegex.test(secretName)) {
            newErrors.push("Secret name can only contain alphanumerics and hyphens (dash)");
        }

        const nameStartEndRegex = /^[a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9]$/;
        if (!nameStartEndRegex.test(secretName)) {
            newErrors.push("The name must start with a letter and end with a letter or digit");
        }

        if (secretName.includes("--")) {
            newErrors.push("The name cannot contain consecutive hyphens");
        }

        if (secretValue.length <= 0) {
            newErrors.push("Secret Value length must be greater than 0");
        }

        setErrors(newErrors);
    }

  return (
    <div className="modal_container">
      <div className="modal drop-shadow-lg">
        <div className="modal_header flex justify-between align-center">
          <h2 className="font-semibold text-2xl">{type} Secret</h2>
          <button onClick={onClose} className="font-semibold text-xl text-rose-400 hover:text-rose-500">x</button>
        </div>
        <div className="modal_content flex flex-col">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-4 mb-4">  
                <label htmlFor="secret-name" className="w-52">Secret Name:</label>
                <input type="text" 
                className={type === "Add" ? "shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" : 
                    "shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight disabled:opacity-75 cursor-not-allowed focus:outline-none focus:shadow-outline bg-gray-200"}
                    {...(type === "Add" ? {disabled: false} : {disabled: true})}
                    value={secretName}
                    onChange={handleNameChange}
                />
                </div>
                <div className="flex items-center space-x-4">
                <label htmlFor="secret-value" className="w-52">Secret Value:</label>
                <input type="text"
                    className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={secretValue}
                    onChange={handleValueChange}
                />
                </div>
                    {errors.length > 0 && (
                        <div className="mt-6 text-xs text-red-500">
                            <ul>
                                {errors.map((element, index) => (
                                    <li key={index}>{element}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                <div className="flex justify-end mt-6">
                <button className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700 w-48">Submit</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default AddSecretModal
