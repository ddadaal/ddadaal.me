import * as React from "react";
import { Store, StoreProvider, useStore } from "../src/stores/stater";
import { shallow, render, mount } from "enzyme";

interface ITestStore {
  data: number;
}

class TestStore extends Store<ITestStore> {
  constructor() {
    super({ data: 3 });
  }

  increment() {
    this.setState(({ data }) => ({ data: data + 1 }));
  }
}

describe("stater", () => {
  describe("render", () => {
    it("should render without throwing an error", () => {

      function Consumer() {
        const store = useStore(TestStore);
        return (
          <span id="data">{store.state.data}</span>
        );
      }

      const wrapper = mount(
        <StoreProvider stores={[new TestStore()]}>
          <Consumer />
        </StoreProvider>,
      );

      expect(wrapper.find("#data").text()).toEqual("3");

    });
  });
});
