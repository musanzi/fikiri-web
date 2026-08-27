import { IBaseEntity } from './base.interface';
import { ICallRequirement } from './requirements.interface';
import { ICallContactInfo } from './contact-info.interface';
import { IForm } from './form.interface';
import { IReviewer } from './reviewer.interface';
import { ISolution } from './solution.interface';
import { IUser } from './user.interface';

export interface ICallSolution extends IBaseEntity {
  name: string;
  slug: string;
  description: string;
  ended_at: string;
  started_at: string;
  cover: string | null;
  form: IForm[];
  review_form: IForm[];
  reviewers: IReviewer[];
  requirements: ICallRequirement[];
  contact_form: ICallContactInfo;
  author: IUser | null;
  awards?: ISolution[];
}
