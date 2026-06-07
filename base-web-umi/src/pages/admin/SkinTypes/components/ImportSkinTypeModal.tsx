import ImportModal from '@/components/admin/ImportModal';
import { previewImportSkinTypes, commitImportSkinTypes } from '@/services/LoaiDa/skin-types.api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportSkinTypeModal({ open, onClose, onSuccess }: Props) {
  return (
    <ImportModal
      open={open}
      title="Nhập Dữ Liệu Loại Da"
      fields={[
        { label: 'Tên loại da', key: 'name', required: true },
        { label: 'Mã loại da', key: 'code', required: true },
        { label: 'Mô tả', key: 'description', required: false },
      ]}
      onClose={onClose}
      onPreview={previewImportSkinTypes}
      onCommit={commitImportSkinTypes}
      onSuccess={onSuccess}
    />
  );
}