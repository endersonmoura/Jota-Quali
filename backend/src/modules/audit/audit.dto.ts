export interface CreateAuditDTO {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
}

export interface AuditResponseDTO {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  createdAt: Date;
}
