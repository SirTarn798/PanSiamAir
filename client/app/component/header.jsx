"use client";

import { useSelector } from "react-redux";
import "../(auth)/register/register.css";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();
  const id = useSelector((state) => state.user.id);

  const logout = async () => {
    try {
      const response = await fetch("/api/logoutAPI", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: {},
      });
      router.push("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-primary">
      <img src="/logo.png" alt="logo" className="w-auto h-20" />
      <div className="flex items-center gap-5">
        <img src="/user.png" alt="userPic" className="profile" />
        <h1>{id}</h1>
        <button className="text-white font-bold" onClick={logout}>
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}

export default Header;
