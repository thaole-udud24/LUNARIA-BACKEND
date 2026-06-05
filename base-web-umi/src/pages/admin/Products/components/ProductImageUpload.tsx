import {
  Upload,
} from 'antd';

import {
  PlusOutlined,
} from '@ant-design/icons';

interface Props {
  value?: any[];

  onChange?: (
    files: any[],
  ) => void;
}

export default function ProductImageUpload({
  value = [],
  onChange,
}: Props) {
  return (
    <Upload
      listType="picture-card"
      beforeUpload={() => false}
      fileList={value}
      onChange={({ fileList }) =>
        onChange?.(fileList)
      }
    >
      <div>
        <PlusOutlined />

        <div>
          Upload
        </div>
      </div>
    </Upload>
  );
}