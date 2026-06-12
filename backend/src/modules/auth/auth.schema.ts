import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Formato de e-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    cpf: z.string().min(11, "O CPF é obrigatório e deve ter 11 a 14 caracteres").max(14),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Formato de e-mail inválido"),
    password: z.string().min(1, "A senha é obrigatória"),
  }),
});
