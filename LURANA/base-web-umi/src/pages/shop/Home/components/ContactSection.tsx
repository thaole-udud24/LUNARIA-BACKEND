import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { getImg } from '../utils';
import styles from '../UI/ContactSection/index.module.less';

const ContactSection: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <section className={styles.contactSection}>
      <div className={styles.purpleBaseBadge}></div>
      <div className={styles.gridContainer}>
        <div className={styles.asymmetricLayout}>
          
          <div className={styles.floatingFormCard}>
            <div className={styles.brandSubtitle}>LUNARIA</div>
            <h3 className={styles.mainFormTitle}>Hãy Để Chúng Tôi Lắng Nghe</h3>
            
            <Form layout="vertical" className={styles.antdFormFormat}>
              <Form.Item label="Họ và tên:" className={styles.formItemRow}>
                <Input bordered={false} placeholder="Nhập họ và tên của bạn" className={styles.lineInput} />
              </Form.Item>
              
              <Form.Item label="Email:" className={styles.formItemRow}>
                <Input bordered={false} placeholder="Nhập địa chỉ email" className={styles.lineInput} />
              </Form.Item>
              
              <Form.Item label="Số điện thoại :" className={styles.formItemRow}>
                <Input bordered={false} placeholder="Nhập số điện thoại liên hệ" className={styles.lineInput} />
              </Form.Item>
              
              <Form.Item label="Sản phẩm quan tâm:" className={styles.formItemRow}>
                <Input bordered={false} placeholder="Ví dụ: Kem dưỡng ẩm, Tinh chất làm sáng..." className={styles.lineInput} />
              </Form.Item>
              
              <div className={styles.btnCenterWrapper}>
                <Button type="primary" className={styles.accentSubmitBtn}>
                  Nhận yêu cầu tư vấn
                </Button>
              </div>
            </Form>
          </div>

          <div className={styles.imageLayerWrapper}>
            <div className={styles.strokeOuterFrame}></div>
            <div className={styles.productImageFrame}>
              <img src={getImg('anh9-contact.png')} alt="LUNARIA Cosmetics" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;