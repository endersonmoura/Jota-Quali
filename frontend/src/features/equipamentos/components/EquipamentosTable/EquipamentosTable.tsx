import React, { useState, useEffect } from "react";
import { ChevronRight, Pencil, Trash2, CheckCircle2, XCircle, X, Wrench, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Equipamento } from "../../types";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import styles from "./EquipamentosTable.module.css";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button/Button";
import { calibracaoService } from "@/features/calibracoes/services/calibracaoService";

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
  const datePart = iso.split("T")[0];
  if (!datePart) return "—";
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return "—";
  return `${d}/${m}/${y}`;
}

function ExpandedEquipamentoDetails({ eq, setPopup }: { eq: Equipamento, setPopup: any }) {
  const [padrao, setPadrao] = useState<string>("Carregando...");

  useEffect(() => {
    let mounted = true;
    calibracaoService.getUltima(eq.id).then((cal) => {
      if (!mounted) return;
      if (cal && cal.padraoReferencia) {
        setPadrao(`${cal.padraoReferencia.codigo} - ${cal.padraoReferencia.descricao}`);
      } else {
        setPadrao("Não definido");
      }
    }).catch(() => {
      if (mounted) setPadrao("Erro ao carregar");
    });
    return () => { mounted = false; };
  }, [eq.id]);

  return (
    <div className={styles.expandedContent}>
      <div className={styles.expandedHeader}>
        Detalhes do Equipamento: {eq.codigo}
      </div>
      <div className={styles.expandedGrid}>
        <div 
          className={cn(styles.expandedItem, styles.clickableCard)}
          onClick={() => {
            setPopup({
              isOpen: true,
              type: 'padrao',
              title: 'Padrão do Equipamento',
              content: `O equipamento está calibrado com o seguinte padrão: ${padrao}`,
              hasFile: false
            });
          }}
        >
          <span className={styles.expandedLabel}>Padrão do Equipamento</span>
          <span className={styles.expandedValue}>{padrao}</span>
        </div>
                        <div 
                          className={cn(styles.expandedItem, styles.clickableCard)}
                          onClick={() => {
                            setPopup({
                              isOpen: true,
                              type: 'laudo',
                              title: 'Laudo Assinado',
                              content: eq.situacaoDocumental === "regular" || eq.situacaoDocumental === "assinado" ? 'O equipamento possui laudo assinado.' : 'Não há laudo assinado para este equipamento.',
                              hasFile: !!(eq as any).pathArquivo,
                              fileUrl: (eq as any).pathArquivo,
                            });
                          }}
                        >
                          <span className={styles.expandedLabel}>Laudo Assinado</span>
                          <span className={styles.expandedValue} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {eq.situacaoDocumental === "regular" || eq.situacaoDocumental === "assinado" ? (
                              <><CheckCircle2 size={16} color="var(--jq-success)" /> Sim</>
                            ) : (
                              <><XCircle size={16} color="var(--jq-danger)" /> Não</>
                            )}
                          </span>
                        </div>
        <div className={styles.expandedItem}>
          <span className={styles.expandedLabel}>Tipo de Calibração</span>
          <span className={styles.expandedValue}>
            {eq.tipo}
          </span>
        </div>
        <div className={styles.expandedItem}>
          <span className={styles.expandedLabel}>Data de Cadastro</span>
          <span className={styles.expandedValue}>{formatDate(eq.criadoEm ? eq.criadoEm.split('T')[0] : null)}</span>
        </div>
      </div>
    </div>
  );
}

export function EquipamentosTable({ items, onEdit, onDelete, onCalibrate, onSign, mode = "equipamentos", sortField, sortDirection, onSort }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [popup, setPopup] = useState<{ isOpen: boolean; type: 'padrao' | 'laudo'; title: string; content: string; hasFile: boolean; fileUrl?: string } | null>(null);

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
            {renderSortHeader("Código / Tag", "codigo")}
            {renderSortHeader("Descrição", "descricao")}
            {renderSortHeader("Última calibração", "dataUltimaCalibracao")}
            <th className={styles.sortableHeader}>Obra</th>
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
            const isExpanded = expandedRows.has(String(eq.id));
            return (
              <React.Fragment key={eq.id}>
                <tr
                  className={styles.clickableRow}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button')) return;
                    toggleRow(String(eq.id));
                  }}
                >
                  <td>
                    <button
                      type="button"
                      className={cn(styles.expandBtn, isExpanded && styles.expanded)}
                      onClick={() => toggleRow(String(eq.id))}
                      aria-label={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}
                      tabIndex={-1}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                  <td className={styles.tag}>{eq.codigo}</td>
                  <td className={styles.nome}>{eq.descricao}</td>
                  <td>{formatDate(eq.dataUltimaCalibracao ?? null)}</td>
                  <td>{eq.obraId ? `Obra ${eq.obraId}` : "—"}</td>
                  <td>
                    {mode === "laudos" ? (
                      eq.situacaoDocumental === "aguardando_assinatura" ? (
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.5rem", borderRadius: "4px", backgroundColor: "var(--jq-warning-subtle)", color: "var(--jq-warning)", fontSize: "0.75rem", fontWeight: 500 }}>
                          Aguardando Assinatura
                        </span>
                      ) : eq.situacaoDocumental === "assinado" || eq.situacaoDocumental === "regular" ? (
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.5rem", borderRadius: "4px", backgroundColor: "var(--jq-success-subtle)", color: "var(--jq-success)", fontSize: "0.75rem", fontWeight: 500 }}>
                          Regular
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
                          aria-label={`Iniciar calibração ${eq.codigo}`}
                          title="Iniciar calibração / Gerar Laudo"
                        >
                          <Wrench size={16} />
                        </button>
                      ) : mode === "laudos" ? (
                        <>
                          {eq.situacaoDocumental === "aguardando_assinatura" && onSign && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSign(eq);
                              }}
                              aria-label={`Assinar laudo ${eq.codigo}`}
                              title="Assinar com GOV.BR"
                            >
                              Assinar
                            </Button>
                          )}
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(eq);
                            }}
                            aria-label={`Remover laudo ${eq.codigo}`}
                            title="Remover"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(eq);
                            }}
                            aria-label={`Editar ${eq.codigo}`}
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
                            aria-label={`Excluir ${eq.codigo}`}
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
                      <ExpandedEquipamentoDetails eq={eq} setPopup={setPopup} />
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
                      src={popup.fileUrl ? `${popup.fileUrl}#view=FitH` : "/exemplo.pdf#view=FitH"} 
                      title={`Visualização de ${popup.type}`}
                      className={styles.pdfPreview}
                    />
                  </div>
                  <div className={styles.fileActions}>
                    <div className={styles.fileDetails}>
                      <span className={styles.fileName}>arquivo_{popup.type}.pdf</span>
                      <span className={styles.fileSize}></span>
                    </div>
                    <a 
                      href={popup.fileUrl || "/exemplo.pdf"} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadBtn}
                      style={{ textDecoration: 'none', textAlign: 'center' }}
                    >
                      Abrir PDF
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
