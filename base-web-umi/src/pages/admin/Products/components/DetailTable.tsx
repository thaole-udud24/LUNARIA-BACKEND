import { useState } from 'react';
import DataTable from '@/components/admin/DataTable';

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
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={record.image} alt={text} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #f3f4f6' }} />
          <div>
            <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>{text}</div>
            <div style={{ fontSize: '13px', color: '#9ca3af' }}>SKU: {record.sku}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'LOẠI SẢN PHẨM',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text: string) => <span style={{ color: '#4b5563' }}>{text}</span>,
    },
    {
      title: 'SỐ LƯỢNG BÁN',
      dataIndex: 'sales',
      key: 'sales',
      render: (text: number) => <span style={{ color: '#4b5563' }}>{text}</span>,
    },
    {
      title: 'DOANH THU',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (val: number) => <span style={{ color: '#4b5563' }}>{val?.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'LỢI NHUẬN',
      dataIndex: 'profit',
      key: 'profit',
      render: (val: number) => <span style={{ fontWeight: 700, color: '#1f2937' }}>{val?.toLocaleString('vi-VN')} đ</span>,
    },
  ];

  const voucherColumns = [
    {
      title: 'MÃ VOUCHER / TÊN',
      key: 'info',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 700, color: '#ff9a7a', fontSize: '15px', marginBottom: '4px' }}>{record.code}</div>
          <div style={{ fontSize: '14px', color: '#4b5563' }}>{record.name}</div>
        </div>
      ),
    },
    {
      title: 'LƯỢT DÙNG',
      dataIndex: 'usageCount',
      key: 'usageCount',
      render: (text: number) => <span style={{ color: '#4b5563' }}>{text}</span>,
    },
    {
      title: 'TỔNG TIỀN ĐÃ GIẢM',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      render: (val: number) => <span style={{ color: '#4b5563' }}>{val?.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'DOANH THU KÍCH CẦU',
      dataIndex: 'generatedRevenue',
      key: 'generatedRevenue',
      render: (val: number) => <span style={{ fontWeight: 700, color: '#1f2937' }}>{val?.toLocaleString('vi-VN')} đ</span>,
    },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginTop: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #f3f4f6', marginBottom: '24px' }}>
        <div 
          onClick={() => setActiveTab('products')}
          style={{ 
            cursor: 'pointer', paddingBottom: '12px', fontWeight: 600, fontSize: '15px',
            color: activeTab === 'products' ? '#ff9a7a' : '#9ca3af', 
            borderBottom: activeTab === 'products' ? '2px solid #ff9a7a' : '2px solid transparent',
            transition: 'all 0.3s'
          }}
        >
          Top sản phẩm sinh lời cao
        </div>
        <div 
          onClick={() => setActiveTab('vouchers')}
          style={{ 
            cursor: 'pointer', paddingBottom: '12px', fontWeight: 600, fontSize: '15px',
            color: activeTab === 'vouchers' ? '#ff9a7a' : '#9ca3af', 
            borderBottom: activeTab === 'vouchers' ? '2px solid #ff9a7a' : '2px solid transparent',
            transition: 'all 0.3s'
          }}
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