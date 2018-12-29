import { Subscribe } from "unstated";
import * as React from "react";
import { StoreType } from "./Store";

export interface WithStoresProps {
  useStore: <CT extends StoreType<any>>(containerType: CT) => InstanceType<CT>;
}

export default function withStores(...stores: Array<StoreType<any>>) {
  return <P extends {}>(WrappedComponent: React.ComponentType<P & WithStoresProps>): React.ComponentType<Omit<P, keyof WithStoresProps>> => {

    const Component = (props: P) => (
      <Subscribe to={stores}>
        {(...injectedStores) => {
          const useStore = (containerType: StoreType<any>) => injectedStores.find((x) => x instanceof containerType) as any;

          return (
            <WrappedComponent
              useStore={useStore}
              {...props}
            />
          );
        }

        }
      </Subscribe>
    );

    return Component as any;
  };
}
