import React, { useState } from 'react';
import classNames from 'classnames';
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
  /** Nội dung bộ lọc mở rộng (hiện khi bấm icon Filter) */
  filterContent?: React.ReactNode;
  /** Số filter đang áp dụng — hiển thị badge trên icon */
  filterActiveCount?: number;
}

export default function TableToolbar({
  total,
  searchValue,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  onSearchChange,
  onSearch,
  onRefresh,
  onExport,
  onImport,
  onAddNew,
  loading = false,
  filterContent,
  filterActiveCount = 0,
}: TableToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const hasActiveFilter = filterActiveCount > 0;

  return (
    <div className={styles.toolbarWrapper}>
    <div className={classNames(styles.toolbarContainer, {
      [styles.toolbarContainerExpanded]: filterContent && filterOpen,
    })}>
      <div className={styles.leftGroup}>
        <button
          type="button"
          className={styles.iconBtn}
        >
          <AppstoreOutlined />
        </button>

        {filterContent && (
          <button
            type="button"
            className={classNames(styles.iconBtn, {
              [styles.iconBtnActive]: filterOpen || hasActiveFilter,
            })}
            onClick={() => setFilterOpen((prev) => !prev)}
            title="Bộ lọc mở rộng"
          >
            <FilterOutlined />
            {hasActiveFilter && !filterOpen && <span className={styles.filterBadge} />}
          </button>
        )}

        <div className={styles.searchInput}>
          <SearchOutlined className={styles.searchIcon} />

          <input
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>

       <div className={styles.totalText}>
          <DatabaseOutlined />

          <div>
            <span>Tổng bản ghi: </span>
            <strong>{total}</strong>
          </div>
        </div>
      </div>

      <div className={styles.rightGroup}>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={onRefresh}
        >
          <ReloadOutlined spin={loading} />
        </button>

        {(onExport || onImport) && (
          <div className={styles.divider} />
        )}

        {onExport && (
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={onExport}
          >
            <ExportOutlined />
            Xuất dữ liệu
          </button>
        )}

        {onImport && (
          <button
            type="button"
            className={styles.outlineBtn}
            onClick={onImport}
          >
            <ImportOutlined />
            Nhập dữ liệu
          </button>
        )}

        {onAddNew && (
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={onAddNew}
          >
            <PlusOutlined />
            Thêm mới
          </button>
        )}
      </div>
    </div>

    {filterContent && filterOpen && (
      <div className={styles.filterPanel}>
        {filterContent}
      </div>
    )}
    </div>
  );
}