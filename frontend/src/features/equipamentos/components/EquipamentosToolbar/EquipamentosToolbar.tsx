import { Search } from "lucide-react";
import { STATUS_LABEL } from "../../types";
import type { StatusFilter } from "../../hooks/useEquipamentos";
import styles from "./EquipamentosToolbar.module.css";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  status: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
}

export function EquipamentosToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.searchWrap}>
        <Search size={16} aria-hidden className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Buscar por tag, nome ou localização..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.search}
          aria-label="Buscar equipamento"
        />
      </div>
      <label className={styles.selectWrap}>
        <span className={styles.selectLabel}>Status</span>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className={styles.select}
        >
          <option value="todos">Todos</option>
          <option value="ativo">{STATUS_LABEL.ativo}</option>
          <option value="vencido">{STATUS_LABEL.vencido}</option>
          <option value="inativo">{STATUS_LABEL.inativo}</option>
        </select>
      </label>
    </div>
  );
}
