"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Notifications = () => {
  const router = useRouter();
  const [state, setState] = useState({
    title: "",
    body: "",
    delay: 0,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
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
        await window._subscribeToNotifications();
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
      <input
        type="text"
        name="title"
        placeholder="title"
        value={state.title}
        onChange={onChange}
      />
      <input
        type="text"
        name="body"
        placeholder="body"
        value={state.body}
        onChange={onChange}
      />
      <input
        type="number"
        name="delay"
        placeholder="delay"
        value={state.delay}
        onChange={onChange}
      />
      <button onClick={onClick}>Send Notification</button>
      <div className="grow" />
    </div>
  );
};

export default Notifications;
