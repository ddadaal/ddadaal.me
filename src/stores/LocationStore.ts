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

function parseQuery(queryString: string) {
  var query = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
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

  get pathnameWithoutLanguage() {
    return removeLangFromPath(this.pathname);
  }

  get query() {
    return parseQuery(this.state.location.search.substr(1));
  }
}
