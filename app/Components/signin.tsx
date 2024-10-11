import React from 'react';

interface SignInProps {
    signIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ signIn }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <h1 className="text-3xl mb-4">Sign Into Your Microsoft Account</h1>
            <button
                onClick={signIn}
                className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
                Sign In
            </button>
        </div>
    );
};

export default SignIn;