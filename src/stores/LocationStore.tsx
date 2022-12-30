import React, { useEffect, useState } from "react";
import { useStore } from "simstate";

const decode = decodeURIComponent;

function parseQuery(queryString: string): { [query: string]: string } {
  const query = {};
  const pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");

  pairs.forEach((pair) => {
    const splittedPair = pair.split("=");
    query[decode(splittedPair[0])] = decode(splittedPair[1] || "");

  });

  return query;
}

export default function LocationStore(initialLocation: Location) {
  const [location, setLocation] = useState(initialLocation);

  return {
    location,
    setLocation,
    pathname: location.pathname,
    query: location.search ? parseQuery(location.search) : {},
  };
}

export const LocationProvider: React.FC<{ location: Location }> = ({ location }) => {
  const locationStore = useStore(LocationStore);

  useEffect(() => locationStore.setLocation(location), [location]);

  return null;
};
