import type { IBaseEntity } from './base.interface';
import type { ICallSolution } from './call-solution.interface';

export interface ICallGallery extends IBaseEntity {
  image: string;
  call: ICallSolution;
}
