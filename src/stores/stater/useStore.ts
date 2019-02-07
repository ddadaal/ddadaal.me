import { StoreType } from "./Store";
import { ProviderContext } from "./StoreProvider";
import { useContext, useState, useRef, useLayoutEffect } from "react";

export function useStore<ST extends StoreType<any>>(storeType: ST): InstanceType<ST> {
  const providedStores = useContext(ProviderContext);

  const store = providedStores.get(storeType);

  if (!store) {
    throw new Error(`${storeType.name} hasn't been provided.`);
  }

  const [_, update] = useState({}); // dummy state used to cause update

  const { current: listener } = useRef(() => update({})); // create a persistent update function

  // store.unsubscribe(listener);


  useLayoutEffect(() => { // use layout effect to priorize subscription to location update in the top
    store.subscribe(listener);

    return () => {
      store.unsubscribe(listener);
    };
  }, []);

  return store as any;
}
