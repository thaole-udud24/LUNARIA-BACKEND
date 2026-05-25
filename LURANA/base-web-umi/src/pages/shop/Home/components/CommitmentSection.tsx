import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { 
  ExperimentOutlined, 
  HeartOutlined, 
  SafetyOutlined, 
  CompassOutlined, 
  SmileOutlined, 
  SolutionOutlined 
} from '@ant-design/icons';
import { getImg } from '../utils';
import CommitBox from '../UI/CommitBox';
import styles from '../UI/CommitBox/index.module.less';

const CommitmentSection: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);

  const leftCommits = [
    {
      icon: <CompassOutlined />,
      title: 'Thuần khiết từ thiên nhiên',
      desc: 'Thành phần có nguồn gốc tự nhiên, được chọn lọc cẩn trọng để đảm bảo sự dịu lành cho làn da.',
    },
    {
      icon: <HeartOutlined />,
      title: 'Tôn trọng sự sống',
      desc: 'LUNARIA cam kết không thử nghiệm trên động vật trong toàn bộ quá trình phát triển sản phẩm.',
    },
    {
      icon: <ExperimentOutlined />,
      title: 'Hướng đến vẻ đẹp bền vững',
      desc: 'Bao bì và quy trình sản xuất hướng đến sự bền vững, giảm tác động đến môi trường.',
    }
  ];

  const rightCommits = [
    {
      icon: <SafetyOutlined />,
      title: 'Kiểm chứng khoa học từ da liễu',
      desc: 'Sản phẩm được kiểm nghiệm da liễu, an toàn và phù hợp với cả làn da nhạy cảm.',
    },
    {
      icon: <SmileOutlined />,
      title: 'Tinh giản để lành tính',
      desc: 'Loại bỏ paraben, sulfate và các chất dễ gây kích ứng, ưu tiên sự lành tính cho da.',
    },
    {
      icon: <SolutionOutlined />,
      title: 'Minh bạch tạo nên niềm tin',
      desc: 'Nguồn gốc nguyên liệu và quy trình sản xuất được công bố rõ ràng, tạo dụng niềm tin lâu dài.',
    }
  ];

  return (
    <section className={styles.commitmentSection}>
      <div className={styles.titleContainer}>
        <h2 className={styles.sectionTitle}>Cam Kết Từ LUNARIA</h2>
      </div>

      <div className={styles.gridContainer}>
        <Row gutter={[32, 0]} align="stretch" justify="center">
          <Col xs={24} lg={8}>
            <div className={styles.sideColumn}>
              {leftCommits.map((item, index) => (
                <CommitBox
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  desc={item.desc}
                  isRightAlign={true}
                />
              ))}
            </div>
          </Col>

          <Col xs={24} lg={8} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={styles.centerImageWrapper}>
              <img src={getImg('anh3-commitment.png')} alt="Frudia Pudding Cream" />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div className={styles.sideColumn}>
              {rightCommits.map((item, index) => (
                <CommitBox
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  desc={item.desc}
                  isRightAlign={false}
                />
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default CommitmentSection;