import type { IBaseEntity } from './base.interface';
import type { IUser } from './user.interface';

export interface IOrganization extends IBaseEntity {
  name: string;
  user?: IUser[];
}
