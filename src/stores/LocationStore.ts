import Store from "./Store";

interface ILocationStore {
  location: Location;
}

export function removeLangFromPath(pathname: string) {
  let i = 0, slashCount = 0;
  while (slashCount < 2 && i < pathname.length) {
    if (pathname[i] === '/') {
      slashCount++;
    }
    i++;
  }
  return pathname.substring(i - 1);
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

  get pathnameWithoutLanguage() {
    return removeLangFromPath(this.pathname);
  }
}
