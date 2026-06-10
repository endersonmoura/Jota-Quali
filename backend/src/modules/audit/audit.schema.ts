import { z } from "zod";

export const getAuditLogsSchema = z.object({
  query: z.object({
    resourceId: z
      .string()
      .uuid("O resourceId, se fornecido, deve ser um UUID válido.")
      .optional(),
  }),
});
