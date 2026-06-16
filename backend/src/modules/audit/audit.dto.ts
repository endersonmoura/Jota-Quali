export interface CreateAuditDTO {
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  details?: string;
}

export interface AuditResponseDTO {
  id: number;
  userId: number;
  userName: string;
  action: string;
  resource: string;
  resourceId?: number;
  details?: string;
  createdAt: Date;
}
