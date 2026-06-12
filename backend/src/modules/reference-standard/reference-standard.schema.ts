import { z } from "zod";

export const createReferenceStandardSchema = z.object({
  body: z.object({
    codigo: z.string({ required_error: "O código é obrigatório." }).min(1, "O código não pode ser vazio."),
    descricao: z.string({ required_error: "A descrição é obrigatória." }).min(1, "A descrição não pode ser vazia."),
    tipo: z.string().optional(),
    validade: z.coerce.date().optional(),
  }),
});

export const updateReferenceStandardSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "O ID deve ser numérico."),
  }),
  body: z.object({
    descricao: z.string().min(1, "A descrição não pode ser vazia.").optional(),
    tipo: z.string().optional(),
    validade: z.coerce.date().optional(),
    status: z.string().optional(),
    situacaoDocumental: z.string().optional(),
  }),
});
