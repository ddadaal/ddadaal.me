import { Store } from "simstate";

interface State {
  location: Location;
}

function parseQuery(queryString: string): { [query: string]: string } {
  const query = {};
  const pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");

  pairs.forEach((pair) => {
    const splittedPair = pair.split("=");
    query[decodeURIComponent(splittedPair[0])] = decodeURIComponent(splittedPair[1] || "");

  });

  return query;
}

export class LocationStore extends Store<State> {
  constructor(location: Location) {
    super();
    this.state = { location };
  }

  get pathname(): string {
    return this.state.location.pathname;
  }

  updateLocation(location: Location): void {
    this.setState({ location });
  }

  get query(): { [query: string]: string } {
    if (this.state.location.search) {
      return parseQuery(this.state.location.search);
    } else {
      return {};
    }
  }
}
