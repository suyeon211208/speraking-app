import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../utils/soundEffects';
import { speechManager } from '../utils/speech';


import bgImage from '../assets/images/background.png';
import characterImage from '../assets/images/character_new.png';

interface MainScreenProps {
  onStartSpeaking: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ onStartSpeaking }) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [characterBounce, setCharacterBounce] = useState(false);
  const [speechText, setSpeechText] = useState({
    highlight1: '안녕!',
    text1: '오늘도 같이',
    highlight2: '이야기',
    text2: '해볼까?',
  });

  const handleCharacterClick = () => {
    soundFx.playPop();
    setCharacterBounce(true);
    setTimeout(() => setCharacterBounce(false), 600);

    const greetingMessages = [
      { highlight1: '안녕!', text1: '오늘도 같이', highlight2: '이야기', text2: '해볼까?' },
      { highlight1: '우와!', text1: '반가워 친구야', highlight2: '레디랑', text2: '놀자!' },
      { highlight1: '오늘', text1: '어떤 신나는', highlight2: '이야기', text2: '가 있을까?' },
    ];

    const randomMsg = greetingMessages[Math.floor(Math.random() * greetingMessages.length)];
    setSpeechText(randomMsg);

    if (!isAudioMuted) {
      speechManager.speak(`${randomMsg.highlight1} ${randomMsg.text1} ${randomMsg.highlight2} ${randomMsg.text2}`);
    }
  };

  const handleStart = () => {
    soundFx.playSuccess();
    onStartSpeaking();
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-[#FFFDF5] select-none">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Playground Background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Main Top Section: Speech Bubble */}
      <div className="relative z-20 w-full max-w-md px-6 pt-6 sm:pt-8 flex flex-col items-center shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full bg-white rounded-[28px] px-6 py-5 sm:py-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] border border-slate-100/60 cursor-pointer"
          onClick={handleCharacterClick}
        >
          {/* Speech Text Content */}
          <div className="text-center font-bold text-[22px] xs:text-[25px] sm:text-[27px] leading-[1.35] text-slate-900 tracking-tight select-none">
            <span className="text-[#FF6849] font-extrabold mr-1.5">{speechText.highlight1}</span>
            <span className="text-slate-800 font-extrabold">{speechText.text1}</span>
            <br />
            <span className="text-[#FF6849] font-extrabold mr-0.5">{speechText.highlight2}</span>
            <span className="text-slate-800 font-extrabold">{speechText.text2}</span>
          </div>

          {/* Speech Bubble Tail */}
          <div className="absolute -bottom-[14px] left-[22%] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-white drop-shadow-[0_4px_3px_rgba(0,0,0,0.02)]" />
        </motion.div>
      </div>

      {/* Middle Section: Red Panda Character */}
      <div className="relative z-20 flex-1 w-full max-w-md flex items-center justify-center py-2 min-h-0 my-auto">
        <motion.div
          className="relative cursor-pointer group flex items-center justify-center h-full w-full max-h-[48vh] sm:max-h-[380px] min-h-[220px]"
          animate={
            characterBounce
              ? { scale: [1, 1.12, 0.96, 1.05, 1], y: [0, -20, 0, -8, 0] }
              : { y: [0, -8, 0] }
          }
          transition={
            characterBounce
              ? { duration: 0.6 }
              : { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
          }
          onClick={handleCharacterClick}
        >
          {/* Gentle Shadow beneath character */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-[8%] max-h-[20px] bg-amber-950/15 rounded-full blur-md" />

          {/* Red Panda Image */}
          <img
            src={characterImage}
            alt="레디 캐릭터"
            referrerPolicy="no-referrer"
            className="h-full max-h-[44vh] sm:max-h-[360px] w-auto max-w-[85vw] sm:max-w-[360px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-transform duration-200 group-hover:scale-105"
          />

          {/* Heart / Sparkle Reaction when tapped */}
          {characterBounce && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.3, y: -40 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-8 text-3xl pointer-events-none"
            >
              💖
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom Action Area: "시작하기" Button */}
      <div className="relative z-30 w-full max-w-md px-6 pb-6 sm:pb-9 shrink-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleStart}
          className="w-full py-3.5 sm:py-4.5 rounded-[26px] bg-[#FF734E] hover:bg-[#FF653D] active:bg-[#F25830] text-white font-extrabold text-[20px] sm:text-[22px] tracking-wide shadow-[0_10px_28px_rgba(255,115,78,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
        >
          <span>시작하기</span>
        </motion.button>
      </div>
    </div>
  );
};
