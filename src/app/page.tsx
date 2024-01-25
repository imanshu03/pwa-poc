"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-white flex flex-col items-stretch justify-start gap-2 px-2 py-6">
      <h1 className="text-center text-4xl mr-auto">PWA POC</h1>
      <div className="grow" />
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/location"
          prefetch
          className="h-16 flex items-center justify-center border border-solid border-black"
        >
          Location
        </Link>
        <Link
          href="/product"
          prefetch
          className="h-16 flex items-center justify-center border border-solid border-black"
        >
          Product Details
        </Link>
        <Link
          href="/notification"
          prefetch
          className="h-16 flex items-center justify-center border border-solid border-black"
        >
          Notification
        </Link>
      </div>
      <div className="grow" />
    </div>
  );
}
