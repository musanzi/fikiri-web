import { ICallSolution, IForm } from '@/app/core/interfaces';

export interface CallRequirement {
  title: string;
  description: string;
}

export interface CallUsefulLink {
  label: string;
  url: string;
}

export interface CallContactInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  links: CallUsefulLink[];
}

export interface SubmissionCall extends Omit<ICallSolution, 'contact_form' | 'form' | 'requirements'> {
  contact_form: CallContactInfo | null;
  form: IForm[] | null;
  requirements: CallRequirement[] | null;
}

export interface CurrentCallsResponse {
  data: ICallSolution[];
}

export interface SubmissionCallResponse {
  data: SubmissionCall;
}

export interface SubmissionAnswerOption {
  label: string;
  value: string;
  checked: boolean;
}

export interface SubmissionAnswer {
  name: string;
  type: string;
  required: boolean;
  value: string;
  options: SubmissionAnswerOption[];
}

export interface SubmissionAnswersModel {
  answers: SubmissionAnswer[];
}

export interface CallSelectionModel {
  call: string;
}

export interface SolutionDetailsModel {
  name: string;
  description: string;
  problem_solved: string;
}

export interface CreateSolutionPayload {
  call: string;
  name: string;
  description: string;
  problem_solved: string;
  responses: Record<string, string | string[]>;
}
