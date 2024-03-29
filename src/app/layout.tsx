import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LocationContextProvider from "./LocationContext";
import Script from "next/script";
import PwaInstallable from "./PwaInstallable";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  manifest: "/manifest.json",
  icons: [
    {
      url: "/icons/cred-196x196.png",
      type: "image/png",
    },
    {
      url: "/icons/cred-512x512.png",
      type: "image/png",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  return (
    <html lang="en">
      <head>
        <Script id="service-worker">
          {`
            function urlBase64ToUint8Array(base64String) {
              var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
              var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
            
              var rawData = window.atob(base64);
              var outputArray = new Uint8Array(rawData.length);
            
              for (var i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
              }
              return outputArray;
            };
            (async function () {
              try {
                const registration = await navigator.serviceWorker.register(
                  "/sw.js",
                  { scope: "." }
                );
                console.log("Service worker registration", registration);

                async function getSubscription() {
                  const convertedKey = urlBase64ToUint8Array("${publicKey}");
                  let subscription = await registration.pushManager.getSubscription();
                  if(!subscription) {
                    subscription = await registration.pushManager.subscribe({
                      userVisibleOnly: true,
                      applicationServerKey: convertedKey
                    });
                  }
                  window._subscription = subscription;
                  console.log("Push Notification Subscribed", subscription);
                }
                if(Notification.permission === "granted") {
                  if(registration.active?.state === "activated") {
                    await getSubscription();
                  } else {
                    navigator.serviceWorker.ready.then((reg) => {
                      getSubscription();
                    });
                  }
                } else {
                  window._subscribeToNotifications = getSubscription;
                }
              } catch (error) {
                console.error(error);
              }
            })();
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <LocationContextProvider>{children}</LocationContextProvider>
        <PwaInstallable />
      </body>
    </html>
  );
}
