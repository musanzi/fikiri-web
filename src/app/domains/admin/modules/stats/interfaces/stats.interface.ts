export interface IAdminStats {
  calls: number;
  unpublishedCalls: number;
  publishedCalls: number;
  solutions: number;
  users: number;
}

export interface ISummaryItem {
  title: string;
  description: string;
  icon: string;
  value: number;
}
