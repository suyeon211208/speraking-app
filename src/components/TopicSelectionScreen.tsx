import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Menu } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import { speechManager } from '../utils/speech';
import { TopicOption } from '../types';
import { HamburgerMenu } from './HamburgerMenu';

import bgImage from '../assets/images/background2.png';
import characterImage from '../assets/images/charater3.png';
import testImage from '../assets/images/test.png';
import starImage from '../assets/images/star.png';

interface TopicSelectionScreenProps {
  onSelectTopicAndStart: (topic: TopicOption) => void;
  onBackToMain?: () => void;
  onGoMyStory?: () => void;
  onGoBadges?: () => void;
  onGoParent?: () => void;
  onGoMiniGame?: () => void;
}

export const TOPIC_OPTIONS: TopicOption[] = [
  {
    id: 'school',
    emoji: '🏫',
    title: '학교 이야기',
    promptText: '오늘 학교(유치원)에서 무슨 재밌는 일 있었어?',
    color: '#4A90E2',
    bgColor: '#EBF3FA',
  },
  {
    id: 'animal',
    emoji: '🦁',
    title: '좋아하는 동물',
    promptText: '네가 세상에서 제일 좋아하는 동물이 뭐야? 왜 좋아해?',
    color: '#FF6F59',
    bgColor: '#FFF0ED',
  },
  {
    id: 'fantasy',
    emoji: '🏰',
    title: '상상 나라',
    promptText: '만약 네가 마법을 쓸 수 있다면 무슨 마법을 써보고 싶어?',
    color: '#A06CD5',
    bgColor: '#F6EFFC',
  },
  {
    id: 'food',
    emoji: '🍦',
    title: '맛있는 음식',
    promptText: '오늘 가장 맛있게 먹은 음식이 뭐야? 과자나 과일도 좋아!',
    color: '#FFB300',
    bgColor: '#FFF8E7',
  },
];

export const TopicSelectionScreen: React.FC<TopicSelectionScreenProps> = ({
  onSelectTopicAndStart,
  onBackToMain,
  onGoMyStory,
  onGoBadges,
  onGoParent,
  onGoMiniGame,
}) => {
  // Default selected topic is 'animal' as shown in screenshot
  const [selectedTopicId, setSelectedTopicId] = useState<string>('animal');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleCardClick = (topicId: string) => {
    soundFx.playPop();
    setSelectedTopicId(topicId);
  };

  const handleStart = () => {
    soundFx.playSuccess();
    const selected = TOPIC_OPTIONS.find((t) => t.id === selectedTopicId) || TOPIC_OPTIONS[1];
    onSelectTopicAndStart(selected);
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-[#FFFDF5] select-none">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Hamburger Menu Drawer */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onGoHome={onBackToMain}
        onGoMyStory={onGoMyStory}
        onGoBadges={onGoBadges}
        onGoParent={onGoParent}
        onGoMiniGame={onGoMiniGame}
      />

      {/* Top Banner & Navigation Header */}
      <div className="relative z-30 w-full max-w-md px-5 pt-4 flex items-center justify-between">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => {
            soundFx.playPop();
            setIsMenuOpen(true);
          }}
          className="w-11 h-11 rounded-full bg-white/95 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-amber-100/50 flex items-center justify-center cursor-pointer hover:bg-white active:scale-95 transition-all"
          title="메뉴"
        >
          <Menu className="w-6 h-6 text-[#96320E]" />
        </button>
      </div>



      {/* Character & Speech Bubble Section */}
      <div className="relative z-20 w-full max-w-md px-5 pt-2 flex items-center gap-3">
        {/* Red Panda Character Avatar Container */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
          <img
            src={characterImage}
            alt="레디"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>

        {/* Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative flex-1 bg-white rounded-[44px] px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-slate-100"
        >
          {/* Tail pointing left */}
          <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[11px] border-r-white" />

          <p className="text-slate-900 font-extrabold text-[19px] sm:text-[21px] leading-snug tracking-tight">
            오늘은 <span className="text-[#96320E] font-black">무슨 얘기</span>
            <br />
            해볼까?
          </p>
        </motion.div>
      </div>

      {/* 2x2 Topic Selection Grid */}
      <div className="relative z-20 w-full max-w-md px-5 py-4 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 w-full">
          {TOPIC_OPTIONS.map((topic) => {
            const isSelected = selectedTopicId === topic.id;

            return (
              <motion.div
                key={topic.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCardClick(topic.id)}
                className={`relative rounded-[26px] bg-white cursor-pointer select-none overflow-hidden transition-all duration-200 flex flex-col justify-between p-2.5 sm:p-3 aspect-[0.92] ${
                  isSelected
                    ? 'ring-2 ring-[#F05A28] border border-[#F05A28] shadow-[0_10px_28px_rgba(240,90,40,0.20)]'
                    : 'shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100 hover:shadow-md'
                }`}
              >
                {/* Selected Checkmark Badge (Top Right) */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-[#2D6A5D] text-white flex items-center justify-center shadow-md border-2 border-white"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </motion.div>
                )}

                {/* Card Graphic/Illustration Area */}
                <div className="flex-1 w-full rounded-[20px] bg-slate-100/60 border border-slate-200/50 flex items-center justify-center relative overflow-hidden z-0">
                  <img
                    src={testImage}
                    alt={topic.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                </div>

                {/* Bottom Title Banner Pill */}
                <div className="relative z-10 w-full py-2 px-1.5 -mt-[18px] rounded-[17px] bg-white/90 backdrop-blur-xs text-black text-center transition-colors">
                  <span
                    className="text-[15px] sm:text-[17px] tracking-tight block truncate"
                    style={{ fontFamily: "'Jua', sans-serif", fontWeight: 'normal', lineHeight: '22.5px' }}
                  >
                    {topic.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Area: "시작!" Button */}
      <div className="relative z-30 w-full max-w-md px-5 pb-6 sm:pb-8 pt-2 flex justify-center shrink-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleStart}
          className="w-[200px] h-[58px] border-[5px] border-white rounded-[28px] bg-[#2DD4BF] hover:bg-[#14B8A6] active:bg-[#0D9488] text-white font-black text-[22px] sm:text-[25px] tracking-wider shadow-[0_10px_24px_rgba(45,212,191,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span style={{ fontFamily: "'Jua', sans-serif" }}>시작!</span>
          <img src={starImage} alt="star" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" referrerPolicy="no-referrer" />
        </motion.button>
      </div>
    </div>
  );
};
