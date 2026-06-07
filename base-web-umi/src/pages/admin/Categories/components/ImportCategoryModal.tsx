import ImportModal from '@/components/admin/ImportModal'; 
import { previewImportCategories, commitImportCategories } from '@/services/DanhMuc/categories.api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportCategoryModal({ open, onClose, onSuccess }: Props) {
  return (
    <ImportModal
      open={open}
      title="Nhập Dữ Liệu Loại Sản Phẩm"
      fields={[
        { label: 'Tên loại sản phẩm', key: 'name', required: true },
        { label: 'Mã loại sản phẩm', key: 'code', required: true },
        { label: 'Mô tả', key: 'description', required: false },
      ]}
      onClose={onClose}
      onPreview={previewImportCategories}
      onCommit={commitImportCategories}
      onSuccess={onSuccess}
    />
  );
}