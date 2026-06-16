import { z } from "zod";

export const createObraSchema = z.object({
  body: z.object({
    nomeObra: z.string().min(1, "O nome da obra é obrigatório."),
    localizacao: z.string().optional(),
  }),
});

export const updateObraSchema = z.object({
  body: z.object({
    nomeObra: z.string().min(1, "O nome da obra não pode ser vazio.").optional(),
    localizacao: z.string().optional(),
    status: z.enum(["ativa", "inativa"]).optional(),
  }),
});
