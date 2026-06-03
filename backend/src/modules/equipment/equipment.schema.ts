import { z } from "zod";

export const createEquipmentSchema = z.object({
  body: z.object({
    descricao: z
      .string({ message: "A descrição é obrigatória." })
      .min(1, "A descrição não pode ser vazia."),
    codigo: z
      .string({ message: "O código é obrigatório." })
      .min(1, "O código não pode ser vazio."),
    tipo: z
      .string({ message: "O tipo é obrigatório." })
      .min(1, "O tipo não pode ser vazio."),
    // z.coerce.date() tenta converter automaticamente a string (ex: "2024-03-10") vinda do JSON para um objeto Date
    dataAquisicao: z.coerce
      .date({
        message: "A data de aquisição deve ser uma data válida.",
      })
      .optional(),
    status: z
      .enum(["Disponivel", "Em Manutencao", "Calibracao", "Inativo"])
      .optional(),
  }),
});

export const updateEquipmentSchema = z.object({
  params: z.object({
    id: z.string().uuid("O ID do equipamento na rota deve ser um UUID válido."),
  }),
  body: z.object({
    descricao: z.string().min(1, "A descrição não pode ser vazia.").optional(),
    codigo: z.string().min(1, "O código não pode ser vazio.").optional(),
    tipo: z.string().min(1, "O tipo não pode ser vazio.").optional(),
    dataAquisicao: z.coerce
      .date({
        message: "A data de aquisição deve ser uma data válida.",
      })
      .optional(),
    status: z
      .enum(["Disponivel", "Em Manutencao", "Calibracao", "Inativo"])
      .optional(),
  }),
});
