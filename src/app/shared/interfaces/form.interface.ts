export type IQuestionType = 'text' | 'textarea' | 'email' | 'number' | 'date' | 'select' | 'radio' | 'checkbox';

export interface IQuestionTypeOption {
  value: IQuestionType;
  label: string;
}

export const OPTION_TYPES = new Set<IQuestionType>(['select', 'radio', 'checkbox']);

export interface FormAnswerOption {
  label: string;
  value: string;
  checked: boolean;
}

export interface FormAnswer {
  name: string;
  type: string;
  required: boolean;
  value: string;
  options: FormAnswerOption[];
}

export interface FormAnswersModel {
  answers: FormAnswer[];
}
