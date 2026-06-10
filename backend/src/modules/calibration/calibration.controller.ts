import { Request, Response, NextFunction } from "express";
import { CalibrationService } from "./calibration.service";
import {
  SolicitarCalibracaoDTO,
  RegistrarCalibracaoInternaDTO,
} from "./calibration.dto";

export class CalibrationController {
  private service = new CalibrationService();

  public solicitarCalibracao = async (
    req: Request<unknown, unknown, SolicitarCalibracaoDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // O 'userId' geralmente vem injetado de um Middleware de Autenticação em 'req.user'
      const solicitanteId = (req as any).user?.id || req.body.solicitanteId;

      const solicitacaoId = await this.service.solicitarCalibracao({
        ...req.body,
        solicitanteId,
      });
      res.status(201).json({ success: true, data: { solicitacaoId } });
    } catch (error) {
      next(error);
    }
  };

  public registrarCalibracaoInterna = async (
    req: Request<unknown, unknown, RegistrarCalibracaoInternaDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const calibradorId = (req as any).user?.id || req.body.calibradorId;

      const calibracaoId = await this.service.registrarCalibracaoInterna({
        ...req.body,
        calibradorId,
      });
      res.status(201).json({ success: true, data: { calibracaoId } });
    } catch (error) {
      next(error);
    }
  };
}
