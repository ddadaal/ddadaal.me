import { Store } from "simstate";

interface ILocationStore {
  location: Location;
}

function parseQuery(queryString: string) {
  const query = {};
  const pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");

  pairs.forEach((pair) => {
    const splittedPair = pair.split("=");
    query[decodeURIComponent(splittedPair[0])] = decodeURIComponent(splittedPair[1] || "");

  });

  return query;
}

export class LocationStore extends Store<ILocationStore> {
  constructor(location: Location) {
    super();
    this.state = { location };
  }

  get pathname() {
    return this.state.location.pathname;
  }

  updateLocation(location: Location) {
    this.setState({ location });
  }

  get query() {
    if (this.state.location.search) {
      return parseQuery(this.state.location.search);
    } else {
      return {};
    }
  }
}
