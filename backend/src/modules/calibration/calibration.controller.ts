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
      // O 'userId' vem injetado do Middleware de Autenticação em 'res.locals.user'
      const userIdFromToken = res.locals.user?.id ? Number(res.locals.user.id) : undefined;
      const solicitanteId = userIdFromToken || req.body.solicitanteId || 1;

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
      const userIdFromToken = res.locals.user?.id ? Number(res.locals.user.id) : undefined;
      const calibradorId = userIdFromToken || req.body.calibradorId || 1;

      const calibracaoId = await this.service.registrarCalibracaoInterna({
        ...req.body,
        calibradorId,
      });
      res.status(201).json({ success: true, data: { calibracaoId } });
    } catch (error) {
      next(error);
    }
  };

  public getUltimaCalibracao = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { equipamentoId } = req.params;
      const data = await this.service.getUltimaCalibracao(Number(equipamentoId));
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}
