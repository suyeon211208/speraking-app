import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Home, BookOpen, Star, Megaphone, User, LogOut, Lock, Gamepad2 } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import characterImage from '../assets/images/charater3.png';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onGoHome?: () => void;
  onGoMyStory?: () => void;
  onGoBadges?: () => void;
  onGoParent?: () => void;
  onGoMiniGame?: () => void;
  activeItem?: 'home' | 'mystory' | 'badges' | 'news' | 'parent' | 'minigame';
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  onGoHome,
  onGoMyStory,
  onGoBadges,
  onGoParent,
  onGoMiniGame,
  activeItem = 'home',
}) => {
  const handleHomeClick = () => {
    soundFx.playPop();
    onClose();
    if (onGoHome) {
      onGoHome();
    }
  };

  const handleMyStoryClick = () => {
    soundFx.playPop();
    onClose();
    if (onGoMyStory) {
      onGoMyStory();
    }
  };

  const handleBadgesClick = () => {
    soundFx.playPop();
    onClose();
    if (onGoBadges) {
      onGoBadges();
    }
  };

  const handleParentClick = () => {
    soundFx.playPop();
    onClose();
    if (onGoParent) {
      onGoParent();
    }
  };

  const handleMiniGameClick = () => {
    soundFx.playPop();
    onClose();
    if (onGoMiniGame) {
      onGoMiniGame();
    }
  };

  const handleItemClick = () => {
    soundFx.playPop();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              soundFx.playPop();
              onClose();
            }}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 w-[85%] max-w-[340px] h-full bg-[#FFFDF5] rounded-r-[36px] p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xl"
          >
            {/* Top Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  soundFx.playPop();
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-[#FFF0E6] text-[#FF6F3C] flex items-center justify-center cursor-pointer hover:bg-[#FFE2D1] active:scale-95 transition-all shadow-xs"
                title="닫기"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center mt-0 mb-2">
              {/* Character Avatar with Star Badge */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[4px] border-[#FFE2CC] bg-white p-1 flex items-center justify-center shadow-xs">
                <img
                  src={characterImage}
                  alt="레디"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                {/* Yellow Star Badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#F59E0B] text-white flex items-center justify-center border-2 border-white shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-white stroke-none" />
                </div>
              </div>

              {/* Speech Greeting Card */}
              <div className="w-full mt-2 bg-white rounded-[20px] px-3 py-2 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-orange-100/60">
                <p
                  className="text-[#33221B] text-[15px] sm:text-[16px] leading-snug"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  안녕! <span className="text-[#96320E] font-black">레디</span>야.
                </p>
                <p
                  className="text-[#66554E] text-[12px] sm:text-[13px] mt-0.5"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  오늘도 같이 이야기하자!
                </p>
              </div>
            </div>

            {/* Main Navigation List */}
            <div className="flex flex-col gap-2 my-auto py-1">
              {/* 1. 홈으로 (Home) */}
              <button
                onClick={handleHomeClick}
                className={`w-full rounded-[20px] flex items-center gap-3 cursor-pointer transition-all text-left ${
                  activeItem === 'home'
                    ? 'bg-white p-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-orange-100/80 hover:bg-orange-50/50 active:scale-[0.98]'
                    : 'px-3 py-2 hover:bg-white/60 active:scale-[0.98]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#FFEFE2] text-[#96320E] flex items-center justify-center shrink-0">
                  <Home className={`w-4.5 h-4.5 ${activeItem === 'home' ? 'fill-[#96320E]/20 stroke-[2.2]' : 'stroke-[2.2]'}`} />
                </div>
                <span
                  className={`${activeItem === 'home' ? 'text-[#6E2207] text-[17px] font-bold' : 'text-[#423835] text-[16px]'} tracking-wide`}
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  홈으로
                </span>
              </button>

              {/* 2. 내 이야기 (My Story) */}
              <button
                onClick={handleMyStoryClick}
                className={`w-full rounded-[20px] flex items-center gap-3 cursor-pointer transition-all text-left ${
                  activeItem === 'mystory'
                    ? 'bg-white p-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-orange-100/80 hover:bg-orange-50/50 active:scale-[0.98]'
                    : 'px-3 py-2 hover:bg-white/60 active:scale-[0.98]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                  <BookOpen className={`w-4.5 h-4.5 ${activeItem === 'mystory' ? 'fill-[#0284C7]/20 stroke-[2.2]' : 'stroke-[2.2]'}`} />
                </div>
                <span
                  className={`${activeItem === 'mystory' ? 'text-[#6E2207] text-[17px] font-bold' : 'text-[#423835] text-[16px]'} tracking-wide`}
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  내 이야기
                </span>
              </button>

              {/* 3. 내 배지 (My Badges) */}
              <button
                onClick={handleBadgesClick}
                className={`w-full rounded-[20px] flex items-center gap-3 cursor-pointer transition-all text-left ${
                  activeItem === 'badges'
                    ? 'bg-white p-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-orange-100/80 hover:bg-orange-50/50 active:scale-[0.98]'
                    : 'px-3 py-2 hover:bg-white/60 active:scale-[0.98]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#FEF9C3] text-[#CA8A04] flex items-center justify-center shrink-0">
                  <Star className={`w-4.5 h-4.5 ${activeItem === 'badges' ? 'fill-[#CA8A04]/20 stroke-[2.2]' : 'stroke-[2.2]'}`} />
                </div>
                <span
                  className={`${activeItem === 'badges' ? 'text-[#6E2207] text-[17px] font-bold' : 'text-[#423835] text-[16px]'} tracking-wide`}
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  내 배지
                </span>
              </button>

              {/* 4. 미니게임 (Mini Game) */}
              <button
                onClick={handleMiniGameClick}
                className={`w-full rounded-[20px] flex items-center gap-3 cursor-pointer transition-all text-left ${
                  activeItem === 'minigame'
                    ? 'bg-white p-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-orange-100/80 hover:bg-orange-50/50 active:scale-[0.98]'
                    : 'px-3 py-2 hover:bg-white/60 active:scale-[0.98]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
                  <Gamepad2 className={`w-4.5 h-4.5 ${activeItem === 'minigame' ? 'fill-[#9333EA]/20 stroke-[2.2]' : 'stroke-[2.2]'}`} />
                </div>
                <span
                  className={`${activeItem === 'minigame' ? 'text-[#6E2207] text-[17px] font-bold' : 'text-[#423835] text-[16px]'} tracking-wide flex items-center gap-1.5`}
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  <span>미니게임</span>
                  <span className="text-[10px] text-white font-bold bg-[#A855F7] px-1.5 py-0.2 rounded-full">NEW</span>
                </span>
              </button>

              {/* 4. 새 소식 (News) */}
              <button
                onClick={handleItemClick}
                className={`w-full rounded-[20px] flex items-center gap-3 cursor-pointer transition-all text-left ${
                  activeItem === 'news'
                    ? 'bg-white p-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-orange-100/80 hover:bg-orange-50/50 active:scale-[0.98]'
                    : 'px-3 py-2 hover:bg-white/60 active:scale-[0.98]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Megaphone className={`w-4.5 h-4.5 ${activeItem === 'news' ? 'fill-[#4F46E5]/20 stroke-[2.2]' : 'stroke-[2.2]'}`} />
                </div>
                <span
                  className={`${activeItem === 'news' ? 'text-[#6E2207] text-[17px] font-bold' : 'text-[#423835] text-[16px]'} tracking-wide`}
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  새 소식
                </span>
              </button>
            </div>

            {/* Divider with Heart */}
            <div className="flex items-center gap-2 my-1 px-2 opacity-30">
              <div className="flex-1 h-[1px] bg-[#96320E]" />
              <span className="text-[#96320E] text-xs">♡</span>
              <div className="flex-1 h-[1px] bg-[#96320E]" />
            </div>

            {/* Bottom 2 Cards & Note */}
            <div className="flex flex-col gap-1.5 mt-auto pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                {/* 보호자 메뉴 */}
                <button
                  onClick={handleParentClick}
                  className={`rounded-[18px] p-2.5 flex flex-col items-center justify-center gap-1 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border cursor-pointer active:scale-[0.96] transition-all ${
                    activeItem === 'parent'
                      ? 'bg-orange-50 border-orange-200 text-[#C2410C]'
                      : 'bg-white border-slate-100/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center">
                    <User className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span
                    className="text-[#96320E] text-[13px]"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    보호자 메뉴
                  </span>
                </button>

                {/* 로그아웃 */}
                <button
                  onClick={handleItemClick}
                  className="bg-white rounded-[18px] p-2.5 flex flex-col items-center justify-center gap-1 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100/80 cursor-pointer hover:bg-slate-50 active:scale-[0.96] transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center">
                    <LogOut className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span
                    className="text-[#475569] text-[13px]"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    로그아웃
                  </span>
                </button>
              </div>

              {/* Subtitle Note */}
              <p
                className="text-center text-[#94A3B8] text-[11px] flex items-center justify-center gap-1 mt-0.5"
                style={{ fontFamily: "'Jua', sans-serif" }}
              >
                <Lock className="w-3 h-3 stroke-[2.5]" />
                <span>보호자 메뉴는 비밀번호가 필요해요</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
