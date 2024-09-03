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
        console.log(data.user)
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={login} className="flex flex-col gap-20 text-black">
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          placeholder="password at least 8 charactors"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button
          type="submit"
          className="text-white"
          disabled={password.length < 8 ? true : false}
        >
          Login
        </button>
      </form>
    </div>
  );
}
