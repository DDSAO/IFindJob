export type Job = {
  id?: number | null;
  company: string;
  position: string;
  jobDescription: string;
  coverLetter?: string | null;

  createdAt?: number | null;
};

export const EMPTY_JOB: Job = {
  company: "",
  position: "",
  jobDescription: "",
};

export type JobFilters = {
  id?: number | null;
  company?: string | null;
  position?: string | null;
  jobDescription?: string | null;

  page_no: number;
  page_num: number;
};

export const EMPTY_JOB_FILTER: JobFilters = {
  page_no: 1,
  page_num: 20,
};
