"use client";
import { useSelector } from "react-redux";

export default function Home() {
  const id = useSelector((state) => state.user.id);
  console.log(id);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome</h1>
    </main>
  );
}
