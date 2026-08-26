import type { ICreateSolutionPayload } from '@/app/domains/website/modules/submissions/interfaces/submission.interface';

export type IUpdateSolutionPayload = Partial<ICreateSolutionPayload>;
