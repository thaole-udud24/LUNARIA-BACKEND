import ImportModal from '@/components/admin/ImportModal';
import { previewImportPromotions, commitImportPromotions } from '@/services/UuDai/promotions.api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportPromotionModal({ open, onClose, onSuccess }: Props) {
  return (
    <ImportModal
      open={open} 
      title="Nhập Dữ Liệu Khuyến Mãi"
      fields={[
        { label: 'Tên chương trình', key: 'name', required: true },
        { label: 'Loại giảm (PERCENTAGE/FIXED_AMOUNT)', key: 'discountType', required: true },
        { label: 'Giá trị giảm', key: 'discountValue', required: true },
        { label: 'Phạm vi', key: 'applyScope', required: true },
        { label: 'Ngày bắt đầu', key: 'startDate', required: true },
        { label: 'Ngày kết thúc', key: 'endDate', required: true },
        { label: 'Mô tả', key: 'description', required: false },
      ]}
      onClose={onClose} 
      onPreview={previewImportPromotions} 
      onCommit={commitImportPromotions} 
      onSuccess={onSuccess}
    />
  );
}