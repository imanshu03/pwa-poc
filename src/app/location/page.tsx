"use client";
import React from "react";
import { useLocation } from "../LocationContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";

dayjs.extend(utc);

const LocationPage = () => {
  const location = useLocation();
  const router = useRouter();

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center px-2 py-6 gap-2">
      <button onClick={() => router.back()} className="self-start">
        back
      </button>
      <div className="grow" />
      <h1 className="text-2xl">Current Location</h1>
      <p>Latitude: {location.coords?.latitude}</p>
      <p>Longitude: {location.coords?.longitude}</p>
      <p>
        Last updated at:&nbsp;
        {typeof location.timestamp === "number"
          ? dayjs(location.timestamp).format("hh:mm:ss A, DD/MM/YYYY")
          : "NA"}
      </p>
      <p>Live: {String(location.active)}</p>
      <div className="grow" />
    </div>
  );
};

export default LocationPage;
