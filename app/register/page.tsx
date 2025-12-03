"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
const Register = () => {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const result = await res.json();
      console.log("Result,", result);
      if (!result.data) {
        throw new Error("Registration failed!");
      }
      console.log(result);
      router.push("/login");
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 mx-auto max-w-lg bg-neutral-900 "
    >
      <h1>Register</h1>
      <label htmlFor="email">Email</label>
      <input
        type="text"
        id="email"
        placeholder="Enter your email"
        onChange={(e) =>
          setUser((prev) => ({ ...prev, email: e.target.value }))
        }
      />
      <br />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        placeholder="Enter your password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <br />
      <br />
      <button
        className="bg-blue-500 px-2 py-1 "
        onClick={() => console.log(user)}
      >
        Submit
      </button>
    </form>
  );
};

export default Register;
