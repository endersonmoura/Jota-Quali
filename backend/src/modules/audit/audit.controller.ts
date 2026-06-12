import { Request, Response, NextFunction } from "express";
import { AuditService } from "./audit.service";

export class AuditController {
  private service = new AuditService();

  /**
   * RF05: Obter histórico de auditoria (para a tabela do front-end)
   */
  public getLogs = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const resourceIdParam = req.query.resourceId as string | undefined;
      const resourceId = resourceIdParam ? Number(resourceIdParam) : undefined;
      const logs = await this.service.getLogs(resourceId);
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  };
}
