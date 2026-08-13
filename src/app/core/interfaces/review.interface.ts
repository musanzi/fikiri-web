import type { IBaseEntity } from './base.interface';
import type { JsonValue } from './json.interface';
import type { ISolution } from './solution.interface';

export interface IReview extends IBaseEntity {
  reviewer: string;
  data: JsonValue;
  solution?: ISolution | null;
}
