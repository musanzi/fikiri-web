export interface IQueryParams {
  page: number;
  q: string;
}

export interface IOutreacher {
  id: string;
  name: string;
  email: string;
  profile: string | null;
  google_image: string | null;
  outreachCount: number;
}
