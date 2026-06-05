import DataTable from '@/components/admin/DataTable';
import type { OrderItem } from '@/services/DonHang/types';

export default function OrderItemsTable({ items }: { items: OrderItem[] }) {
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: OrderItem) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '14px' }}>{text}</div>
          <span style={{ 
            fontSize: '12px', background: '#F3E5DF', color: '#6B7280', 
            padding: '2px 8px', borderRadius: '6px', alignSelf: 'flex-start', fontWeight: 500
          }}>
            {record.variantName}
          </span>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'priceSell',
      key: 'priceSell',
      render: (price: number) => <span style={{ color: '#475569', fontWeight: 500 }}>{price.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      render: (qty: number) => <span style={{ fontWeight: 600, color: '#1F2937' }}>{qty}</span>
    },
    {
      title: 'Thành tiền',
      key: 'total',
      align: 'right' as const,
      render: (_: any, record: OrderItem) => (
        <strong style={{ color: '#FFA78A', fontSize: '15px' }}>
          {(record.priceSell * record.quantity).toLocaleString('vi-VN')} đ
        </strong>
      ),
    },
  ];

  return <DataTable columns={columns} dataSource={items} pagination={false} rowKey="productId" />;
}