import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Calendar } from 'lucide-react';

const Login: React.FC = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    void signInWithPopup(auth, provider).catch(error => {
      console.error('Sign in failed:', error);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h1 className="text-2xl font-bold mb-4">Daily Checks</h1>
        <button
          onClick={signInWithGoogle}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;