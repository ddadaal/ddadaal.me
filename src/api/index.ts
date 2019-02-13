import { HttpService, HttpServiceType } from "@/api/HttpService";
import AnalyticsService, { AnalyticsServiceMock } from "@/api/AnalyticsService";

export const USE_MOCK = true;

const services = [
  [AnalyticsService, USE_MOCK ? AnalyticsService : AnalyticsServiceMock],
];

const serviceConfig = new Map<HttpServiceType, HttpService>();

services.forEach((item) => {
  serviceConfig.set(item[0], new item[1]());
});

export function useApiService<T extends HttpServiceType>(serviceType: T) {
  return serviceConfig.get(serviceType)! as InstanceType<T>;
}
