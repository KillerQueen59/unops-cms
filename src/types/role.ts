export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RoleApiResponse {
  status: boolean;
  message: string;
  data: {
    roles: Array<{
      _id: string;
      name: string;
      description?: string;
      createdAt: string;
      updatedAt?: string;
    }>;
    totalData: number;
  };
}
