import { Input, InputNumber, Button, Card, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ProductVariant } from '@/services/SanPham/types';
import styles from './VariantEditor.less';

interface Props {
  value?: ProductVariant[];
  onChange?: (val: ProductVariant[]) => void;
}

export default function VariantEditor({ value = [], onChange }: Props) {
  const handleAdd = () => {
    const newVariant: ProductVariant = {
      variantName: '',
      weight: 0,
      priceImport: 0,
      priceSell: 0,
      stockQty: 0,
      stockAlert: 0,
    };
    onChange?.([...value, newVariant]);
  };

  const handleRemove = (index: number) => {
    const newData = [...value];
    newData.splice(index, 1);
    onChange?.(newData);
  };

  const handleChange = (
    index: number,
    field: keyof ProductVariant,
    val: string | number | null,
  ) => {
    const newData = [...value];
    newData[index] = {
      ...newData[index],
      [field]: val ?? 0,
    };
    onChange?.(newData);
  };

  return (
    <div className={styles.container}>
      {value.length === 0 ? (
        <Card className={styles.emptyCard}>
          <Empty description="Chưa có phân loại sản phẩm" />
        </Card>
      ) : (
        value.map((item, index) => (
          <Card
            key={index}
            className={styles.variantCard}
            title={`Phân loại #${index + 1}`}
            extra={
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleRemove(index)}
              />
            }
          >
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Tên phân loại</label>
                <Input
                  size="large"
                  placeholder="VD: Tuýp 50g"
                  value={item.variantName}
                  onChange={(e) => handleChange(index, 'variantName', e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Trọng lượng</label>
                <InputNumber
                  size="large"
                  min={0}
                  addonAfter="g"
                  className={styles.fullWidth}
                  value={item.weight}
                  onChange={(v) => handleChange(index, 'weight', v)}
                />
              </div>

              <div className={styles.field}>
                <label>Giá nhập</label>
                <InputNumber
                  size="large"
                  min={0}
                  addonAfter="đ"
                  className={styles.fullWidth}
                  value={item.priceImport}
                  formatter={(v) =>
                    v !== undefined && v !== null ? Number(v).toLocaleString('vi-VN') : ''
                  }
                  parser={(v) => Number(v?.replace(/[^\d]/g, '') || 0)}
                  onChange={(v) => handleChange(index, 'priceImport', v)}
                />
              </div>

              <div className={styles.field}>
                <label>Giá bán</label>
                <InputNumber
                  size="large"
                  min={0}
                  addonAfter="đ"
                  className={styles.fullWidth}
                  value={item.priceSell}
                  formatter={(v) =>
                    v !== undefined && v !== null ? Number(v).toLocaleString('vi-VN') : ''
                  }
                  parser={(v) => Number(v?.replace(/[^\d]/g, '') || 0)}
                  onChange={(v) => handleChange(index, 'priceSell', v)}
                />
              </div>

              <div className={styles.field}>
                <label>Tồn kho</label>
                <InputNumber
                  size="large"
                  min={0}
                  className={styles.fullWidth}
                  value={item.stockQty}
                  onChange={(v) => handleChange(index, 'stockQty', v)}
                />
              </div>

              <div className={styles.field}>
                <label>Ngưỡng cảnh báo tồn</label>
                <InputNumber
                  size="large"
                  min={0}
                  className={styles.fullWidth}
                  value={item.stockAlert ?? 0}
                  onChange={(v) => handleChange(index, 'stockAlert', v)}
                />
              </div>

              {(item.reservedQty ?? 0) > 0 && (
                <div className={styles.field}>
                  <label>Đang giữ chỗ (readonly)</label>
                  <InputNumber
                    size="large"
                    className={styles.fullWidth}
                    value={item.reservedQty}
                    disabled
                  />
                </div>
              )}
            </div>
          </Card>
        ))
      )}

      <Button block icon={<PlusOutlined />} onClick={handleAdd} className={styles.addButton}>
        Thêm phân loại sản phẩm
      </Button>
    </div>
  );
}
