import type { IBaseEntity } from './base.interface';
import type { IUser } from './user.interface';

export interface IRole extends IBaseEntity {
  name: string;
  users?: IUser[];
}
