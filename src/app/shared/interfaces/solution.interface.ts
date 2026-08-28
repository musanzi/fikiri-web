import type { IBaseEntity } from './base.interface';
import type { ICallSolution } from './call-solution.interface';
import type { IFormResponses } from './form.interface';
import type { IReview } from './review.interface';
import type { ISolutionGallery } from './solution-gallery.interface';
import type { IUser } from './user.interface';

export type SolutionStatus = 'pending' | 'mapped' | 'explored' | 'experimented';

export interface ISolution extends IBaseEntity {
  name: string;
  slug: string;
  description: string;
  problem_solved: string;
  responses: IFormResponses;
  reviewer: string;
  status: SolutionStatus;
  image: string | null;
  reviews: IReview[];
  user: IUser;
  call: ICallSolution;
  award: ICallSolution | null;
  gallery: ISolutionGallery[];
}
