import { Table, Empty } from 'antd';
import type { TableProps } from 'antd';
import './index.less';

export default function DataTable<T extends object>(props: TableProps<T>) {
  const {
    bordered = false,
    pagination = false,
    size = 'middle',
    locale,
    scroll,
    ...restProps
  } = props;

  const customLocale = {
    emptyText: (
      <div className="empty-state-container">
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description={<span className="empty-state-text">Chưa có dữ liệu</span>} 
        />
      </div>
    ),
    ...locale,
  };

  return (
    <div className="beautiful-table-wrapper">
      <Table<T>
        className="beautiful-table"
        bordered={bordered}
        pagination={pagination}
        size={size}
        locale={customLocale}
        scroll={{ x: 'max-content', ...scroll }}
        {...restProps}
      />
    </div>
  );
}