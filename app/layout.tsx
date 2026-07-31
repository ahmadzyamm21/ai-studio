import "./globals.css";
import { Sidebar } from "@/components/sidebar";
export const metadata={title:"AI Studio",description:"AI content production platform"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body><div className="shell"><Sidebar/><main className="main">{children}</main></div></body></html>}
