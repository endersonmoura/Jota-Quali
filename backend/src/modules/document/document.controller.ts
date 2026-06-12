import { Request, Response, NextFunction } from "express";
import { DocumentService } from "./document.service";
import { UploadLaudoDTO, AssinarDocumentoDTO } from "./document.dto";

import { uploadBufferToR2 } from "../../utils/cloudflare";
import AppError from "../../errors/AppError";

export class DocumentController {
  private service = new DocumentService();

  public uploadLaudo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.file) {
        throw new AppError("Nenhum arquivo enviado.", 400);
      }

      // Faz o upload real pro Cloudflare R2
      const pathArquivo = await uploadBufferToR2(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Os outros campos vêm como texto no req.body pelo form-data
      const data: UploadLaudoDTO = {
        equipamentoId: Number(req.body.equipamentoId),
        solicitacaoId: req.body.solicitacaoId ? Number(req.body.solicitacaoId) : undefined,
        laboratorio: req.body.laboratorio,
        dataEmissao: new Date(req.body.dataEmissao),
        dataValidade: new Date(req.body.dataValidade),
        pathArquivo,
      };

      const documentoId = await this.service.uploadLaudo(data);
      res.status(201).json({ success: true, data: { documentoId, url: pathArquivo } });
    } catch (error) {
      next(error);
    }
  };

  public assinarDocumento = async (
    req: Request<unknown, unknown, { documentoId: number }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userIdFromToken = res.locals.user?.id ? Number(res.locals.user.id) : undefined;
      const assinanteId = userIdFromToken || 1; // Fallback temporario

      await this.service.assinarDocumento({
        documentoId: req.body.documentoId,
        assinanteId,
        ipOrigem: req.ip,
      });
      res.status(200).json({ success: true, message: "Documento assinado com sucesso." });
    } catch (error) {
      next(error);
    }
  };
}
