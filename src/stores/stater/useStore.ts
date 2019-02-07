import { StoreType } from "./Store";
import { ProviderContext } from "./StoreProvider";
import React, { useContext, useEffect, useState } from "react";

export function useStore<ST extends StoreType<any>>(storeType: ST): InstanceType<ST> {
  const providedStores = useContext(ProviderContext);

  const store = providedStores.get(storeType);

  if (!store) {
    throw new Error(`${storeType} hasn't been provided.`);
  }

  const [_, update] = useState({}); // dummy state used to cause update

  const [listener, setListener] = useState(() => () => { // save the listener to unsubscribe
    update({}); // have to create a new object since React won't update if the state doesn't change
  });

  store.unsubscribe(listener);
  store.subscribe(listener);


  useEffect(() => {
    return () => {
      store.unsubscribe(listener);
    };
  }, []);

  return store as any;
}
