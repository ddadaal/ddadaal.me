exports.onServiceWorkerUpdateFound = () => {
  const elements = document.getElementsByClassName("newcontentpop");

  if (elements.length > 0) {
    elements[0].classList.remove("no-display");
  }

};
