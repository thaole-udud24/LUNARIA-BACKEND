import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button } from 'antd';
import {
  FileExcelOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import styles from './styles.less';

export interface ExportOption {
  label: string;
  value: string;
}

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  options: ExportOption[];
  onExport: (selectedFields: string[]) => void;
  loading?: boolean;
  title?: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  open,
  onClose,
  options,
  onExport,
  loading = false,
  title = 'Xuất dữ liệu',
}) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedFields(options.map((opt) => opt.value));
    }
  }, [open, options]);

  const handleSelectAllFields = () => {
    setSelectedFields(options.map((opt) => opt.value));
  };

  const handleDeselectAllFields = () => {
    setSelectedFields([]);
  };

  const handleRemoveField = (fieldValue: string) => {
    setSelectedFields((prev) =>
      prev.filter((field) => field !== fieldValue),
    );
  };

  const handleExecuteExport = () => {
    onExport(selectedFields);
  };

  return (
    <Modal
      visible={open}
      title={title}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnClose
      className={styles.exportModal}
    >
      <p className={styles.exportDesc}>
        Chọn các trường dữ liệu muốn đưa vào file Excel.
      </p>

      <div className={styles.exportLayout}>
        {/* CỘT TRÁI */}
        <div className={styles.exportCol}>
          <div className={styles.colHeader}>
            <h3>Các trường khả dụng</h3>

            <div className={styles.actionLinks}>
              <span onClick={handleSelectAllFields}>
                Chọn tất cả
              </span>

              <span onClick={handleDeselectAllFields}>
                Bỏ chọn
              </span>
            </div>
          </div>

          <div className={styles.checkboxList}>
            <Checkbox.Group
              value={selectedFields}
              onChange={(checkedValues) =>
                setSelectedFields(
                  checkedValues as string[],
                )
              }
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className={styles.checkboxItem}
                >
                  <Checkbox value={option.value}>
                    {option.label}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className={styles.exportCol}>
          <div className={styles.colHeader}>
            <h3>
              Trường được xuất ({selectedFields.length})
            </h3>
          </div>

          <div className={styles.selectedList}>
            {selectedFields.length > 0 ? (
              selectedFields.map((fieldValue, index) => {
                const option = options.find(
                  (o) => o.value === fieldValue,
                );

                if (!option) return null;

                return (
                  <div
                    key={fieldValue}
                    className={styles.selectedItem}
                  >
                    <div className={styles.itemLeft}>
                      <div className={styles.itemIndex}>
                        {index + 1}
                      </div>

                      <div className={styles.itemName}>
                        {option.label}
                      </div>
                    </div>

                    <DeleteOutlined
                      className={styles.deleteIcon}
                      onClick={() =>
                        handleRemoveField(fieldValue)
                      }
                    />
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                Chưa có trường nào được chọn
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.modalFooter}>
        <Button
          onClick={onClose}
          disabled={loading}
          className={styles.cancelBtn}
        >
          Hủy
        </Button>

        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          loading={loading}
          onClick={handleExecuteExport}
          className={styles.exportBtn}
        >
          Xuất Excel
        </Button>
      </div>
    </Modal>
  );
};

export default ExportModal;