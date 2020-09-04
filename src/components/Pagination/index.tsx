import React from "react";
import { calculatePagingInfo } from "./algorithm";
import { range } from "src/utils/array";
import { PageLink } from "./Page";
import { Box } from "grommet";
import { UrlObject } from "url";

interface Props {
  currentPage: number;
  itemsPerPage: number;
  totalItemsCount: number;
  linksCount?: number;
  getUrl?: (pageNumber: number) => string | UrlObject;
  onPageClicked?: (page: number) => void;
}

const prevPageText= "⟨";
const firstPageText= "«";
const nextPageText= "⟩";
const lastPageText= "»";

export const Pagination: React.FC<Props> = ({
  currentPage,
  itemsPerPage,
  totalItemsCount,
  linksCount = 5,
  getUrl,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPageClicked = () => {},
}) => {
  const info = calculatePagingInfo(
    itemsPerPage,
    linksCount,
    totalItemsCount,
    currentPage
  );

  const links = range(info.firstPage, info.lastPage + 1)
    .map((i) => (
      <PageLink
        key={i}
        active={i === currentPage}
        onClick={onPageClicked}
        pageNumber={i}
        href={getUrl?.(i)}
        text={i+""}
      />
    ));

  links.unshift(
    <PageLink
      active={false}
      key={`prev ${info.previousPage}`}
      href={getUrl?.(info.previousPage)}
      onClick={onPageClicked}
      disabled={!info.hasPreviousPage}
      text={prevPageText}
      pageNumber={info.previousPage}
    />
  );

  links.unshift(
    <PageLink
      active={false}
      key={"first"}
      onClick={onPageClicked}
      href={getUrl?.(1)}
      disabled={!info.hasPreviousPage}
      text={firstPageText}
      pageNumber={1}
    />
  );

  links.push(
    <PageLink
      active={false}
      key={`next ${info.nextPage}`}
      onClick={onPageClicked}
      disabled={!info.hasNextPage}
      href={getUrl?.(info.nextPage)}
      text={nextPageText}
      pageNumber={info.nextPage}
    />
  );

  links.push(
    <PageLink
      active={false}
      key={"last"}
      onClick={onPageClicked}
      disabled={!info.hasNextPage}
      text={lastPageText}
      href={getUrl?.(info.lastPage)}
      pageNumber={info.lastPage}
    />
  );

  return (
    <Box direction="row" >
      {links}
    </Box>
  );


};
