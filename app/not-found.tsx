import Link from "next/link";
export default function NotFound() { return <main className="not-found"><span>404</span><h1>This page is outside the drawing.</h1><p>The requested route could not be found.</p><Link href="/en" className="button button-primary">Return home</Link></main>; }
