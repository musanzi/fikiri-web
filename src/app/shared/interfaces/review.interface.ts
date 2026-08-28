import type { IBaseEntity } from './base.interface';
import type { IFormResponses } from './form.interface';
import type { ISolution } from './solution.interface';

export type IReviewData = IFormResponses;

export interface IReview extends IBaseEntity {
  reviewer: string;
  data: IReviewData;
  solution?: ISolution | null;
}
