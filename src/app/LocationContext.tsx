"use client";
import React, { useContext, useEffect, useState, createContext } from "react";

type LocationState = {
  coords: GeolocationCoordinates | null;
  timestamp: number | null;
  active: boolean;
};

const LocationContext = createContext<LocationState>({
  coords: null,
  timestamp: null,
  active: false,
});

export const useLocation = () => useContext(LocationContext);

const LocationContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<LocationState>({
    coords: null,
    timestamp: null,
    active: false,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      const failedCallback = () => {
        let locationDetails = localStorage.getItem("_lkl");
        if (locationDetails) {
          locationDetails = JSON.parse(locationDetails);
          (locationDetails as any).coords = JSON.parse(
            (locationDetails as any).coords
          );
          setLocation({ ...(locationDetails as any), active: false });
        } else {
          localStorage.removeItem("_lkl");
          setLocation({ coords: null, timestamp: null, active: false });
        }
      };

      const id = navigator.geolocation.watchPosition(
        ({ coords, timestamp }) => {
          console.log({ coords, timestamp });
          setLocation({ coords, timestamp, active: true });
          localStorage.setItem(
            "_lkl",
            JSON.stringify({
              coords: JSON.stringify({
                latitude: coords.latitude,
                longitude: coords.longitude,
              }),
              timestamp,
            })
          );
        },
        failedCallback
      );
      window.addEventListener("offline", failedCallback);
      return () => {
        window.removeEventListener("offline", failedCallback);
        navigator.geolocation.clearWatch(id);
      };
    }
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContextProvider;
