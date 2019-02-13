import { HttpService } from "@/api/HttpService";

export default class AnalyticsService extends HttpService {
  async getTotalVisits(): Promise<number> {
    return 3;
  }
}

export class AnalyticsServiceMock extends AnalyticsService {
  async getTotalVisits(): Promise<number> {
    return 3;
  }
}
