exports.onServiceWorkerUpdateFound = () => {
  window.addEventListener("load", () => {
    const elem = document.getElementById("new-content-pop");
    elem.classList.add("new-content");
  });

};
