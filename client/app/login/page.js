"use client";

import { useState } from "react";
import { setId } from "@/state/user/userSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/loginApi", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (response.status === 201) {
        const data = await response.json();
        dispatch(setId(data.user.id));
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex mt-16 justify-center items-center">
      <form
        onSubmit={login}
        className="flex flex-col items-center rounded-xl w-3/12 p-8 bg-white gap-10 text-black"
      >
        <h1 className="text-6xl mb-6 font-bold">Login</h1>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 w-64 bg-zinc-200 rounded"
        ></input>
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 w-64 bg-zinc-200 rounded"
        ></input>
        <button
          type="submit"
          className="text-white bg-rose-500 p-5 w-64 rounded drop-shadow-md cursor-pointer"
        >
          Login
        </button>
        <h4 className="self-end text-rose-500 hover:underline underline-offset-1 cursor-pointer">Don't have an account?</h4>
      </form>
    </div>
  );
}
