import { useState } from 'react';
import DataTable from '@/components/admin/DataTable';

export default function DetailTable({ products = [], vouchers = [] }: { products?: any[], vouchers?: any[] }) {
  const [activeTab, setActiveTab] = useState<'products' | 'vouchers'>('products');

  const productCols = [
    {
      title: 'SẢN PHẨM',
      render: (_: any, r: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src={r.image || 'https://via.placeholder.com/48'} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 600, color: '#1F2937' }}>{r.name}</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>SKU: {r.sku}</div>
          </div>
        </div>
      ),
    },
    { title: 'DOANH THU', dataIndex: 'revenue', render: (v: number) => `${v?.toLocaleString('vi-VN')} đ` },
    { title: 'LỢI NHUẬN', dataIndex: 'profit', render: (v: number) => <strong style={{ color: '#FFA78A' }}>{v?.toLocaleString('vi-VN')} đ</strong> },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 24, padding: 28, marginTop: 32, border: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid #F3E5DF', marginBottom: 24 }}>
        <div 
          onClick={() => setActiveTab('products')}
          style={{ cursor: 'pointer', paddingBottom: 16, fontWeight: 700, fontSize: 15, color: activeTab === 'products' ? '#FFA78A' : '#9ca3af', borderBottom: activeTab === 'products' ? '3px solid #FFA78A' : '3px solid transparent' }}
        > Top sản phẩm sinh lời cao </div>
      </div>
      <DataTable columns={productCols} dataSource={products} rowKey="id" pagination={false} />
    </div>
  );
}