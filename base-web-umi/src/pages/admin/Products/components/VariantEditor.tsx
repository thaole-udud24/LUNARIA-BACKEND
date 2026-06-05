import {
  Button,
  InputNumber,
  Switch,
} from 'antd';

import type {
  VariantType,
} from '@/types/catalog';

interface Props {
  hasVariant: boolean;

  variants: VariantType[];

  onToggleVariant: (
    checked: boolean,
  ) => void;

  onAddVariant: () => void;

  onVariantChange: <
    K extends keyof VariantType,
  >(
    index: number,
    field: K,
    value: VariantType[K],
  ) => void;
}

export default function VariantEditor({
  hasVariant,
  variants,
  onToggleVariant,
  onAddVariant,
  onVariantChange,
}: Props) {
  const calculateProfit = (
    price?: number | null,
    importPrice?: number | null,
  ) => {
    return (
      Number(price || 0) -
      Number(importPrice || 0)
    );
  };

  return (
    <div className="variant-wrapper">
      <div className="variant-toggle-box">
        <div>
          <h3>
            Biến thể sản phẩm
          </h3>

          <p>
            Thêm nhiều dung tích/kích thước.
          </p>
        </div>

        <Switch
          checked={hasVariant}
          onChange={onToggleVariant}
        />
      </div>

      {hasVariant && (
        <>
          <table className="variant-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Khối lượng</th>
                <th>Giá nhập</th>
                <th>Giá bán</th>
                <th>Lợi nhuận</th>
                <th>Tồn kho</th>
              </tr>
            </thead>

            <tbody>
              {variants.map(
                (
                  item,
                  index,
                ) => {
                  const variantProfit =
                    calculateProfit(
                      item.price,
                      item.importPrice,
                    );

                  return (
                    <tr key={index}>
                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <InputNumber
                          value={item.weight}
                          placeholder="300"
                          addonAfter="g"
                          style={{
                            width: '100%',
                          }}
                          onChange={(value) =>
                            onVariantChange(
                              index,
                              'weight',
                              Number(value || 0),
                            )
                          }
                        />
                      </td>

                      <td>
                        <InputNumber
                          value={item.importPrice}
                          style={{
                            width: '100%',
                          }}
                          onChange={(value) =>
                            onVariantChange(
                              index,
                              'importPrice',
                              Number(value || 0),
                            )
                          }
                        />
                      </td>

                      <td>
                        <InputNumber
                          value={item.price}
                          style={{
                            width: '100%',
                          }}
                          onChange={(value) =>
                            onVariantChange(
                              index,
                              'price',
                              Number(value || 0),
                            )
                          }
                        />
                      </td>

                      <td>
                        {variantProfit.toLocaleString()}đ
                      </td>

                      <td>
                        <InputNumber
                          value={item.stock}
                          style={{
                            width: '100%',
                          }}
                          onChange={(value) =>
                            onVariantChange(
                              index,
                              'stock',
                              Number(value || 0),
                            )
                          }
                        />
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>

          <Button
            className="add-variant-btn"
            onClick={onAddVariant}
          >
            + Thêm mới
          </Button>
        </>
      )}
    </div>
  );
}