"use client";

import { useSelector } from "react-redux";
import "../(auth)/register/register.css";

function Header() {
  const id = useSelector((state) => state.user.id);

  return (
    <div className="flex justify-between items-center p-4 bg-primary">
      <img src="/logo.png" alt="logo" className="w-auto h-20" />
      <div className="flex items-center gap-5">
        <img src="/user.png" alt="userPic" className="profile" />
        <h1>{id}</h1>
      </div>
    </div>
  );
}

export default Header;
