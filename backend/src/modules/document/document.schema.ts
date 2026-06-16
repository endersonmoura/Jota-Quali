import { z } from "zod";

export const uploadLaudoSchema = z.object({
  body: z.object({
    equipamentoId: z.number({ required_error: "ID do equipamento é obrigatório" }),
    solicitacaoId: z.number().optional(),
    laboratorio: z.string({ required_error: "Laboratório é obrigatório" }),
    dataEmissao: z.string().datetime().transform((str) => new Date(str)),
    dataValidade: z.string().datetime().transform((str) => new Date(str)),
    pathArquivo: z.string().url("URL do arquivo inválida"), // Simplificando upload como URL
  }),
});

export const assinarDocumentoSchema = z.object({
  body: z.object({
    documentoId: z.coerce.number({ required_error: "ID do documento é obrigatório" }),
  }),
});
