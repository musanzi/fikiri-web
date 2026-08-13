import type { IBaseEntity } from './base.interface';
import type { ICallSolution } from './call-solution.interface';

export type PartnerType = 'standard' | 'program_specific';

export interface IPartner extends IBaseEntity {
  name: string;
  link: string | null;
  logo: string | null;
  type: PartnerType;
  call?: ICallSolution | null;
}
