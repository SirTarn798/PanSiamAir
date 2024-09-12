"use client";

import { useState } from "react";
import "./register.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../lib/firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [num, setNum] = useState("");
  const [pic, setPic] = useState("/user.png");
  const [pfp, setPfp] = useState({
    file: null,
    url: "/user.png",
  });
  const [pfpStatus, setPfpStatus] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/registerApi", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (pfp.file != null) {
        handleUploadPfp();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  async function upload(file) {
    let date = new Date();
    let storageRef = ref(storage, `images/${date + file.name}`);
    try {
      const snapshot = await uploadBytesResumable(storageRef, file);
      const imageLink = await getDownloadURL(snapshot.ref);
      return imageLink;
    } catch (err) {
      console.log(err);
    }
  }

  const handleUploadPfp = async (e) => {
    if (pfp.file) {
      const link = "http://localhost:3000/uploadPfp";
      try {
        const uploadPfp = await upload(pfp.file);
        // const response = await fetch(link, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ link: uploadPfp, userid: currentUser }),
        // });
      } catch (err) {
        console.log(err.message);
      }
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
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 w-64 bg-zinc-200 rounded"
        />
        <input
          placeholder="Password at least 8 charactors"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 w-64 bg-zinc-200 rounded"
        />
        <input
          placeholder="Phone Number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          className="p-2 w-64 bg-zinc-200 rounded"
        />
        <button
          type="submit"
          className="text-white bg-rose-500 p-5 w-64 rounded drop-shadow-md cursor-pointer"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
