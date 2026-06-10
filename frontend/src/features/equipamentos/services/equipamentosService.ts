import { storage } from "@/lib/storage";
import type { Equipamento, EquipamentoInput } from "../types";

const KEY = "jq:equipamentos:v3";

const SEED: Equipamento[] = [
  {
    id: "seed-1",
    tag: "EQ-001",
    nome: "Balança analítica Shimadzu AY220",
    ultimaCalibracao: "2025-03-12",
    localizacao: "Laboratório 1",
    status: "ativo",
    padrao: "RBC 001/25",
    laudoAssinado: true,
    createdAt: "2025-01-10T09:00:00.000Z",
  },
  {
    id: "seed-2",
    tag: "EQ-002",
    nome: "Paquímetro digital Mitutoyo 500-196",
    ultimaCalibracao: "2025-04-02",
    localizacao: "Metrologia",
    status: "ativo",
    padrao: "ISO 9001",
    laudoAssinado: true,
    createdAt: "2025-01-18T09:00:00.000Z",
  },
  {
    id: "seed-3",
    tag: "EQ-003",
    nome: "Estufa de secagem Quimis Q317M",
    ultimaCalibracao: "2024-11-20",
    localizacao: "Laboratório 2",
    status: "manutencao",
    padrao: "NBR 17025",
    laudoAssinado: false,
    statusLaudo: "aguardando_assinatura",
    createdAt: "2025-02-02T09:00:00.000Z",
  },
  {
    id: "seed-4",
    tag: "EQ-004",
    nome: "Multímetro Fluke 87V",
    ultimaCalibracao: "2025-02-08",
    localizacao: "Manutenção elétrica",
    status: "ativo",
    padrao: "RBC 004/24",
    laudoAssinado: true,
    createdAt: "2025-02-12T09:00:00.000Z",
  },
  {
    id: "seed-5",
    tag: "EQ-005",
    nome: "Termo-higrômetro Incoterm 7663",
    ultimaCalibracao: null,
    localizacao: "Almoxarifado",
    status: "inativo",
    createdAt: "2025-03-05T09:00:00.000Z",
  },
  {
    id: "seed-6",
    tag: "EQ-006",
    nome: "Micrômetro externo Mitutoyo 0-25mm",
    ultimaCalibracao: "2025-01-22",
    localizacao: "Metrologia",
    status: "ativo",
    padrao: "RBC 006/25",
    laudoAssinado: true,
    createdAt: "2025-03-10T09:00:00.000Z",
  },
  {
    id: "seed-7",
    tag: "EQ-007",
    nome: "Torquímetro Tramontina 40-200Nm",
    ultimaCalibracao: "2025-03-28",
    localizacao: "Oficina mecânica",
    status: "ativo",
    createdAt: "2025-03-15T09:00:00.000Z",
  },
  {
    id: "seed-8",
    tag: "EQ-008",
    nome: "Manômetro digital Wika CPG500",
    ultimaCalibracao: "2024-12-10",
    localizacao: "Sala de pressão",
    status: "manutencao",
    padrao: "NBR 17025",
    laudoAssinado: false,
    createdAt: "2025-03-20T09:00:00.000Z",
  },
  {
    id: "seed-9",
    tag: "EQ-009",
    nome: "Cronômetro digital Technos",
    ultimaCalibracao: "2025-04-15",
    localizacao: "Laboratório 1",
    status: "ativo",
    createdAt: "2025-03-22T09:00:00.000Z",
  },
  {
    id: "seed-10",
    tag: "EQ-010",
    nome: "pHmetro de bancada Quimis Q400AS",
    ultimaCalibracao: "2025-02-25",
    localizacao: "Laboratório 2",
    status: "ativo",
    padrao: "RBC 010/25",
    laudoAssinado: true,
    createdAt: "2025-03-25T09:00:00.000Z",
  },
  {
    id: "seed-11",
    tag: "EQ-011",
    nome: "Trena a laser Bosch GLM 50",
    ultimaCalibracao: "2025-01-05",
    localizacao: "Engenharia",
    status: "ativo",
    createdAt: "2025-04-01T09:00:00.000Z",
  },
  {
    id: "seed-12",
    tag: "EQ-012",
    nome: "Osciloscópio Tektronix TBS1052B",
    ultimaCalibracao: null,
    localizacao: "Laboratório elétrico",
    status: "inativo",
    createdAt: "2025-04-05T09:00:00.000Z",
  },
  {
    id: "seed-13",
    tag: "EQ-013",
    nome: "Durômetro Rockwell Mitutoyo HR-150A",
    ultimaCalibracao: "2025-03-30",
    localizacao: "Metalurgia",
    status: "ativo",
    padrao: "ISO 9001",
    laudoAssinado: true,
    createdAt: "2025-04-10T09:00:00.000Z",
  },
  {
    id: "seed-14",
    tag: "EQ-014",
    nome: "Banho ultrassônico Unique USC-1400",
    ultimaCalibracao: "2024-10-18",
    localizacao: "Laboratório 1",
    status: "manutencao",
    createdAt: "2025-04-15T09:00:00.000Z",
  },
  {
    id: "seed-15",
    tag: "EQ-015",
    nome: "Refratômetro digital Atago PAL-1",
    ultimaCalibracao: "2025-04-20",
    localizacao: "Controle de qualidade",
    status: "ativo",
    padrao: "RBC 015/25",
    laudoAssinado: true,
    createdAt: "2025-04-20T09:00:00.000Z",
  },
  {
    id: "seed-16",
    tag: "EQ-016",
    nome: "Balança de Precisão Ohaus",
    ultimaCalibracao: "2024-05-15",
    localizacao: "Laboratório 3",
    status: "vencendo",
    padrao: "RBC 016/24",
    laudoAssinado: false,
    createdAt: "2025-04-21T09:00:00.000Z",
  },
  {
    id: "seed-17",
    tag: "EQ-017",
    nome: "Termômetro Digital Testo",
    ultimaCalibracao: "2024-06-01",
    localizacao: "Produção",
    status: "vencendo",
    createdAt: "2025-04-22T09:00:00.000Z",
  },
];

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `eq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readAll(): Equipamento[] {
  const data = storage.get<Equipamento[]>(KEY);
  if (data === null) {
    storage.set(KEY, SEED);
    return [...SEED];
  }

  // Inject missing seeds if user has an old version of localStorage
  let updated = false;
  const newData = [...data];
  for (const seedItem of SEED) {
    if (!newData.some((e) => e.id === seedItem.id)) {
      newData.push(seedItem);
      updated = true;
    }
  }

  if (updated) {
    storage.set(KEY, newData);
    return newData;
  }

  return data;
}

function writeAll(list: Equipamento[]): void {
  storage.set(KEY, list);
}

export const equipamentosService = {
  list(): Equipamento[] {
    return readAll();
  },

  create(input: EquipamentoInput): Equipamento {
    const all = readAll();
    if (all.some((e) => e.tag.toLowerCase() === input.tag.trim().toLowerCase())) {
      throw new Error("Já existe um equipamento com essa Tag.");
    }
    const novo: Equipamento = {
      ...input,
      tag: input.tag.trim(),
      nome: input.nome.trim(),
      localizacao: input.localizacao.trim(),
      id: uid(),
      createdAt: new Date().toISOString(),
    };
    writeAll([novo, ...all]);
    return novo;
  },

  update(id: string, input: EquipamentoInput): Equipamento {
    const all = readAll();
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Equipamento não encontrado.");
    if (
      all.some(
        (e) =>
          e.id !== id &&
          e.tag.toLowerCase() === input.tag.trim().toLowerCase()
      )
    ) {
      throw new Error("Já existe um equipamento com essa Tag.");
    }
    const atualizado: Equipamento = {
      ...all[idx],
      ...input,
      tag: input.tag.trim(),
      nome: input.nome.trim(),
      localizacao: input.localizacao.trim(),
    };
    const next = [...all];
    next[idx] = atualizado;
    writeAll(next);
    return atualizado;
  },

  remove(id: string): void {
    const all = readAll();
    writeAll(all.filter((e) => e.id !== id));
  },
};
