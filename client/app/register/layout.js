import Image from "next/image";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-rose-500">
        <div className="w-full h-32 bg-white flex justify-center">
          <Image src={"/logo.png"} width={600} height={450} alt="logo" />
        </div>
        {children}
      </body>
    </html>
  );
}
