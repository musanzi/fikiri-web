import type { IBaseEntity } from './base.interface';
import type { ICallGallery } from './call-gallery.interface';
import type { IForm } from './form.interface';
import type { JsonValue } from './json.interface';
import type { IPartner } from './partner.interface';
import type { IReviewer } from './reviewer.interface';
import type { ISolution } from './solution.interface';
import type { IUser } from './user.interface';

export interface ICallSolution extends IBaseEntity {
  name: string;
  slug: string | null;
  description: string;
  ended_at: string;
  started_at: string;
  published_at: string | null;
  cover: string | null;
  document: string | null;
  form: JsonValue;
  review_form: IForm[] | null;
  reviewers: IReviewer[] | null;
  requirements: JsonValue;
  contact_form: JsonValue;
  author?: IUser | null;
  publisher?: IUser | null;
  partners?: IPartner[];
  awards?: ISolution[];
  solutions?: ISolution[];
  gallery?: ICallGallery[];
}
