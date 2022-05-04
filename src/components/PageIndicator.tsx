import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

import range from "@/utils/Array";

interface Props {
  pageCount: number;
  pageIndex: number; // starts with 0
  toPage(pageNum: number): () => void;
}

const PageIndicator: React.FC<Props> = (props) => {
  const { pageCount, pageIndex, toPage } = props;

  return (
    <Pagination>
      <PaginationItem>
        <PaginationLink
          disabled={pageCount === 0 || pageIndex === 0}
          previous={true}
          onClick={toPage(pageIndex - 1)}
        />
      </PaginationItem>
      {range(0, pageCount).map((x) =>
        <PaginationItem active={pageIndex === x} key={x}>
          <PaginationLink onClick={toPage(x)}>
            {x + 1}
          </PaginationLink>
        </PaginationItem>,
      )}
      <PaginationItem>
        <PaginationLink
          disabled={pageCount === 0 || pageIndex === pageCount - 1}
          next={true}
          onClick={toPage(pageIndex + 1)}
        />
      </PaginationItem>

    </Pagination>
  );
};

export default PageIndicator;
