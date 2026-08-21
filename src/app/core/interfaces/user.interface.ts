import { IBaseEntity } from './base.interface';
import { ICallSolution } from './call-solution.interface';
import { JsonValue } from './json.interface';
import { IOrganization } from './organization.interface';
import { ISolution } from './solution.interface';

export interface IUser extends IBaseEntity {
  email: string;
  name: string;
  phone_number: string | null;
  bio: string | null;
  socials: JsonValue;
  address: string | null;
  outreach_link: string | null;
  outreacher: string | null;
  google_image: string | null;
  profile: string | null;
  solutions?: ISolution[];
  calls?: ICallSolution[];
  published_calls?: ICallSolution[];
  roles?: string[];
  organization?: IOrganization | null;
}

export type IUpdateProfilePayload = Partial<IUser>;
