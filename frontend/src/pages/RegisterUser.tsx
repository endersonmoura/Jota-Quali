import React, { useState } from "react";
import { api } from "@/services/api";

export const RegisterUser: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await api.post("/auth/register", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", password: "" });
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            error?: {
              message?: string;
              details?: Array<{ message: string }>;
            };
          };
        };
      };

      // Tratando erro vindo do Zod (array details) ou do AppError (message string)
      if (apiError.response?.data?.error?.details) {
        const zodErrors = apiError.response.data.error.details
          .map((d) => d.message)
          .join(", ");
        setError(`Validação: ${zodErrors}`);
      } else {
        setError(
          apiError.response?.data?.error?.message ||
            "Erro inesperado ao cadastrar usuário.",
        );
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Criar Conta</h2>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Conta criada com sucesso!
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "350px",
        }}
      >
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
};
