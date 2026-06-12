import { z } from "zod";

const STATUS_ENUM = z.enum([
  "disponivel", "indisponivel", "vencido", 
  "pendente_assinatura", "pendente_documento", 
  "calibracao_solicitada", "em_calibracao", "em_manutencao"
]);

export const createEquipmentSchema = z.object({
  body: z.object({
    descricao: z.string().min(1, "A descrição não pode ser vazia."),
    codigo: z.string().min(1, "O código não pode ser vazio."),
    tipo: z.string().optional(),
    obraId: z.number().optional(),
    status: STATUS_ENUM.optional(),
    situacaoDocumental: z.enum(["regular", "pendente", "irregular"]).optional(),
    dataCadastro: z.coerce.date().optional(),
    dataUltimaCalibracao: z.coerce.date().optional(),
    dataVencimentoCalibracao: z.coerce.date().optional(),
  }),
});

export const updateEquipmentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "O ID do equipamento deve ser numérico."),
  }),
  body: z.object({
    descricao: z.string().min(1).optional(),
    codigo: z.string().min(1).optional(),
    tipo: z.string().optional(),
    obraId: z.number().optional(),
    status: STATUS_ENUM.optional(),
    situacaoDocumental: z.enum(["regular", "pendente", "irregular"]).optional(),
    dataCadastro: z.coerce.date().optional(),
    dataUltimaCalibracao: z.coerce.date().optional(),
    dataVencimentoCalibracao: z.coerce.date().optional(),
  }),
});
