"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError(result.error);
      console.log("Error", result.error);
    } else {
      router.push("/");
    }
  };
  return (
    <div>
      <h1 className="text-center text-2xl">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-lg gap-2 mx-auto"
      >
        <label htmlFor="password">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 px-2 py-1 "
          onClick={() => console.log(email)}
        >
          Submit
        </button>
        {error && (
          <span className="text-red-500 text-xl font-semibold">{error}</span>
        )}
      </form>
    </div>
  );
}

export default Login;
