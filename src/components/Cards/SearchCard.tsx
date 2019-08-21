import React from "react";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";
import LocalizedString from "@/i18n/LocalizedString";
import { CardBody } from "reactstrap";
import lang from "@/i18n/lang";
import SearchBar from "@/components/Article/SearchBar/SearchBar";

const root = lang.search;

const SearchCard: React.FC = () => {
  return (
    <BaseCard>
      <BaseCardHeader>
        <span>🔎 <LocalizedString id={root.cardTitle} /></span>
      </BaseCardHeader>
      <CardBody>
        <SearchBar />
      </CardBody>
    </BaseCard>
  );
}

export default SearchCard;
