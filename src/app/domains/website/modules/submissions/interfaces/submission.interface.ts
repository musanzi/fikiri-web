export interface ISolutionDetailsModel {
  name: string;
  description: string;
  problem_solved: string;
}

export interface ICreateSolutionPayload {
  call: string;
  name: string;
  description: string;
  problem_solved: string;
  responses: Record<string, string | string[]>;
}
