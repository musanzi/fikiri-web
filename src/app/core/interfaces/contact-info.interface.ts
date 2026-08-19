export interface ICallContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface ICallContactInfo extends ICallContact {
  contacts?: ICallContact[];
  links: { label: string; url: string }[];
}
