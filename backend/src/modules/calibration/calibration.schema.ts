import { z } from "zod";

export const solicitarCalibracaoSchema = z.object({
  body: z.object({
    equipamentoId: z
      .number({ message: "O ID do equipamento deve ser numérico." })
      .int()
      .positive(),
    tipo: z.enum(["EXTERNA", "INTERNA"], {
      message: "O tipo de calibração deve ser EXTERNA ou INTERNA.",
    }),
    prazoRetornoDias: z
      .number()
      .int()
      .positive("O prazo de retorno deve ser maior que zero."),
    solicitanteId: z.number().int().positive().optional(), // Opcional, pois muitas vezes será extraído do Token JWT (req.user.id)
  }),
});

export const registrarCalibracaoInternaSchema = z.object({
  body: z.object({
    equipamentoId: z
      .number({ message: "O ID do equipamento deve ser numérico." })
      .int()
      .positive(),
    equipamentoReferenciaId: z
      .number({ message: "O ID do equipamento de referência deve ser numérico." })
      .int()
      .positive(),
    // Recebemos as datas como string ISO do frontend e transformamos para Date nativo do JS
    dataCalibracao: z
      .string()
      .datetime()
      .transform((str) => new Date(str)),
    validade: z
      .string()
      .datetime()
      .transform((str) => new Date(str)),
    calibradorId: z.number().int().positive().optional(),
    cpfResponsavel: z.string().length(11, "CPF deve ter 11 dígitos numéricos"),
    tipoLocal: z.enum(["laboratorio", "campo"]),
  }),
});
