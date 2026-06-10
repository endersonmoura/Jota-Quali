import React, { useState } from "react";
import { ChevronRight, Pencil, Trash2, CheckCircle2, XCircle, X, Wrench, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Equipamento } from "../../types";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import styles from "./EquipamentosTable.module.css";
import { cn } from "@/lib/cn";

import type { SortField, SortDirection } from "../../hooks/useEquipamentos";

interface Props {
  items: Equipamento[];
  onEdit: (eq: Equipamento) => void;
  onDelete: (eq: Equipamento) => void;
  onCalibrate?: (eq: Equipamento) => void;
  onSign?: (eq: Equipamento) => void;
  mode?: "equipamentos" | "calibracao" | "laudos";
  sortField?: SortField;
  sortDirection?: SortDirection;
  onSort?: (field: SortField) => void;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "—";
  return `${d}/${m}/${y}`;
}

export function EquipamentosTable({ items, onEdit, onDelete, onCalibrate, onSign, mode = "equipamentos", sortField, sortDirection, onSort }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [popup, setPopup] = useState<{ isOpen: boolean; type: 'padrao' | 'laudo'; title: string; content: string; hasFile: boolean } | null>(null);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} className={styles.sortIconIdle} />;
    return sortDirection === "asc" ? <ArrowUp size={14} className={styles.sortIconActive} /> : <ArrowDown size={14} className={styles.sortIconActive} />;
  };

  const renderSortHeader = (label: string, field: SortField) => (
    <th 
      className={styles.sortableHeader} 
      onClick={() => onSort?.(field)}
      style={{ cursor: onSort ? 'pointer' : 'default' }}
    >
      <div className={styles.headerContent}>
        {label}
        {onSort && renderSortIcon(field)}
      </div>
    </th>
  );

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "40px" }} aria-label="Expandir"></th>
            {renderSortHeader("Tag", "tag")}
            {renderSortHeader("Nome", "nome")}
            {renderSortHeader("Última calibração", "ultimaCalibracao")}
            {renderSortHeader("Localização", "localizacao")}
            {mode === "laudos" ? (
              <th className={styles.sortableHeader}>Status do Laudo</th>
            ) : (
              renderSortHeader("Status", "status")
            )}
            <th className={styles.actionsHead} aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {items.map((eq) => {
            const isExpanded = expandedRows.has(eq.id);
            return (
              <React.Fragment key={eq.id}>
                <tr
                  className={styles.clickableRow}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button')) return;
                    toggleRow(eq.id);
                  }}
                >
                  <td>
                    <button
                      type="button"
                      className={cn(styles.expandBtn, isExpanded && styles.expanded)}
                      onClick={() => toggleRow(eq.id)}
                      aria-label={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}
                      tabIndex={-1}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                  <td className={styles.tag}>{eq.tag}</td>
                  <td className={styles.nome}>{eq.nome}</td>
                  <td>{formatDate(eq.ultimaCalibracao)}</td>
                  <td>{eq.localizacao || "—"}</td>
                  <td>
                    {mode === "laudos" ? (
                      eq.statusLaudo === "aguardando_assinatura" ? (
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.5rem", borderRadius: "4px", backgroundColor: "var(--jq-warning-subtle)", color: "var(--jq-warning)", fontSize: "0.75rem", fontWeight: 500 }}>
                          Aguardando Assinatura
                        </span>
                      ) : eq.statusLaudo === "assinado" ? (
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.5rem", borderRadius: "4px", backgroundColor: "var(--jq-success-subtle)", color: "var(--jq-success)", fontSize: "0.75rem", fontWeight: 500 }}>
                          Assinado
                        </span>
                      ) : (
                        "—"
                      )
                    ) : (
                      <StatusBadge status={eq.status} />
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {mode === "calibracao" ? (
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCalibrate?.(eq);
                          }}
                          aria-label={`Iniciar calibração ${eq.tag}`}
                          title="Iniciar calibração / Gerar Laudo"
                        >
                          <Wrench size={16} />
                        </button>
                      ) : mode === "laudos" ? (
                        eq.statusLaudo === "aguardando_assinatura" && onSign && (
                          <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSign(eq);
                            }}
                            aria-label={`Assinar laudo ${eq.tag}`}
                            title="Assinar com GOV.BR"
                            style={{ backgroundColor: "var(--jq-primary)", color: "#fff", width: "auto", padding: "0 0.5rem", borderRadius: "4px", gap: "0.25rem" }}
                          >
                            <CheckCircle2 size={14} /> Assinar
                          </button>
                        )
                      ) : (
                        <>
                          <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(eq);
                            }}
                            aria-label={`Editar ${eq.tag}`}
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(eq);
                            }}
                            aria-label={`Excluir ${eq.tag}`}
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className={styles.expandedRow}>
                    <td colSpan={7}>
                      <div className={styles.expandedContent}>
                        <div className={styles.expandedHeader}>
                          Detalhes do Equipamento: {eq.tag}
                        </div>
                        <div className={styles.expandedGrid}>
                          <div 
                            className={cn(styles.expandedItem, styles.clickableCard)}
                            onClick={() => {
                              const hasPadrao = !!eq.padrao && eq.padrao !== "Não definido";
                              setPopup({
                                isOpen: true,
                                type: 'padrao',
                                title: 'Padrão do Equipamento',
                                content: hasPadrao ? `O equipamento possui padrão cadastrado: ${eq.padrao}` : 'Não há padrão cadastrado para este equipamento.',
                                hasFile: hasPadrao
                              });
                            }}
                          >
                            <span className={styles.expandedLabel}>Padrão do Equipamento</span>
                            <span className={styles.expandedValue}>{eq.padrao || "Não definido"}</span>
                          </div>
                          <div 
                            className={cn(styles.expandedItem, styles.clickableCard)}
                            onClick={() => {
                              setPopup({
                                isOpen: true,
                                type: 'laudo',
                                title: 'Laudo Assinado',
                                content: eq.laudoAssinado ? 'O equipamento possui laudo assinado.' : 'Não há laudo assinado para este equipamento.',
                                hasFile: eq.laudoAssinado
                              });
                            }}
                          >
                            <span className={styles.expandedLabel}>Laudo Assinado</span>
                            <span className={styles.expandedValue} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              {eq.laudoAssinado ? (
                                <><CheckCircle2 size={16} color="var(--jq-success)" /> Sim</>
                              ) : (
                                <><XCircle size={16} color="var(--jq-danger)" /> Não</>
                              )}
                            </span>
                          </div>
                          <div className={styles.expandedItem}>
                            <span className={styles.expandedLabel}>Tipo de Calibração</span>
                            <span className={styles.expandedValue}>
                              {eq.tipoCalibracao === "laboratorio" ? "Em Laboratório" : eq.tipoCalibracao === "campo" ? "Em Campo" : "Não definido"}
                            </span>
                          </div>
                          <div className={styles.expandedItem}>
                            <span className={styles.expandedLabel}>Data de Cadastro</span>
                            <span className={styles.expandedValue}>{formatDate(eq.createdAt.split('T')[0])}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {popup && popup.isOpen && (
        <div className={styles.popupOverlay} onClick={() => setPopup(null)}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupHeader}>
              <h3 className={styles.popupTitle}>{popup.title}</h3>
              <button type="button" className={styles.popupClose} onClick={() => setPopup(null)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.popupBody}>
              <p className={styles.popupText}>{popup.content}</p>
              {popup.hasFile && (
                <div className={styles.fileContainer}>
                  <div className={styles.pdfPreviewContainer}>
                    <iframe 
                      src="/exemplo.pdf#view=FitH" 
                      title={`Visualização de ${popup.type}`}
                      className={styles.pdfPreview}
                    />
                  </div>
                  <div className={styles.fileActions}>
                    <div className={styles.fileDetails}>
                      <span className={styles.fileName}>arquivo_{popup.type}.pdf</span>
                      <span className={styles.fileSize}>1.2 MB</span>
                    </div>
                    <a 
                      href="/exemplo.pdf" 
                      download={`arquivo_${popup.type}.pdf`}
                      className={styles.downloadBtn}
                      style={{ textDecoration: 'none', textAlign: 'center' }}
                    >
                      Baixar Arquivo
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
