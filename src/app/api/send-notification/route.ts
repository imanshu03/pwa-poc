import { NextRequest, NextResponse } from "next/server";
import webPush from "web-push";

webPush.setVapidDetails(
  "mailto:imanshurathore@gmail.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const dummyPromise = (delay: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), delay * 1000));

export async function POST(req: NextRequest) {
  const { subscription, title, body, delay, action } = await req.json();

  try {
    if (delay > 0) {
      await dummyPromise(delay);
    }
    await webPush.sendNotification(
      subscription,
      JSON.stringify({ title, body, action })
    );
    return NextResponse.json({ message: "Notification Sent" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
