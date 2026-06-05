
import { Input, Select, Button } from 'antd';
import { SearchOutlined, FilterOutlined, FileExcelOutlined } from '@ant-design/icons';
import styles from '../styles.less';

const { Option } = Select;

interface OrderFilterProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  onSearch: () => void;
  onExport: () => void;
}

export default function OrderFilter({ search, setSearch, statusFilter, setStatusFilter, onSearch, onExport }: OrderFilterProps) {
  return (
    <div className={styles.filterArea}>
      <Input
        placeholder="Tìm mã đơn, Tên KH, SĐT..."
        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onPressEnter={onSearch}
        className={styles.searchInput}
        allowClear
      />
      
      <Select
        value={statusFilter}
        onChange={setStatusFilter}
        className={styles.statusSelect}
        suffixIcon={<FilterOutlined style={{ color: '#94a3b8' }} />}
      >
        <Option value="">Tất cả trạng thái</Option>
        <Option value="PENDING">Chờ xác nhận</Option>
        <Option value="PROCESSING">Đang xử lý</Option>
        <Option value="DELIVERED">Đã giao</Option>
        <Option value="CANCELLED">Đã hủy</Option>
      </Select>

      <Button type="primary" onClick={onSearch} className={styles.searchBtn}>
        Tìm kiếm
      </Button>

      <Button icon={<FileExcelOutlined />} onClick={onExport} className={styles.exportBtn}>
        Xuất dữ liệu
      </Button>
    </div>
  );
}