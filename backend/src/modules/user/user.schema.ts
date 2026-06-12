import { z } from "zod";

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["ativo", "inativo"], {
      message: "O status deve ser ativo ou inativo",
    }),
  }),
});
