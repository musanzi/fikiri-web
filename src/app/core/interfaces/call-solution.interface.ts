import { IBaseEntity } from './base.interface';
import { ICallGallery } from './call-gallery.interface';
import { ICallRequirement } from './call-requirements.interface';
import { ICallContactInfo } from './contact-info.interface';
import { IForm } from './form.interface';
import { IPartner } from './partner.interface';
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
  document: string | null;
  form: IForm[];
  review_form: IForm[];
  reviewers: IReviewer[] | null;
  requirements: ICallRequirement[];
  contact_form: ICallContactInfo;
  author: IUser | null;
  publisher?: IUser | null;
  partners?: IPartner[];
  awards?: ISolution[];
  solutions?: ISolution[];
  gallery?: ICallGallery[];
}
