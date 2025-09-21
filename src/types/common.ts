export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalData: number;
  page: number;
  limit: number;
  totalPages: number;
}
