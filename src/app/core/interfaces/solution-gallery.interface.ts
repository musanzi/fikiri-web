import type { IBaseEntity } from './base.interface';
import type { ISolution } from './solution.interface';

export interface ISolutionGallery extends IBaseEntity {
  image: string;
  solution?: ISolution | null;
}
