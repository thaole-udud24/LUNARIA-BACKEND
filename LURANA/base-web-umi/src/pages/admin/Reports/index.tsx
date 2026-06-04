import { useState, useEffect } from 'react';
import { FileExcelOutlined, FilterOutlined } from '@ant-design/icons';
import { DatePicker, message, Select } from 'antd';
import moment from 'moment';

import { getReportsData, exportRevenueReport } from '@/services/Admin/dashboard.api';

import FinancialCards from './components/FinancialCards';
import TrendChart from './components/TrendChart';
import CategoryDonut from './components/CategoryDonut';
import DetailTable from './components/DetailTable';
import Loading from '@/components/common/Loading';

// Import Component Modal Xuất Dữ Liệu Dùng Chung
import ExportModal, { ExportOption } from '@/components/admin/ExportModal';

import styles from './styles.less';

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
  const [exportLoading, setExportLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'Tất cả loại sản phẩm' }
  ]);

  // State quản lý Modal Xuất
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleMonthChange = (date: any) => {
    if (date) {
      setSelectedMonth(date.format('YYYY-MM'));
    }
  };

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const res = await getReportsData({
          month: selectedMonth,
          categoryId: selectedCategory || undefined,
        });

        if (!res?.success) {
          message.error(res?.message || 'Không thể tải dữ liệu báo cáo.');
          return;
        }

        if (!res?.data) {
          setData({ kpis: {}, trendData: [], categoryData: [], topProducts: [], topVouchers: [] });
          message.warning('Không có dữ liệu cho tháng này.');
          return;
        }

        setData(res.data);

        if (res.data.availableCategories) {
          setCategories([
            { value: '', label: 'Tất cả loại sản phẩm' },
            ...res.data.availableCategories,
          ]);
        }
      } catch (error) {
        message.error('Không thể kết nối đến máy chủ API.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedMonth, selectedCategory]);

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
        fields: selectedFields, // API mới nhận thêm fields
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
    } catch (error) {
      message.error({ content: 'Có lỗi xảy ra khi tải báo cáo.', key: 'exportFile' });
    } finally {
      setExportLoading(false);
    }
  };

  if (loading || !data) {
    return <Loading />;
  }

  return (
    <div className={styles.reportsContainer}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Báo cáo Doanh thu </h1>
          <div className={styles.breadcrumb}>
            <span>Tổng quan</span>
            <span className={styles.separator}>/</span>
            <span className={styles.active}>Báo cáo doanh thu</span>
          </div>
        </div>

        <div className={styles.filterActions}>
          <DatePicker
            picker="month"
            allowClear={false}
            value={selectedMonth ? moment(selectedMonth, 'YYYY-MM') : moment()}
            onChange={handleMonthChange}
            format="MM/YYYY"
            className={styles.datePickerResponsive}
          />

          <Select
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            options={categories}
            className={styles.selectResponsive}
            suffixIcon={<FilterOutlined style={{ color: '#94a3b8' }} />}
          />

          <button
            className={styles.exportBtn}
            onClick={() => setIsExportModalOpen(true)}
          >
            <FileExcelOutlined />
            <span>Xuất dữ liệu</span>
          </button>
        </div>
      </div>

      <FinancialCards kpis={data?.kpis || {}} />

      <div className={styles.chartZone}>
        <div className={styles.trendBox}>
          <TrendChart data={data?.trendData || []} />
        </div>

        <div className={styles.donutBox}>
          <CategoryDonut data={data?.categoryData || []} />
        </div>
      </div>

      <DetailTable
        products={data?.topProducts || []}
        vouchers={data?.topVouchers || []}
      />

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