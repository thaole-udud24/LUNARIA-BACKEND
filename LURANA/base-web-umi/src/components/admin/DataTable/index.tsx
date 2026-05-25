import { Table } from 'antd';

import type {
  TableProps,
} from 'antd';


export default function DataTable<
  T extends object,
>(props: TableProps<T>) {
  const {
    bordered = false,
    pagination = false,
    size = 'middle',
    ...restProps
  } = props;

  return (
    <div className="admin-data-table">
      <Table<T>
        bordered={bordered}
        pagination={pagination}
        size={size}
        {...restProps}
      />
    </div>
  );
}