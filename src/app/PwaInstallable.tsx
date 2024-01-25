"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const PwaInstallable = () => {
  const promptRef = useRef<any>();
  const [showPrompt, setShowPrompt] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const isInstalledPWA =
      window.matchMedia("(display-mode: browser)").matches ||
      window.matchMedia("(display-mode: standalone)").matches;

    if (!isInstalledPWA) {
      window.addEventListener("beforeinstallprompt", function (e) {
        e.preventDefault();
        promptRef.current = e;
        setShowPrompt(true);
      });
    }
  });

  const onClick = () => {
    console.log({ promptRef });
    promptRef.current?.prompt();
  };

  return showPrompt ? (
    <div className="fixed bottom-0 left-0 w-screen z-50 p-4 bg-black flex items-center justify-start">
      <Image
        src="/icons/cred-512x512.png"
        alt="cred logo"
        width={512}
        height={512}
        className="w-20 h-20"
      />
      <div className="flex flex-col items-start justify-start grow">
        <h1 className="text-white font-bold">CRED&apos; Agent App</h1>
        <h2 className="text-white">
          The progressive web application for field agents
        </h2>
        <div className="flex items-center justify-center self-end">
          <button
            className="text-black bg-white py-1 px-2 rounded-sm mr-3"
            onClick={() => setShowPrompt(false)}
          >
            Close
          </button>
          <button
            className="text-black bg-white py-1 px-2 rounded-sm"
            onClick={onClick}
          >
            Install
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default PwaInstallable;
