"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { set } from "lodash";

const Notifications = () => {
  const router = useRouter();
  const [state, setState] = useState({
    title: "",
    body: "",
    delay: 0,
    action: {
      title: "",
      href: "",
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    set(state, name, value);
    setState({ ...state });
  };

  const onClick = async () => {
    console.log(window._subscription);
    try {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...state,
          delay: parseInt(`${state.delay}`),
          subscription: window._subscription,
        }),
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const allowNotification = () => {
    Notification.requestPermission().then(async (result) => {
      if (result === "granted") {
        await window._subscribeToNotifications?.();
      }
    });
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-start px-2 py-6 gap-4">
      <div className="flex w-full items-center justify-between">
        <button onClick={() => router.back()}>back</button>
        <button onClick={allowNotification}>Allow Notifications</button>
      </div>
      <div className="grow" />
      <div className="flex flex-col items-stretch justify-start gap-2 w-[80%]">
        <label>Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter notification title"
          value={state.title}
          onChange={onChange}
          className="border p-2"
        />
      </div>
      <div className="flex flex-col items-stretch justify-start gap-2 w-[80%]">
        <label>Body</label>
        <input
          type="text"
          name="body"
          placeholder="Enter notification body"
          value={state.body}
          onChange={onChange}
          className="border p-2"
        />
      </div>
      <div className="flex flex-col items-stretch justify-start gap-2 w-[80%]">
        <label>Action</label>
        <input
          type="text"
          name="action.title"
          placeholder="Enter action title"
          value={state.action.title}
          onChange={onChange}
          className="border p-2"
        />
        <input
          type="text"
          name="action.href"
          placeholder="Enter action link"
          value={state.action.href}
          onChange={onChange}
          className="border p-2"
        />
      </div>
      <div className="flex flex-col items-stretch justify-start gap-2 w-[80%]">
        <label>Delay</label>
        <input
          type="number"
          name="delay"
          placeholder="Enter delay"
          value={state.delay}
          onChange={onChange}
          className="border p-2"
        />
      </div>

      <button onClick={onClick} className="border p-4 bg-black text-white">
        Send Notification
      </button>
      <div className="grow" />
    </div>
  );
};

export default Notifications;
