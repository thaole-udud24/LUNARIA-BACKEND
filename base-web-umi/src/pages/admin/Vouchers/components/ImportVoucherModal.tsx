import ImportModal from '@/components/admin/ImportModal';
import { previewImportVouchers, commitImportVouchers } from '@/services/UuDai/vouchers.api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportVoucherModal({ open, onClose, onSuccess }: Props) {
  return (
    <ImportModal
      open={open} 
      title="Nhập Dữ Liệu Voucher"
      fields={[
        { label: 'Mã voucher', key: 'voucherCode', required: true },
        { label: 'Tên voucher', key: 'voucherName', required: true },
        { label: 'Loại giảm (PERCENTAGE/FIXED_AMOUNT)', key: 'discountType', required: true },
        { label: 'Giá trị', key: 'discountValue', required: true },
        { label: 'Ngày bắt đầu', key: 'startDate', required: true },
        { label: 'Ngày kết thúc', key: 'endDate', required: true },
      ]}
      onClose={onClose} 
      onPreview={previewImportVouchers} 
      onCommit={commitImportVouchers} 
      onSuccess={onSuccess}
    />
  );
}