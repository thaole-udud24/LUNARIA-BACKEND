import React from 'react';
import {
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  DatabaseOutlined,
  ExportOutlined,
  ImportOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import styles from './index.less';

interface TableToolbarProps {
  total: number;
  searchValue: string;
  searchPlaceholder?: string;
  onSearchChange: (val: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onAddNew?: () => void;
  loading?: boolean;
}

export default function TableToolbar({
  total,
  searchValue,
  searchPlaceholder = 'Tìm kiếm...',
  onSearchChange,
  onSearch,
  onRefresh,
  onExport,
  onImport,
  onAddNew,
  loading = false,
}: TableToolbarProps) {
  return (
    <div className={styles.toolbarContainer}>
      <div className={styles.leftGroup}>
        <button className={styles.iconBtn} title="Cài đặt cột">
          <AppstoreOutlined />
        </button>
        <button className={styles.iconBtn} title="Bộ lọc">
          <FilterOutlined />
        </button>

        <div className={styles.searchInput}>
          <SearchOutlined className={styles.searchIcon} />
          <input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            disabled={loading}
          />
        </div>

        <div className={styles.totalText}>
          <DatabaseOutlined style={{ fontSize: 14 }} />
          Tổng: <span className={styles.highlight}>{total}</span>
        </div>
      </div>

      <div className={styles.rightGroup}>
        <button className={styles.iconBtn} onClick={onRefresh} title="Làm mới">
          <ReloadOutlined spin={loading} />
        </button>

        {(onExport || onImport) && <div className={styles.divider} />}

        {onExport && (
          <button className={styles.ghostBtn} onClick={onExport}>
            <ExportOutlined /> Xuất dữ liệu
          </button>
        )}
        {onImport && (
          <button className={styles.ghostBtn} onClick={onImport}>
            <ImportOutlined /> Nhập dữ liệu
          </button>
        )}

        {onAddNew && (
          <>
            <div className={styles.divider} />
            <button className={styles.primaryBtn} onClick={onAddNew}>
              <PlusOutlined /> Thêm mới
            </button>
          </>
        )}
      </div>
    </div>
  );
}