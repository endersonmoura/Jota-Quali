import { z } from "zod";

export const solicitarCalibracaoSchema = z.object({
  body: z.object({
    equipamentoId: z
      .string()
      .uuid("O ID do equipamento deve ser um UUID válido."),
    tipo: z.enum(["EXTERNA", "INTERNA"], {
      message: "O tipo de calibração deve ser EXTERNA ou INTERNA.",
    }),
    prazoRetornoDias: z
      .number()
      .int()
      .positive("O prazo de retorno deve ser maior que zero."),
    solicitanteId: z.string().uuid().optional(), // Opcional, pois muitas vezes será extraído do Token JWT (req.user.id)
  }),
});

export const registrarCalibracaoInternaSchema = z.object({
  body: z.object({
    equipamentoId: z
      .string()
      .uuid("O ID do equipamento deve ser um UUID válido."),
    equipamentoReferenciaId: z
      .string()
      .uuid("O ID do equipamento de referência deve ser um UUID válido."),
    // Recebemos as datas como string ISO do frontend e transformamos para Date nativo do JS
    dataCalibracao: z
      .string()
      .datetime()
      .transform((str) => new Date(str)),
    validade: z
      .string()
      .datetime()
      .transform((str) => new Date(str)),
    calibradorId: z.string().uuid().optional(),
  }),
});
