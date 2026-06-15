import { z } from "zod";

export const uploadLaudoSchema = z.object({
  body: z.object({
    equipamentoId: z.number(),
    solicitacaoId: z.number().optional(),
    laboratorio: z.string(),
    dataEmissao: z.string().datetime().transform((str) => new Date(str)),
    dataValidade: z.string().datetime().transform((str) => new Date(str)),
    pathArquivo: z.string().url("URL do arquivo inválida"), // Simplificando upload como URL
  }),
});

export const assinarDocumentoSchema = z.object({
  body: z.object({
    documentoId: z.number(),
  }),
});

