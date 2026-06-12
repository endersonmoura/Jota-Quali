import { z } from "zod";

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"], {
      message: "O status deve ser APPROVED ou REJECTED",
    }),
  }),
});
