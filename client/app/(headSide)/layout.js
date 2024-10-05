import "../globals.css";
import { UserProvider } from "@/state/UserProvider";
import Header from "@/app/component/header"
import HeadNavBar from "@/app/component/headNavBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          <div className="flex">
            <HeadNavBar />
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
