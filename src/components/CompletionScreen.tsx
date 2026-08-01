import React, { useState } from 'react';
import { motion } from 'motion/react';
import bgImage from '../assets/images/background.png';
import goodImg from '../assets/images/good.png';
import starImg from '../assets/images/star-1.png';
import badge1 from '../assets/images/bedge1.png';
import badge2 from '../assets/images/bedge2.png';
import badge3 from '../assets/images/bedge3.png';
import { soundFx } from '../utils/soundEffects';
import { speechManager } from '../utils/speech';

interface CompletionScreenProps {
  onNext: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ onNext }) => {
  const [badgeText, setBadgeText] = useState({
    title: '오늘도 참 잘했어요!',
    desc: '생각을 이야기해줘서 고마워',
  });
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null);

  const handleButtonClick = () => {
    soundFx.playPop();
    speechManager.stopSpeak();
    onNext();
  };

  const handleBadgeClick = (index: number) => {
    soundFx.playPop();
    soundFx.playSuccess();
    setSelectedBadge(index);

    if (index === 1) {
      const msg = { title: '멋진 이야기!', desc: '너의 이야기는 정말 특별해! ✨' };
      setBadgeText(msg);
      speechManager.speak('멋진 이야기! 너의 이야기는 정말 특별해!');
    } else if (index === 2) {
      const msg = { title: '용기 가득!', desc: '당당하게 말해서 최고야! 🦁' };
      setBadgeText(msg);
      speechManager.speak('용기 가득! 당당하게 말해서 최고야!');
    } else if (index === 3) {
      const msg = { title: '좋은 생각!', desc: '깊고 똑똑한 생각이야! 💡' };
      setBadgeText(msg);
      speechManager.speak('좋은 생각! 깊고 똑똑한 생각이야!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-[#FFFDF5] select-none"
    >
      {/* Background image */}
      <img
        src={bgImage}
        alt="배경"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90"
      />

      {/* Floating Confetti Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[
          { color: '#3B82F6', top: '10%', left: '8%', size: 'w-2.5 h-2.5', delay: 0 },
          { color: '#22C55E', top: '5%', left: '22%', size: 'w-3 h-3', delay: 0.2 },
          { color: '#EC4899', top: '15%', left: '78%', size: 'w-2.5 h-2.5', delay: 0.1 },
          { color: '#F59E0B', top: '22%', left: '88%', size: 'w-3 h-3', delay: 0.3 },
          { color: '#A855F7', top: '35%', left: '5%', size: 'w-2.5 h-2.5', delay: 0.4 },
          { color: '#10B981', top: '55%', left: '12%', size: 'w-3 h-3', delay: 0.15 },
          { color: '#3B82F6', top: '62%', left: '82%', size: 'w-2.5 h-2.5', delay: 0.25 },
          { color: '#F97316', top: '75%', left: '70%', size: 'w-3 h-3', delay: 0.35 },
          { color: '#14B8A6', top: '82%', left: '18%', size: 'w-2.5 h-2.5', delay: 0.05 },
          { color: '#E11D48', top: '88%', left: '90%', size: 'w-2.5 h-2.5', delay: 0.45 },
        ].map((conf, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [0, -12, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + (idx % 3),
              repeat: Infinity,
              delay: conf.delay,
              ease: 'easeInOut',
            }}
            style={{
              backgroundColor: conf.color,
              top: conf.top,
              left: conf.left,
            }}
            className={`absolute rounded-xs ${conf.size} opacity-80`}
          />
        ))}
      </div>

      {/* Top Spacer / Blank Area */}
      <div className="w-full h-6 sm:h-10 shrink-0" />

      {/* Center Content Area */}
      <div className="relative z-20 w-full max-w-md px-5 flex flex-col items-center justify-center gap-4 sm:gap-6 my-auto min-h-0 flex-1">
        {/* Speech Card with good.png background & star-1.png placed above it */}
        <div className="relative w-full max-w-[360px] sm:max-w-[420px] flex flex-col items-center justify-center pt-6 sm:pt-8 shrink-0">
          {/* Star graphic placed above/overlapping top edge of bubble */}
          <div className="absolute -top-8 sm:-top-12 z-20 flex justify-center w-full pointer-events-none">
            <img
              src={starImg}
              alt="별"
              referrerPolicy="no-referrer"
              className="w-28 sm:w-36 h-auto object-contain drop-shadow-md"
            />
          </div>

          <div className="relative w-full flex items-center justify-center mt-2">
            <img
              src={goodImg}
              alt="말풍선"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain drop-shadow-md z-0"
            />
            {/* Text container placed inside the speech bubble with downward offset */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 pt-6 pb-2 text-center pointer-events-none translate-y-12 sm:translate-y-16">
              <h2
                className="text-[#33221B] text-[20px] xs:text-[22px] sm:text-[25px] font-black tracking-tight leading-tight mb-1"
                style={{ fontFamily: "'Jua', sans-serif" }}
              >
                {badgeText.title}
              </h2>
              <p
                className="text-[#66554E] text-[14px] xs:text-[15px] sm:text-[17px] font-semibold"
                style={{ fontFamily: "'Jua', sans-serif" }}
              >
                {badgeText.desc}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Reward Badges */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 w-full pt-1 shrink-0">
          {/* Badge 1: bedge1.png */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBadgeClick(1)}
            className={`flex flex-col items-center cursor-pointer transition-all ${
              selectedBadge === 1 ? 'scale-105 drop-shadow-lg' : ''
            }`}
          >
            <img
              src={badge1}
              alt="멋진 이야기!"
              referrerPolicy="no-referrer"
              className="w-20 xs:w-22 sm:w-28 h-auto object-contain drop-shadow-md max-h-[90px] sm:max-h-[110px]"
            />
          </motion.div>

          {/* Badge 2: bedge2.png */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBadgeClick(2)}
            className={`flex flex-col items-center cursor-pointer transition-all ${
              selectedBadge === 2 ? 'scale-105 drop-shadow-lg' : ''
            }`}
          >
            <img
              src={badge2}
              alt="용기 가득!"
              referrerPolicy="no-referrer"
              className="w-20 xs:w-22 sm:w-28 h-auto object-contain drop-shadow-md max-h-[90px] sm:max-h-[110px]"
            />
          </motion.div>

          {/* Badge 3: bedge3.png */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBadgeClick(3)}
            className={`flex flex-col items-center cursor-pointer transition-all ${
              selectedBadge === 3 ? 'scale-105 drop-shadow-lg' : ''
            }`}
          >
            <img
              src={badge3}
              alt="좋은 생각!"
              referrerPolicy="no-referrer"
              className="w-20 xs:w-22 sm:w-28 h-auto object-contain drop-shadow-md max-h-[90px] sm:max-h-[110px]"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Button Area */}
      <div className="relative z-20 w-full max-w-md px-6 pb-8 sm:pb-12 pt-2 flex justify-center shrink-0">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleButtonClick}
          className="w-full py-3.5 sm:py-4 rounded-full bg-[#FF7E5F] hover:bg-[#FF6B4A] active:bg-[#E05335] text-white text-[20px] sm:text-[24px] font-black tracking-wider shadow-[0_8px_24px_rgba(255,126,95,0.4)] border-2 border-white/40 cursor-pointer transition-all flex items-center justify-center"
        >
          <span style={{ fontFamily: "'Jua', sans-serif" }}>다음엔 뭐 할까?</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
