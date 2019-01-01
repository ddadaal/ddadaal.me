import Store from "./Store";
import { Statistics } from "@/models/Statistics";

interface IStatisticsStore  extends Statistics {
}

export class StatisticsStore extends Store<IStatisticsStore> {
  constructor(statistics: IStatisticsStore) {
    super();
    this.state = statistics;
  }


}
