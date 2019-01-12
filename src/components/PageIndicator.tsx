import * as React from "react";
import { navigate} from "gatsby";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { range } from "@/utils/Array";


function toPage(pageIndex: number) {
  const path = "/" + (pageIndex === 1 ? "" : pageIndex);
  return () => navigate(path);
}

export default function PageIndicator(props: { pageCount: number, current: number }) {
  const { pageCount, current } = props;

  return (
    <Pagination aria-label="Page">
      <PaginationItem>
        <PaginationLink disabled={current === 1} previous={true} onClick={toPage(current - 1)} />
      </PaginationItem>
      {range(1, pageCount + 1).map((x) =>
        <PaginationItem active={current === x} key={x}>
          <PaginationLink onClick={toPage(x)}>
            {x}
          </PaginationLink>
        </PaginationItem>
      )}
      <PaginationItem>
        <PaginationLink disabled={current === pageCount} next={true} onClick={toPage(current + 1)} />
      </PaginationItem>
    </Pagination>
  );
}
