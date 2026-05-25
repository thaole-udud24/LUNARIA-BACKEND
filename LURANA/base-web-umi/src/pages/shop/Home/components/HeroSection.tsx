import React from 'react';
import HeroContent from '../UI/HeroContent';
import { getImg } from '../utils'; 

const HeroSection: React.FC = () => {
  const heroData = {
    bgImage: getImg('hero-bg.png'),
    mainProductImg: getImg('anh1-hero.png'),
    textLogoImg: getImg('best-clean-fresh.png'), 
    description: "LUNARIA ra đời từ mong muốn mang đến một định nghĩa dịu dàng hơn về vẻ đẹp. Chúng tôi tin rằng, làn da không cần bị che giấu, mà cần được lắng nghe, chăm sóc và nâng niu đúng cách.",
    buttonText: "Khám phá ngay",
    linkTo: "/products"
  };

  return (
    <section className="hero-section-container">
      <HeroContent {...heroData} />
    </section>
  );
};

export default HeroSection;