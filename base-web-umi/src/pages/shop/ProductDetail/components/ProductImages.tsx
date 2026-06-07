import React, { useState, useEffect, useMemo } from 'react';
import { PictureOutlined } from '@ant-design/icons';
import { buildProductGallery, resolveImageUrl, MAX_GALLERY_IMAGES } from '../utils';

interface ProductImagesProps {
  mainImage?: string;
  galleryImages?: string[];
}

type ThumbItem = {
  key: string;
  url: string;
  label: string;
  isEmpty: boolean;
};

const ProductImages: React.FC<ProductImagesProps> = ({
  mainImage: mainImageProp,
  galleryImages: galleryImagesProp,
}) => {
  const galleryData = useMemo(
    () => buildProductGallery({ mainImage: mainImageProp, galleryImages: galleryImagesProp }),
    [mainImageProp, galleryImagesProp],
  );

  /** Luôn hiển thị 6 ô: 1 ảnh chính + 5 ảnh phụ */
  const thumbItems: ThumbItem[] = useMemo(() => {
    const items: ThumbItem[] = [
      {
        key: 'main',
        url: galleryData.mainImage,
        label: 'Ảnh chính',
        isEmpty: !galleryData.mainImage,
      },
    ];

    for (let i = 0; i < MAX_GALLERY_IMAGES; i += 1) {
      const url = galleryData.gallerySlots[i] || '';
      items.push({
        key: `gallery-${i}`,
        url,
        label: `Ảnh phụ ${i + 1}`,
        isEmpty: !url,
      });
    }

    return items;
  }, [galleryData]);

  const firstValidIndex = useMemo(
    () => thumbItems.findIndex((item) => item.url && !item.isEmpty),
    [thumbItems],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [brokenMap, setBrokenMap] = useState<Record<string, boolean>>({});
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    setActiveIndex(firstValidIndex >= 0 ? firstValidIndex : 0);
    setBrokenMap({});
    setAnimTick(0);
  }, [mainImageProp, galleryImagesProp, firstValidIndex]);

  const activeItem = thumbItems[activeIndex];
  const activeBroken = !activeItem?.url || activeItem.isEmpty || brokenMap[activeItem.key];

  const selectThumb = (index: number) => {
    const item = thumbItems[index];
    if (!item?.url || item.isEmpty || brokenMap[item.key]) return;
    if (index === activeIndex) return;
    setActiveIndex(index);
    setAnimTick((t) => t + 1);
  };

  const filledCount = thumbItems.filter((item) => item.url && !brokenMap[item.key]).length;

  return (
    <div className="pd-gallery">
      <div className="pd-gallery__stage">
        <div className="pd-gallery__main" key={animTick}>
          {activeBroken ? (
            <div className="pd-gallery__placeholder">
              <PictureOutlined />
              <span>NO IMG</span>
              <small>{activeItem?.label}</small>
            </div>
          ) : (
            <img
              src={resolveImageUrl(activeItem.url)}
              alt={activeItem.label}
              className="pd-gallery__main-img"
              onError={() => {
                setBrokenMap((prev) => ({ ...prev, [activeItem.key]: true }));
              }}
            />
          )}
        </div>
      </div>

      <div className="pd-gallery__thumbs-head">
        <span>Hình ảnh sản phẩm</span>
        <em>{filledCount}/6</em>
      </div>

      <div className="pd-gallery__thumbs" role="tablist" aria-label="Ảnh sản phẩm">
        {thumbItems.map((item, index) => {
          const isActive = index === activeIndex;
          const isBroken = brokenMap[item.key];
          const isClickable = Boolean(item.url) && !item.isEmpty && !isBroken;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={item.label}
              disabled={!isClickable}
              className={`pd-gallery__thumb ${isActive ? 'is-active' : ''} ${!isClickable ? 'is-empty' : ''} ${index === 0 ? 'is-main' : ''}`}
              onClick={() => selectThumb(index)}
            >
              {!isClickable ? (
                <span className="pd-gallery__thumb-empty">
                  <PictureOutlined />
                  <em>{index === 0 ? 'Chính' : `#${index}`}</em>
                </span>
              ) : (
                <img
                  src={resolveImageUrl(item.url)}
                  alt={item.label}
                  onError={() => setBrokenMap((prev) => ({ ...prev, [item.key]: true }))}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImages;
