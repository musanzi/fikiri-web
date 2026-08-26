export type ICallLifecycle = 'upcoming' | 'active' | 'closed';
export type IStatsEntity = 'call' | 'solution' | 'user';
export enum SolutionStatus {
  PENDING = 'pending',
  MAPPED = 'mapped',
  EXPLORED = 'explored',
  EXPERIMENTED = 'experimented'
}

export interface ICountBreakdown<T extends string> {
  key: T;
  label: string;
  count: number;
  percentage: number;
}

export interface IGrowthMetric {
  currentPeriod: number;
  previousPeriod: number;
  percentageChange: number | null;
}

export interface IMonthlyStats {
  period: string;
  label: string;
  calls: number;
  solutions: number;
  users: number;
}

export interface ICallPerformance {
  id: string;
  name: string;
  lifecycle: ICallLifecycle;
  submissions: number;
  awards: number;
  startedAt: Date;
  endedAt: Date;
}

export interface IAdminStats {
  generatedAt: string;
  range: {
    months: number;
    from: string;
    to: string;
  };
  overview: {
    calls: {
      total: number;
      published: number;
      unpublished: number;
      upcoming: number;
      active: number;
      closed: number;
    };
    solutions: {
      total: number;
      assignedForReview: number;
      unassignedForReview: number;
      awarded: number;
    };
    users: {
      total: number;
    };
    rates: {
      submissionsPerPublishedCall: number;
      reviewAssignment: number;
      mappedSolutions: number;
    };
  };
  growth: Record<IStatsEntity, IGrowthMetric>;
  trends: {
    monthly: IMonthlyStats[];
  };
  breakdowns: {
    callsByLifecycle: ICountBreakdown<ICallLifecycle>[];
    solutionsByStatus: ICountBreakdown<SolutionStatus>[];
  };
  topCalls: ICallPerformance[];
}
