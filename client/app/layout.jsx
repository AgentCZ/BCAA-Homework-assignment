import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "MedLog – digitální deník léků",
  description: "Evidence léků a jejich užití",
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
          MedLog
        </footer>
      </body>
    </html>
  );
}
