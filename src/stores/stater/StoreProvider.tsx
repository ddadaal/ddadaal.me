import React, { createContext } from "react";
import { Store, StoreType } from "./Store";

type IProviderContext = Map<StoreType<any>, Store<any>>;

export const ProviderContext = createContext<IProviderContext>(new Map());

interface Props {
  stores: Store<any>[];
  children: React.ReactNode;
}

export function StoreProvider(props: Props) {

  const map: IProviderContext = new Map();
  props.stores.forEach((store) => {
    map.set(store.constructor as any, store);
  });

  return (
    <ProviderContext.Provider value={map}>
      {props.children}
    </ProviderContext.Provider>
  );
}
