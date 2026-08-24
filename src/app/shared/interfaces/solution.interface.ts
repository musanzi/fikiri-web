import type { IBaseEntity } from './base.interface';
import type { ICallSolution } from './call-solution.interface';
import type { JsonValue } from './json.interface';
import type { IReview } from './review.interface';
import type { ISolutionGallery } from './solution-gallery.interface';
import type { IUser } from './user.interface';

export type SolutionStatus = 'pending' | 'mapped' | 'explored' | 'experimented';

export interface ISolution extends IBaseEntity {
  name: string;
  slug: string;
  description: string;
  problem_solved: string;
  responses: Record<string, JsonValue>;
  reviewer: string;
  status: SolutionStatus;
  image: string | null;
  reviews: IReview[];
  user: IUser;
  call: ICallSolution;
  award: ICallSolution | null;
  gallery: ISolutionGallery[];
}
