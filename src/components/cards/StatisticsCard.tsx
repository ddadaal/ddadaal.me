import * as React from "react";
import withStores from "@/stores/withStores";
import { StatisticsStore } from "@/stores/StatisticsStore";
import lang from "@/i18n/lang";
import { Card, CardHeader, CardBody, CardText, Table } from "reactstrap";
import I18nString from "@/i18n/I18nString";

const root = lang.statistics;

export default withStores(StatisticsStore)(({ useStore }) => {
  const store = useStore(StatisticsStore);

  return (
    <Card>
      <CardHeader>
        <I18nString id={root.title} />
      </CardHeader>
      <CardBody>
        <Table>
          <tbody>
            <tr>
              <th scope="row"><I18nString id={root.articleCount} /></th>
              <td>{store.state.totalArticleCount}</td>
            </tr>
            <tr>
              <th scope="row"><I18nString id={root.lastUpdated} /></th>
              <td>{store.state.lastUpdated}</td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
});
