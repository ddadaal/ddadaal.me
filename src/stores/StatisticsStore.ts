import { Store } from "@/stores/stater";
import { Statistics } from "@/models/Statistics";

interface IStatisticsStore  extends Statistics {
}

export class StatisticsStore extends Store<IStatisticsStore> {
  constructor(statistics: IStatisticsStore) {
    super(statistics);
  }
}
