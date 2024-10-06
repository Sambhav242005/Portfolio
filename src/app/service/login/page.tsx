// pages/login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { verifyPassword } from '@/lib/password/password';

export default function LoginPage() {
  const router = useRouter();
  const [inputPassword, setInputPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Verify password using server-side logic
    if (verifyPassword(inputPassword)) {
      router.push('/dashboard'); // Redirect to a protected page upon successful login
    } else {
      setErrorMessage('Invalid password, please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Enter Random Password (from log):
            </label>
            <input
              type="password"
              id="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
