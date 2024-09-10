import "./globals.css";
import { UserProvider } from "@/state/UserProvider";
import Header from "./component/header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
