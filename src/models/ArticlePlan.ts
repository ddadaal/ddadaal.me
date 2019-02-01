export interface ArticlePlan {
  id: string;
  title: string;
  tags: string[];
  startTime: string;
  deadline: string | null;
  pageExists: boolean;
}
