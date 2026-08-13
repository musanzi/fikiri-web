import type { IBaseEntity } from './base.interface';
import type { ICallSolution } from './call-solution.interface';
import type { JsonValue } from './json.interface';
import type { IOrganization } from './organization.interface';
import type { IRole } from './role.interface';
import type { ISolution } from './solution.interface';

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
  roles?: IRole[];
  organization?: IOrganization | null;
}
