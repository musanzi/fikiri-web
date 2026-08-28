import { IReview, IReviewData } from '@/app/shared/interfaces';

export interface IReviewPayload {
  data: IReviewData;
  solution: string;
}

export interface IReviewResponse {
  data: IReview;
}

export interface IUpdateReviewCommand {
  id: string;
  payload: IReviewPayload;
}

export interface IReviewState {
  review: IReview | null;
  isSaving: boolean;
  saved: boolean;
  error: string;
}
