import { Request, Response, NextFunction } from "express";
import { ReportService } from "./report.service";

export class ReportController {
  private service = new ReportService();

  getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = await this.service.getDashboardMetrics();
      res.status(200).json(metrics);
    } catch (error) {
      next(error);
    }
  };

  exportEquipmentReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pdfBuffer = await this.service.generateEquipmentPdfReport();
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="relatorio_equipamentos.pdf"');
      res.setHeader("Content-Length", pdfBuffer.length);
      
      res.end(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };
}
