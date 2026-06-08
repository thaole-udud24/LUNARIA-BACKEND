import { useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { resolveMediaUrl } from '@/utils/adminApi';
import { adminTableStyles as t } from '@/utils/adminTableStyles';
import styles from './DetailTable.less';

interface DetailTableProps {
  products?: any[];
  vouchers?: any[];
}

export default function DetailTable({ products = [], vouchers = [] }: DetailTableProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'vouchers'>('products');

  const productColumns = [
    {
      title: 'SẢN PHẨM',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => (
        <div className={styles.productCell}>
          <img src={resolveMediaUrl(record.image) || '/images/placeholder.png'} alt={record.name} />
          <div>
            <div className={styles.name}>{record.name}</div>
            <div className={styles.sku}>SKU: {record.sku}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'LOẠI SẢN PHẨM',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text: string) => <span style={t.name}>{text || 'Chưa phân loại'}</span>,
    },
    {
      title: 'SỐ LƯỢNG BÁN',
      dataIndex: 'sales',
      key: 'sales',
      align: 'right' as const,
      render: (text: number) => <span style={t.muted}>{text?.toLocaleString()}</span>,
    },
    {
      title: 'DOANH THU',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right' as const,
      render: (val: number) => <span style={t.muted}>{val?.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'LỢI NHUẬN',
      dataIndex: 'profit',
      key: 'profit',
      align: 'right' as const,
      render: (val: number) => <strong style={t.amount}>{val?.toLocaleString('vi-VN')} đ</strong>,
    },
  ];

  const voucherColumns = [
    {
      title: 'MÃ VOUCHER / TÊN',
      key: 'info',
      render: (_: any, record: any) => (
        <div>
          <strong style={t.primaryCode}>{record.code}</strong>
          <div className={styles.sku} style={{ marginTop: '4px' }}>{record.name}</div>
        </div>
      ),
    },
    {
      title: 'LƯỢT DÙNG',
      dataIndex: 'usageCount',
      key: 'usageCount',
      align: 'center' as const,
      render: (text: number) => <span style={t.muted}>{text?.toLocaleString()}</span>,
    },
    {
      title: 'TỔNG TIỀN ĐÃ GIẢM',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      align: 'right' as const,
      render: (val: number) => <span style={t.muted}>{val?.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'DOANH THU KÍCH CẦU',
      dataIndex: 'generatedRevenue',
      key: 'generatedRevenue',
      align: 'right' as const,
      render: (val: number) => <strong style={t.amount}>{val?.toLocaleString('vi-VN')} đ</strong>,
    },
  ];

  return (
    <div className={styles.tableBox}>
      <div className={styles.tabHeader}>
        <div 
          className={`${styles.tabItem} ${activeTab === 'products' ? styles.active : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Top sản phẩm sinh lời cao
        </div>
        <div 
          className={`${styles.tabItem} ${activeTab === 'vouchers' ? styles.active : ''}`}
          onClick={() => setActiveTab('vouchers')}
        >
          Hiệu suất mã Voucher
        </div>
      </div>

      {activeTab === 'products' ? (
        <DataTable 
          columns={productColumns} 
          dataSource={products} 
          rowKey="id" 
          pagination={false} 
        />
      ) : (
        <DataTable 
          columns={voucherColumns} 
          dataSource={vouchers} 
          rowKey="code" 
          pagination={false} 
        />
      )}
    </div>
  );
}