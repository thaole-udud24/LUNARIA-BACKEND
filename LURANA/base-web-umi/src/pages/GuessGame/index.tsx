import React, { useEffect, useState } from 'react';
import { Input, Button, Modal, Drawer, message } from 'antd';
import {
  HeartFilled,
  StarFilled,
  SmileFilled,
  FrownFilled,
  ReloadOutlined,
  SendOutlined,
  HistoryOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import styles from './index.less';

const GuessGame: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(10);
  const [history, setHistory] = useState<number[]>([]);
  const [status, setStatus] = useState<'playing' | 'win' | 'lose'>('playing');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);

  const initGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setAttempts(10);
    setHistory([]);
    setStatus('playing');
    setGuess('');
    setIsModalVisible(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = () => {
    const value = parseInt(guess, 10);

    if (isNaN(value) || value < 1 || value > 100) {
      message.warning('Vui lòng nhập số từ 1 đến 100');
      return;
    }

    const remaining = attempts - 1;
    setAttempts(remaining);
    setHistory([value, ...history]);

    if (value === targetNumber) {
      setStatus('win');
      setIsModalVisible(true);
    } else if (remaining === 0) {
      setStatus('lose');
      setIsModalVisible(true);
    } else {
      message.error(
        value < targetNumber
          ? 'Số bạn đoán thấp hơn'
          : 'Số bạn đoán cao hơn',
      );
    }

    setGuess('');
  };

  return (
    <div className={styles.appWrapper}>
      <div className={styles.laptopFrame}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.mainTitle}>
              Gia Tài Của Ngoại <StarFilled className={styles.starIcon} />
            </h1>
            <p className={styles.subTitle}>Tìm số bí mật từ 1 đến 100</p>
          </div>

          <Button
            className={styles.historyBtn}
            icon={<HistoryOutlined />}
            onClick={() => setIsDrawerVisible(true)}
          >
            Nhật ký
          </Button>
        </div>

        <div className={styles.playZone}>
          <div className={styles.mainCard}>
            <div className={styles.attemptBadge}>
              <ThunderboltFilled />
              Còn <span className={styles.highlightText}>{attempts}</span> lượt
            </div>

            <Input
              value={guess}
              placeholder="Nhập số"
              className={styles.compactInput}
              onChange={(e) => setGuess(e.target.value)}
              onPressEnter={handleGuess}
              disabled={status !== 'playing'}
            />

            <Button
              className={styles.sendBtn}
              icon={<SendOutlined />}
              onClick={handleGuess}
              disabled={status !== 'playing'}
            >
              Gửi
            </Button>
          </div>
        </div>
      </div>

      <Modal
        visible={isModalVisible}
        footer={null}
        closable={false}
        centered
        width={380}
        wrapClassName={styles.blinkModalWrapper}
      >
        <div className={styles.modalContent}>
          <div className={styles.statusIcon}>
            {status === 'win' ? (
              <SmileFilled className={styles.winIcon} />
            ) : (
              <FrownFilled className={styles.loseIcon} />
            )}
          </div>

          <h2 className={status === 'win' ? styles.winTitle : styles.loseTitle}>
            {status === 'win' ? 'Bạn đã đoán đúng' : 'Bạn đã hết lượt'}
          </h2>

          <div className={styles.resultBox}>
            Số cần tìm là{' '}
            <span className={styles.targetNum}>{targetNumber}</span>
          </div>

          <Button
            className={styles.retryBtn}
            icon={<ReloadOutlined />}
            onClick={initGame}
          >
            Chơi lại
          </Button>
        </div>
      </Modal>

      <Drawer
        title={
          <span>
            <HeartFilled /> Lịch sử dự đoán
          </span>
        }
        placement="right"
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        width={300}
      >
        {history.length === 0 && <p>Chưa có dữ liệu</p>}
        {history.map((item, index) => (
          <div key={index} className={styles.historyItem}>
            Lần {history.length - index}: <b>{item}</b>
          </div>
        ))}
      </Drawer>
    </div>
  );
};

export default GuessGame;
