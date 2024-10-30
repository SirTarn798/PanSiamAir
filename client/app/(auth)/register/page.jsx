"use client";

import { useState } from "react";
import "./register.css";
import upload from "../../../lib/upload";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [pic, setPic] = useState("/user.png");
  const [pfp, setPfp] = useState({
    file: null,
    url: "/user.png",
  });
  const [pfpStatus, setPfpStatus] = useState(false);
  const [status, setStatus] = useState(true);

  const register = async (e) => {
    setStatus(false);
    e.preventDefault();
    try {
      let pfpLink = "/user.png";
      if (pfp.file != null) {
        pfpLink = await upload(pfp.file, "profiles");
      }
      const response = await fetch("/api/registerApi", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          tel: tel,
          name: name,
          role: "CUSTOMER",
          profile: pfpLink,
        }),
      });
      alert("สมัครสำเร็จ");
      router.push("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setStatus(true);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPfp({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
      setPic(URL.createObjectURL(e.target.files[0]));
      setPfpStatus(true);
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const email = e.target.value;
    if (emailRegex.test(email)) {
      setEmail(email);
    } else {
      // Display an error message or perform other validation actions
      console.log("Invalid email format");
    }
  };

  return (
    <div className="flex mt-16 justify-center items-center">
      <form
        onSubmit={register}
        className="flex flex-col items-center rounded-xl w-3/12 p-8 bg-white gap-4 text-black"
      >
        <h1 className="text-6xl mb-6 font-bold">Sign Up</h1>
        <div className="rounded-full">
          <img
            src={pic}
            alt="user"
            onMouseEnter={() => setPic("/user-hovered.png")}
            onMouseLeave={() => {
              if (!pfpStatus) setPic("/user.png");
              setPic(pfp.url);
            }}
            onClick={handleImageClick}
            className="cursor-pointer profile"
          />
        </div>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 w-64 bg-zinc-200 rounded"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="p-2 w-64 bg-zinc-200 rounded"
        />
        <input
          placeholder="Password at least 8 charactors"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 w-64 bg-zinc-200 rounded"
          required
          minLength={8}
        />
        <input
          placeholder="Phone Number"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          className="p-2 w-64 bg-zinc-200 rounded"
        />
        <button
          type="submit"
          className={`text-white p-5 w-64 rounded drop-shadow-md ${
            status
              ? "bg-primary cursor-pointer"
              : "bg-primaryBg cursor-not-allowed"
          }`}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
