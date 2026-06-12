import { z } from "zod";

export const getAuditLogsSchema = z.object({
  query: z.object({
    resourceId: z
      .string()
      .regex(/^\d+$/, "O resourceId, se fornecido, deve ser numérico.")
      .optional(),
  }),
});
