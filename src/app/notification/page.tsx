"use client";
import React, { useState } from "react";

const Notifications = () => {
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

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center px-2 py-6 gap-4">
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
    </div>
  );
};

export default Notifications;
