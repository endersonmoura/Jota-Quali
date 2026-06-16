import { Request, Response, NextFunction } from "express";
import { DocumentService } from "./document.service";
import { UploadLaudoDTO, AssinarDocumentoDTO } from "./document.dto";

import { uploadBufferToR2 } from "../../utils/cloudflare";
import AppError from "../../errors/AppError";

export class DocumentController {
  private service = new DocumentService();

  public listarDocumentos = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const documentos = await this.service.listarDocumentos();
      // Format response to match expected frontend structure
      const formattedData = documentos.map(doc => {
        const eq = doc.equipamento || doc.calibracao?.equipamento;
        return {
          id: doc.id,
          tipoDocumental: doc.tipoDocumental,
          dataEmissao: doc.dataEmissao,
          dataVencimento: doc.dataVencimento,
          laboratorio: doc.laboratorio,
          statusAssinatura: doc.statusAssinatura,
          status: doc.statusAssinatura ? "assinado" : "aguardando_assinatura", // derived from statusAssinatura
          pathArquivo: doc.pathArquivo,
          criadoEm: doc.criadoEm,
          atualizadoEm: doc.atualizadoEm,
          equipamento: eq ? {
            id: eq.id,
            codigo: eq.codigo,
            descricao: eq.descricao,
            tipo: eq.tipo,
            obraId: eq.obra?.id,
          } : null,
        };
      });
      res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
      next(error);
    }
  };

  public getDocumentoById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const documentoId = Number(req.params.id);
      const doc = await this.service.getDocumentoById(documentoId);
      const eq = doc.equipamento || doc.calibracao?.equipamento;
      const formattedData = {
          id: doc.id,
          tipoDocumental: doc.tipoDocumental,
          dataEmissao: doc.dataEmissao,
          dataVencimento: doc.dataVencimento,
          laboratorio: doc.laboratorio,
          statusAssinatura: doc.statusAssinatura,
          status: doc.statusAssinatura ? "assinado" : "aguardando_assinatura",
          pathArquivo: doc.pathArquivo,
          criadoEm: doc.criadoEm,
          atualizadoEm: doc.atualizadoEm,
          equipamento: eq ? {
            id: eq.id,
            codigo: eq.codigo,
            descricao: eq.descricao,
            tipo: eq.tipo,
            obraId: eq.obra?.id,
          } : null,
      };

      res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
      next(error);
    }
  };

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
      if (!req.file) {
        throw new AppError("Nenhum arquivo assinado foi enviado.", 400);
      }

      // Faz o upload real pro Cloudflare R2
      const pathArquivoAssinado = await uploadBufferToR2(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      const userIdFromToken = res.locals.user?.id ? Number(res.locals.user.id) : undefined;
      const assinanteId = userIdFromToken || 1;

      await this.service.assinarDocumento({
        documentoId: req.body.documentoId,
        assinanteId,
        ipOrigem: req.ip,
        pathArquivoAssinado,
      });
      res.status(200).json({ success: true, message: "Documento assinado com sucesso.", url: pathArquivoAssinado });
    } catch (error) {
      next(error);
    }
  };

  public excluirDocumento = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const documentoId = Number(req.params.id);
      const userIdFromToken = res.locals.user?.id ? Number(res.locals.user.id) : 1;
      
      await this.service.excluirDocumento(documentoId, userIdFromToken);
      res.status(200).json({ success: true, message: "Documento excluído com sucesso." });
    } catch (error) {
      next(error);
    }
  };
}
