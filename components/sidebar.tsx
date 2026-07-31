import Link from "next/link";
const links=[['/dashboard','Dashboard'],['/products','Products'],['/prompt-factory','Prompt Factory'],['/assets','Asset Library'],['/content','Content'],['/settings','Settings']];
export function Sidebar(){return <aside className="sidebar"><div className="logo"><span>AI</span> Studio</div><nav className="nav">{links.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}</nav></aside>}
