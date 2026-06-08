import { useState, useEffect, useCallback } from 'react';
import { FileExcelOutlined, FilterOutlined, SyncOutlined } from '@ant-design/icons';
import { DatePicker, message, Select, Tooltip, Empty, Button } from 'antd';
import moment from 'moment';

import { getReportsData, exportRevenueReport } from '@/services/Admin/dashboard.api';
import { unwrapApiData } from '@/utils/adminApi';

import FinancialCards from './components/FinancialCards';
import TrendChart from './components/TrendChart';
import CategoryDonut from './components/CategoryDonut';
import DetailTable from './components/DetailTable';
import Loading from '@/components/common/Loading';
import ExportModal, { ExportOption } from '@/components/admin/ExportModal';

import styles from './styles.less';

const EMPTY_REPORT = {
  kpis: {},
  trendData: [],
  categoryData: [],
  topProducts: [],
  topVouchers: [],
};

const EXPORT_OPTIONS: ExportOption[] = [
  { label: 'Tên sản phẩm', value: 'Ten_San_Pham' },
  { label: 'SKU', value: 'SKU' },
  { label: 'Loại sản phẩm', value: 'Loai_San_Pham' },
  { label: 'Số lượng bán', value: 'So_Luong_Ban' },
  { label: 'Doanh thu (VNĐ)', value: 'Doanh_Thu_VND' },
  { label: 'Lợi nhuận (VNĐ)', value: 'Loi_Nhuan_VND' },
];

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'Tất cả loại sản phẩm' },
  ]);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchReportData = useCallback(async (showMsg = false) => {
    try {
      setLoading(true);
      setFetchError(false);
      const res = await getReportsData({
        month: selectedMonth,
        categoryId: selectedCategory || undefined,
      });

      const payload = unwrapApiData<any>(res);
      if (!payload) {
        setData(EMPTY_REPORT);
        setFetchError(true);
        message.error('Không thể tải dữ liệu báo cáo.');
        return;
      }

      setData(payload);
      setLastUpdated(new Date());

      if (payload.availableCategories) {
        setCategories([
          { value: '', label: 'Tất cả loại sản phẩm' },
          ...payload.availableCategories,
        ]);
      }

      if (showMsg) message.success('Đã cập nhật báo cáo!');
    } catch {
      setData(EMPTY_REPORT);
      setFetchError(true);
      message.error('Không thể kết nối đến máy chủ API.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedCategory]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleMonthChange = (date: moment.Moment | null) => {
    if (date) setSelectedMonth(date.format('YYYY-MM'));
  };

  const handleExecuteExport = async (selectedFields: string[]) => {
    if (selectedFields.length === 0) {
      message.warning('Vui lòng chọn ít nhất một trường dữ liệu để xuất!');
      return;
    }

    try {
      setExportLoading(true);
      message.loading({ content: 'Đang trích xuất báo cáo...', key: 'exportFile' });

      const blob = await exportRevenueReport({
        month: selectedMonth,
        categoryId: selectedCategory || undefined,
        fields: selectedFields,
      });

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bao_Cao_Doanh_Thu_${selectedMonth}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success({ content: 'Tải báo cáo thành công!', key: 'exportFile' });
      setIsExportModalOpen(false);
    } catch {
      message.error({ content: 'Có lỗi xảy ra khi tải báo cáo.', key: 'exportFile' });
    } finally {
      setExportLoading(false);
    }
  };

  if (loading && !data) {
    return <Loading />;
  }

  const reportData = data || EMPTY_REPORT;

  return (
    <div className={styles.reportsContainer}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Báo cáo Doanh thu</h1>
          <div className={styles.breadcrumb}>
            <span>Tổng quan</span>
            <span className={styles.separator}>/</span>
            <span className={styles.active}>Báo cáo doanh thu</span>
          </div>
          <div className={styles.metaRow}>
            Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
            <Tooltip title="Làm mới">
              <SyncOutlined spin={loading} className={styles.refreshIcon} onClick={() => fetchReportData(true)} />
            </Tooltip>
          </div>
        </div>

        <div className={styles.filterActions}>
          <DatePicker
            picker="month"
            allowClear={false}
            value={moment(selectedMonth, 'YYYY-MM')}
            onChange={handleMonthChange}
            format="MM/YYYY"
            className={styles.datePickerResponsive}
          />

          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories}
            className={styles.selectResponsive}
            suffixIcon={<FilterOutlined style={{ color: 'var(--admin-text-subtle)' }} />}
          />

          <button type="button" className={styles.exportBtn} onClick={() => setIsExportModalOpen(true)}>
            <FileExcelOutlined />
            <span>Xuất dữ liệu</span>
          </button>
        </div>
      </div>

      {fetchError ? (
        <div className={styles.errorBox}>
          <Empty description="Không tải được báo cáo doanh thu">
            <Button type="primary" onClick={() => fetchReportData(true)}>Thử lại</Button>
          </Empty>
        </div>
      ) : (
        <>
          <FinancialCards kpis={reportData.kpis || {}} />

          <div className={styles.chartZone}>
            <div className={styles.trendBox}>
              <TrendChart data={reportData.trendData || []} />
            </div>
            <div className={styles.donutBox}>
              <CategoryDonut data={reportData.categoryData || []} />
            </div>
          </div>

          <DetailTable
            products={reportData.topProducts || []}
            vouchers={reportData.topVouchers || []}
          />
        </>
      )}

      <ExportModal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        options={EXPORT_OPTIONS}
        onExport={handleExecuteExport}
        loading={exportLoading}
      />
    </div>
  );
}
