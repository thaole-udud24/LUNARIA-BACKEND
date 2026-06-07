import { useState } from 'react';
import { Modal, Steps, Upload, Button, Select, Table, message, Tag, Space, InputNumber } from 'antd';
import { UploadOutlined, DownloadOutlined, CheckCircleFilled, CloseOutlined, ArrowRightOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import styles from './styles.less';

const { Dragger } = Upload;
const { Step } = Steps;

export interface ImportField {
  key: string;
  label: string;
  required?: boolean;
}

interface ImportModalProps {
  open: boolean;
  title?: string;
  templateUrl?: string;
  fields: ImportField[];
  onClose: () => void;
  onPreview: (file: File, mapping: Record<string, string>) => Promise<any>;
  onCommit: (validData: any[]) => Promise<any>;
  onSuccess: () => void;
}

export default function ImportModal({
  open, title = 'Nhập dữ liệu', templateUrl,
  fields, onClose, onPreview, onCommit, onSuccess,
}: ImportModalProps) {
  const [current, setCurrent] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [headerRow, setHeaderRow] = useState<number>(1);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [previewResult, setPreviewResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saveResult, setSaveResult] = useState<any>(null);

  const handleClose = () => {
    setCurrent(0);
    setFile(null);
    setWorkbook(null);
    setSheetNames([]);
    setSelectedSheet('');
    setHeaderRow(1);
    setExcelHeaders([]);
    setMapping({});
    setPreviewResult(null);
    setSaveResult(null);
    onClose();
  };

  const handleFileUpload = (uploadedFile: File) => {
    if (uploadedFile.size / 1024 / 1024 > 5) {
      message.error('File vượt quá 5MB!');
      return;
    }
    setFile(uploadedFile);
    setWorkbook(null);
    setSheetNames([]);
    setSelectedSheet('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: 'array' });
        setWorkbook(wb);
        setSheetNames(wb.SheetNames);
        setSelectedSheet(wb.SheetNames[0]);
        message.success(`Đã đọc file: ${uploadedFile.name}`);
      } catch {
        message.error('File không đúng định dạng Excel!');
        setFile(null);
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleProceedToMapping = () => {
    if (!workbook || !selectedSheet) {
      message.error('Vui lòng chọn tập tin và trang tính!');
      return;
    }
    try {
      const worksheet = workbook.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: headerRow > 0 ? headerRow - 1 : 0,
      });

      if (jsonData.length > 0) {
        const headers = (jsonData[0] as any[])
          .filter(Boolean)
          .map((h: any) => h.toString().trim());
        setExcelHeaders(headers);

        // ✅ Auto-map: so sánh label field với header Excel
        const autoMapping: Record<string, string> = {};
        fields.forEach(field => {
          const matched = headers.find(
            h => h.toLowerCase() === field.label.toLowerCase()
          );
          if (matched) autoMapping[field.key] = matched;
        });

        setMapping(autoMapping);

        const autoCount = Object.keys(autoMapping).length;
        if (autoCount > 0) {
          message.success(`Tự động ghép được ${autoCount}/${fields.length} cột!`);
        }

        setCurrent(1);
      } else {
        message.error('Trang tính trống hoặc dòng tiêu đề không hợp lệ!');
      }
    } catch {
      message.error('Lỗi khi đọc trang tính!');
    }
  };

  const handleGoToPreview = async () => {
    const missingFields = fields.filter(f => f.required && !mapping[f.key]);
    if (missingFields.length > 0) {
      message.warning(`Vui lòng ghép cột cho: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }
    try {
      setLoading(true);
      const reverseMapping: Record<string, string> = {};
      Object.entries(mapping).forEach(([dbKey, excelCol]) => {
        if (excelCol) reverseMapping[excelCol] = dbKey;
      });
      const res = await onPreview(file!, reverseMapping);
      setPreviewResult(res);
      setCurrent(2);
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Có lỗi khi kiểm tra dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    try {
      setLoading(true);
      const validRows = previewResult.previewData
        .filter((r: any) => r.isValid)
        .map((r: any) => r.data);
      const res = await onCommit(validRows);
      setSaveResult(res);
      message.success(`Đã lưu ${res?.successCount || validRows.length} bản ghi thành công!`);
      setCurrent(3);
      onSuccess();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Lưu dữ liệu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    if (templateUrl) {
      window.open(templateUrl, '_blank');
      return;
    }

    const headerRow_data = fields.map(f => f.label);
    const sampleRow = fields.map(f => f.required ? 'Dữ liệu mẫu *' : 'Dữ liệu mẫu');

    const ws = XLSX.utils.aoa_to_sheet([headerRow_data, sampleRow]);

    ws['!cols'] = fields.map(() => ({ wch: 25 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FULL_DATA');
    XLSX.writeFile(wb, 'File_Mau_Nhap_Lieu.xlsx');
  };

  const previewColumns = [
    { title: 'Dòng', dataIndex: 'rowNumber', width: 60 },
    ...fields.map(f => ({
      title: (
        <span>
          {f.label}
          {f.required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
        </span>
      ),
      ellipsis: true,
      render: (_: any, record: any) => record.data?.[f.key] || '-',
    })),
    {
      title: 'Trạng thái',
      width: 110,
      render: (_: any, record: any) =>
        record.isValid
          ? <Tag color="success">Hợp lệ</Tag>
          : <Tag color="error">Lỗi</Tag>,
    },
    {
      title: 'Chi tiết lỗi',
      render: (_: any, record: any) =>
        record.errors?.length
          ? <span style={{ color: '#ef4444', fontSize: 12 }}>{record.errors.join(', ')}</span>
          : '-',
    },
  ];

  const renderStep = () => {
    switch (current) {
      case 0:
        return (
          <div className={styles.stepContent}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#1F2937', marginBottom: 12 }}>
              Tập tin dữ liệu <span style={{ color: '#ef4444' }}>*</span>
            </div>

            <Dragger
              accept=".xlsx,.xls"
              maxCount={1}
              fileList={file ? [{ uid: '-1', name: file.name, status: 'done' }] : []}
              beforeUpload={(f) => { handleFileUpload(f); return false; }}
              onRemove={() => {
                setFile(null);
                setWorkbook(null);
                setSheetNames([]);
                setSelectedSheet('');
                setHeaderRow(1);
                setExcelHeaders([]);
                setMapping({});
              }}
              className={styles.uploadArea}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ color: '#165b9e', fontSize: 42 }} />
              </p>
              <h3 style={{ color: '#1e293b', marginTop: 16, fontSize: 18, fontWeight: 500 }}>
                Nhấn chuột hoặc kéo thả tài liệu để tải lên
              </h3>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>
                Chọn tập tin dữ liệu để nhập vào hệ thống
              </p>
              <p style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', marginTop: 16 }}>
                Tối đa 1 mục, dung lượng mỗi file không được quá 5MB — Định dạng: .xlsx, .xls
              </p>
            </Dragger>

            <div className={styles.stepRow}>
              <div className={styles.stepRowCol}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1F2937', marginBottom: 8 }}>
                  Trang tính chứa dữ liệu <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <Select
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Chọn trang tính chứa dữ liệu"
                  value={selectedSheet || undefined}
                  onChange={setSelectedSheet}
                  disabled={!file || sheetNames.length === 0}
                  options={sheetNames.map(s => ({ label: s, value: s }))}
                />
              </div>
              <div className={styles.stepRowCol}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1F2937', marginBottom: 8 }}>
                  Dòng làm tiêu đề cột
                </div>
                <InputNumber
                  size="large"
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Mặc định: dòng 1"
                  value={headerRow}
                  onChange={(val) => setHeaderRow(val || 1)}
                  disabled={!file}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <div style={{ fontStyle: 'italic', color: '#1F2937', marginBottom: 12, fontSize: 14, fontWeight: 500 }}>
                Sử dụng tập dữ liệu mẫu để việc xử lý được thực hiện nhanh chóng và chính xác
              </div>
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={handleDownloadSample}
                style={{ fontWeight: 600, color: '#165b9e', fontSize: 15 }}
              >
                TẢI TẬP TIN MẪU
              </Button>
            </div>

            {/* Chú thích màu */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 16, height: 16, background: '#E53E3E', borderRadius: 3 }} />
                <span style={{ fontSize: 13, color: '#6B7280' }}>Trường bắt buộc</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 16, height: 16, background: '#3182CE', borderRadius: 3 }} />
                <span style={{ fontSize: 13, color: '#6B7280' }}>Trường không bắt buộc</span>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className={styles.stepContent}>
            <h3 style={{ marginBottom: 8, color: '#1e293b' }}>
              Ghép cột thông tin với cột dữ liệu tương ứng
            </h3>
            <p style={{ color: '#64748b', marginBottom: 24, fontSize: 13 }}>
              Hệ thống đã tự động ghép các cột có tên trùng khớp. Kiểm tra và điều chỉnh nếu cần.
            </p>
            <div className={styles.mappingGrid}>
              {fields.map(field => {
                const isMapped = !!mapping[field.key];
                const isMissing = field.required && !isMapped;
                return (
                  <div key={field.key}>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: isMissing ? '#ef4444' : '#475569' }}>
                      {field.label}
                      {field.required && <span style={{ color: '#ef4444' }}> *</span>}
                      {isMapped && <span style={{ color: '#22c55e', marginLeft: 8, fontSize: 12 }}>✓ Đã ghép</span>}
                    </div>
                    <Select
                      style={{
                        width: '100%',
                        borderColor: isMissing ? '#ef4444' : undefined,
                      }}
                      size="large"
                      placeholder={`Chọn cột cho ${field.label}`}
                      value={mapping[field.key] || undefined}
                      onChange={val => setMapping(prev => ({ ...prev, [field.key]: val }))}
                      options={excelHeaders.map(h => ({ label: `Cột: ${h}`, value: h }))}
                      allowClear
                      status={isMissing ? 'error' : undefined}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ background: '#f8fafc', padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 600 }}>Tổng số:</span>{' '}
                <span style={{ color: '#165b9e', fontWeight: 700 }}>{previewResult?.totalRows}</span>
              </div>
              <div style={{ background: '#f0fdf4', padding: '8px 16px', borderRadius: 8, border: '1px solid #bbf7d0', color: '#166534' }}>
                Hợp lệ: <b>{previewResult?.validCount}</b>
              </div>
              <div style={{ background: '#fef2f2', padding: '8px 16px', borderRadius: 8, border: '1px solid #fecaca', color: '#991b1b' }}>
                Lỗi: <b>{previewResult?.invalidCount}</b>
              </div>
            </div>
            <Table
              size="middle"
              dataSource={previewResult?.previewData}
              columns={previewColumns}
              rowKey="rowNumber"
              rowClassName={(r: any) => r.isValid ? '' : 'ant-table-row-selected'}
              pagination={{ pageSize: 6 }}
              scroll={{ x: 'max-content' }}
              bordered
            />
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent} style={{ textAlign: 'center', padding: '60px 0' }}>
            <CheckCircleFilled style={{ fontSize: 64, color: '#22c55e', marginBottom: 24 }} />
            <h2 style={{ color: '#166534', fontWeight: 700 }}>Nhập dữ liệu thành công!</h2>
            <p style={{ color: '#64748b', fontSize: 16 }}>
              Hệ thống đã lưu thành công{' '}
              <strong style={{ color: '#165b9e' }}>
                {saveResult?.successCount || previewResult?.validCount}
              </strong>{' '}
              bản ghi.
            </p>
            {saveResult?.failCount > 0 && (
              <p style={{ color: '#ef4444', fontSize: 14 }}>
                Không thể lưu: <b>{saveResult.failCount}</b> bản ghi.
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={<div style={{ fontSize: 20, fontWeight: 700, color: '#165b9e' }}>{title}</div>}
      width={900}
      visible={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
      className={styles.importModal}
    >
      <Steps current={current} style={{ padding: 0, marginTop: 24, marginBottom: 16 }}>
        <Step title="Chọn tập tin" />
        <Step title="Ghép cột dữ liệu" />
        <Step title="Xem trước dữ liệu" />
        <Step title="Kết quả xử lý" />
      </Steps>

      {renderStep()}

      <div className={styles.footerActions}>
        <Button icon={<CloseOutlined />} onClick={handleClose} className={styles.btnOutline}>
          HỦY
        </Button>
        <Space size={16}>
          {current > 0 && current < 3 && (
            <Button className={styles.btnOutline} onClick={() => setCurrent(c => c - 1)} disabled={loading}>
              QUAY LẠI
            </Button>
          )}
          {current === 0 && (
            <Button
              type="primary" className={styles.btnPrimary}
              disabled={!file || !selectedSheet}
              onClick={handleProceedToMapping}
            >
              TIẾP THEO <ArrowRightOutlined />
            </Button>
          )}
          {current === 1 && (
            <Button
              type="primary" className={styles.btnPrimary}
              loading={loading} onClick={handleGoToPreview}
            >
              XEM TRƯỚC DỮ LIỆU <ArrowRightOutlined />
            </Button>
          )}
          {current === 2 && (
            <Button
              type="primary" className={styles.btnPrimary}
              loading={loading}
              disabled={!previewResult?.validCount}
              onClick={handleCommit}
            >
              LƯU DỮ LIỆU
            </Button>
          )}
          {current === 3 && (
            <Button type="primary" className={styles.btnPrimary} onClick={handleClose}>
              HOÀN THÀNH
            </Button>
          )}
        </Space>
      </div>
    </Modal>
  );
}