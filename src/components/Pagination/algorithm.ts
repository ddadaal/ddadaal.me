// https://github.com/deoxxa/paginator
export function calculatePagingInfo(
  resultsPerPage: number,
  linksCount: number,
  totalResults: number,
  currentPage: number,
) {
  // We want the number of pages, rounded up to the nearest page.
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Obviously we can't be on a negative or 0 page.
  if (currentPage < 1) { currentPage = 1; }
  // If the user has done something like /page/99999 we want to clamp that back
  // down.
  if (currentPage > totalPages) { currentPage =totalPages; }

  // This is the first page to be displayed as a numbered link.
  let firstPage = Math.max(1, currentPage - Math.floor(linksCount / 2));

  // And here's the last page to be displayed specifically.
  let lastPage = Math.min(totalPages, currentPage + Math.floor(linksCount / 2));

  // This is triggered if we're at or near one of the extremes; we won't have
  // enough page links. We need to adjust our bounds accordingly.
  if (lastPage - firstPage + 1 < linksCount)  {
    if (currentPage < (totalPages / 2)) {
      lastPage = Math.min(totalPages, lastPage + (linksCount - (lastPage - firstPage)));
    } else {
      firstPage = Math.max(1, firstPage - (linksCount - (lastPage - firstPage)));
    }
  }

  // This can be triggered if the user wants an odd number of pages.
  if (lastPage - firstPage + 1 > linksCount) {
    // We want to move towards whatever extreme we're closest to at the time.
    if (currentPage > (totalPages / 2)) {
      firstPage++;
    } else {
      lastPage--;
    }
  }

  // First result on the page. This, along with the field below, can be used to
  // do "showing x to y of z results" style things.
  let firstResult = resultsPerPage * (currentPage - 1);
  if (firstResult < 0) { firstResult = 0; }

  // Last result on the page.
  let lastResult = (resultsPerPage * currentPage) - 1;
  if (lastResult < 0) { lastResult = 0; }
  if (lastResult > Math.max(totalResults - 1, 0)) {
    lastResult = Math.max(totalResults - 1, 0);
  }

  // GIMME THAT OBJECT
  return {
    totalPages: totalPages,
    pages: Math.min(lastPage - firstPage + 1, totalPages),
    currentPage: currentPage,
    firstPage: firstPage,
    lastPage: lastPage,
    previousPage: currentPage - 1,
    nextPage: currentPage + 1,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
    totalResultsCount: totalResults,
    results: Math.min(lastResult - firstResult + 1, totalResults),
    firstResult: firstResult,
    lastResult: lastResult,
  };
}
