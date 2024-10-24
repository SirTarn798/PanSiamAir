import "../globals.css";
import { UserProvider } from "@/state/UserProvider";
import Header from "@/app/component/header";
import  FinanceNavBar from "@/app/component/financeNavBar"

export const metadata = {
  title: "CentralAir",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/icon.png" sizes="any" />
      <body>
        <UserProvider>
          <Header />
          <div className="flex">
            <FinanceNavBar />
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
