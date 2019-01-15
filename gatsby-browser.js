exports.onServiceWorkerUpdateFound = () => {
  const elements = document.getElementsByClassName("nonewcontent");

  for (const el of elements) {
    el.classList.remove("nonewcontent");
  }

};
