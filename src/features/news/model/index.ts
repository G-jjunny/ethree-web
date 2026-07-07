export type {
  NewsItem,
  NewsAdminItem,
  NewsRow,
  NewsListRow,
  NewsDetailRow,
  CreateNewsInput,
  UpdateNewsInput,
  NewsMutationResult,
  UploadNewsImageResult,
} from "./types";

export {
  newsFormSchema,
  tiptapDocSchema,
  slugify,
  EMPTY_DOC,
} from "./schema";
export type { NewsFormValues } from "./schema";
