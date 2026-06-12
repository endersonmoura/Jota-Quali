import React, { useState } from "react";
import { api } from "@/services/api";

export const RegisterEquipment: React.FC = () => {
  const [formData, setFormData] = useState({
    Nome: "",
    CodigoPatrimonio: "",
    DataAquisicao: "",
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
      // O Axios envia o token de Auth automaticamente graças ao interceptor configurado em api.ts
      await api.post("/equipments", formData);

      setSuccess(true);
      setFormData({ Nome: "", CodigoPatrimonio: "", DataAquisicao: "" });
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

      if (apiError.response?.data?.error?.details) {
        const zodErrors = apiError.response.data.error.details
          .map((d) => d.message)
          .join(", ");
        setError(`Validação: ${zodErrors}`);
      } else {
        setError(
          apiError.response?.data?.error?.message ||
            "Erro ao cadastrar o equipamento.",
        );
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Novo Equipamento</h2>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Equipamento cadastrado com sucesso!
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
          <label>Nome do Equipamento:</label>
          <input
            type="text"
            name="Nome"
            value={formData.Nome}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Código de Patrimônio:</label>
          <input
            type="text"
            name="CodigoPatrimonio"
            value={formData.CodigoPatrimonio}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Data de Aquisição:</label>
          <input
            type="date"
            name="DataAquisicao"
            value={formData.DataAquisicao}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
          Salvar Equipamento
        </button>
      </form>
    </div>
  );
};
