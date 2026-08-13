import type { IBaseEntity } from './base.interface';
import type { ICallSolution } from './call-solution.interface';
import type { JsonValue } from './json.interface';
import type { IReview } from './review.interface';
import type { ISolutionGallery } from './solution-gallery.interface';
import type { IUser } from './user.interface';

export type SolutionStatus = 'pending' | 'mapped' | 'explored' | 'experimented';

export interface ISolution extends IBaseEntity {
  name: string | null;
  slug: string | null;
  description: string | null;
  problem_solved: string | null;
  responses: Record<string, JsonValue>;
  reviewer: string | null;
  status: SolutionStatus;
  image: string | null;
  reviews?: IReview[];
  user?: IUser | null;
  call?: ICallSolution | null;
  award?: ICallSolution | null;
  gallery?: ISolutionGallery[];
}
