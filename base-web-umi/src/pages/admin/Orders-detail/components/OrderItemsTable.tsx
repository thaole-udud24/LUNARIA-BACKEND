import DataTable from '@/components/admin/DataTable';
import type { OrderItem } from '@/services/DonHang/types';
import { adminTableStyles as t } from '@/utils/adminTableStyles';

export default function OrderItemsTable({ items }: { items: OrderItem[] }) {
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: OrderItem) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={t.title}>{text}</div>
          <span style={{
            fontSize: 12, background: 'var(--admin-primary-soft)', color: 'var(--admin-text-muted)',
            padding: '2px 8px', borderRadius: 6, alignSelf: 'flex-start', fontWeight: 500,
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
      render: (price: number) => <span style={t.name}>{price.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      render: (qty: number) => <span style={t.code}>{qty}</span>
    },
    {
      title: 'Thành tiền',
      key: 'total',
      align: 'right' as const,
      render: (_: any, record: OrderItem) => (
        <strong style={t.price}>
          {(record.priceSell * record.quantity).toLocaleString('vi-VN')} đ
        </strong>
      ),
    },
  ];

  return <DataTable columns={columns} dataSource={items} pagination={false} rowKey={(record, index) => `${record.productId}-${record.variantName}-${index}`} />;
}