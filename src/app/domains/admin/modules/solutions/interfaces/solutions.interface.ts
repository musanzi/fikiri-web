import type { IReview, ISolution, SolutionStatus } from '@/app/shared/interfaces';

export interface QueryParams {
  page?: string | null;
  q?: string | null;
  call?: string | null;
  limit?: string | null;
}

export interface IUpdateSolutionPayload {
  status: SolutionStatus;
}

export interface IAwardSolutionState {
  awardingSolutionId: string;
  updatedSolutions: ISolution[];
  error: string;
  isSaved: boolean;
}

export interface IAwardSolutionResponse {
  data: ISolution;
}

export interface ISolutionAnswerView {
  label: string;
  value: string;
}

export interface ISolutionReviewView {
  review: IReview;
  answers: ISolutionAnswerView[];
}
