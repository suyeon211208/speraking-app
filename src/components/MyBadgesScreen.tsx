import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  ChevronLeft,
  X,
  Star,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Trophy,
  Zap,
  Heart,
  Volume2,
} from 'lucide-react';
import { BadgeItem } from '../types';
import { soundFx } from '../utils/soundEffects';
import { speechManager } from '../utils/speech';
import { HamburgerMenu } from './HamburgerMenu';

import bgImage from '../assets/images/background.png';
import characterImage from '../assets/images/charater3.png';
import badge1 from '../assets/images/bedge1.png';
import badge2 from '../assets/images/bedge2.png';
import badge3 from '../assets/images/bedge3.png';
import starImage from '../assets/images/star.png';
import star1Image from '../assets/images/star-1.png';

interface MyBadgesScreenProps {
  onBack: () => void;
  onGoHome: () => void;
  onGoMyStory: () => void;
  onGoParent?: () => void;
  onGoMiniGame?: () => void;
  onStartSpeaking: () => void;
}

const BADGES_LIST: BadgeItem[] = [
  {
    id: 'badge-1',
    title: '멋진 이야기!',
    desc: '세상에서 하나뿐인 특별하고 멋진 이야기를 들려줬어요!',
    condition: '첫 번째 이야기 말하기 완료',
    earned: true,
    earnedDate: '2026.07.28',
    image: badge1,
    emoji: '✨',
    bgColor: '#FFF4ED',
    borderColor: '#FFD8C2',
    category: 'story',
  },
  {
    id: 'badge-2',
    title: '용기 가득!',
    desc: '큰 소리로 씩씩하고 당당하게 이야기를 전달했어요!',
    condition: '당당하게 이야기 발표하기 1회',
    earned: true,
    earnedDate: '2026.07.29',
    image: badge2,
    emoji: '🦁',
    bgColor: '#FFF0ED',
    borderColor: '#FFC8BE',
    category: 'speaking',
  },
  {
    id: 'badge-3',
    title: '좋은 생각!',
    desc: '깊고 똑똑한 아이디어로 반짝반짝 빛나는 생각을 표현했어요!',
    condition: '풍부한 문장으로 답변하기 1회',
    earned: true,
    earnedDate: '2026.07.30',
    image: badge3,
    emoji: '💡',
    bgColor: '#FEF9C3',
    borderColor: '#FDE047',
    category: 'special',
  },
  {
    id: 'badge-4',
    title: '동물박사 탐험가',
    desc: '레디와 함께 귀여운 동물 친구들에 대해 이야기했어요!',
    condition: '동물 주제 이야기 1회 완성',
    earned: true,
    earnedDate: '2026.07.31',
    emoji: '🐾',
    bgColor: '#E0F2FE',
    borderColor: '#7DD3FC',
    category: 'story',
  },
  {
    id: 'badge-5',
    title: '학교 인싸 왕',
    desc: '유치원과 학교에서 있었던 신나는 일들을 씩씩하게 말했어요!',
    condition: '학교 주제 이야기 1회 완성',
    earned: true,
    earnedDate: '2026.08.01',
    emoji: '🏫',
    bgColor: '#DCFCE7',
    borderColor: '#86EFAC',
    category: 'story',
  },
  {
    id: 'badge-6',
    title: '상상력 마법사',
    desc: '상상 속 마법 나라 이야기로 풍부한 모험담을 만들었어요!',
    condition: '상상 나라 주제 이야기 1회 완성',
    earned: true,
    earnedDate: '2026.08.01',
    emoji: '🔮',
    bgColor: '#F3E8FF',
    borderColor: '#D8B4FE',
    category: 'story',
  },
  {
    id: 'badge-7',
    title: '말하기 마스터 🏆',
    desc: '총 10번 이상 레디와 신나게 이야기를 주고받았어요!',
    condition: '이야기 10개 완성하기',
    earned: false,
    emoji: '👑',
    bgColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    category: 'speaking',
    progress: { current: 6, total: 10 },
  },
  {
    id: 'badge-8',
    title: '맛있는 이야기 미식가',
    desc: '좋아하는 맛있는 음식과 과자 이야기를 달콤하게 들려줘요!',
    condition: '맛있는 음식 주제 2회 도전',
    earned: false,
    emoji: '🍦',
    bgColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    category: 'story',
    progress: { current: 0, total: 2 },
  },
  {
    id: 'badge-9',
    title: '3일 연속 출석왕 ☀️',
    desc: '3일 동안 매일매일 잊지 않고 레디를 만나러 왔어요!',
    condition: '3일 연속 말하기 학습 참여',
    earned: false,
    emoji: '🌟',
    bgColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    category: 'attendance',
    progress: { current: 2, total: 3 },
  },
];

export const MyBadgesScreen: React.FC<MyBadgesScreenProps> = ({
  onBack,
  onGoHome,
  onGoMyStory,
  onGoParent,
  onGoMiniGame,
  onStartSpeaking,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const earnedCount = BADGES_LIST.filter((b) => b.earned).length;
  const totalCount = BADGES_LIST.length;

  const filteredBadges = BADGES_LIST.filter((b) => {
    if (filter === 'earned') return b.earned;
    if (filter === 'locked') return !b.earned;
    return true;
  });

  const handleBadgeClick = (badge: BadgeItem) => {
    soundFx.playPop();
    if (badge.earned) {
      soundFx.playSuccess();
      speechManager.speak(`${badge.title}! ${badge.desc}`);
    } else {
      speechManager.speak(`${badge.title}. ${badge.condition} 달성하면 받을 수 있어!`);
    }
    setSelectedBadge(badge);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#FFFDF5] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Background decoration image */}
      <img
        src={bgImage}
        alt="Background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-40"
      />

      {/* Hamburger Menu Drawer */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onGoHome={onGoHome}
        onGoMyStory={onGoMyStory}
        onGoBadges={() => setIsMenuOpen(false)}
        onGoParent={onGoParent}
        onGoMiniGame={onGoMiniGame}
        activeItem="badges"
      />

      {/* Navigation Header */}
      <div className="relative z-30 w-full max-w-md mx-auto px-5 pt-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            soundFx.playPop();
            setIsMenuOpen(true);
          }}
          className="w-11 h-11 rounded-full bg-white/95 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-amber-100/60 flex items-center justify-center cursor-pointer hover:bg-white active:scale-95 transition-all"
          title="메뉴"
        >
          <Menu className="w-6 h-6 text-[#96320E]" />
        </button>

        <div className="flex items-center gap-1.5 bg-white/90 px-4 py-1.5 rounded-full shadow-xs border border-amber-100">
          <Trophy className="w-5 h-5 text-[#F59E0B]" />
          <span
            className="text-[#33221B] text-[18px] font-black"
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            내 배지 상자
          </span>
        </div>

        <button
          onClick={() => {
            soundFx.playPop();
            onBack();
          }}
          className="w-11 h-11 rounded-full bg-white/95 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-amber-100/60 flex items-center justify-center cursor-pointer hover:bg-white active:scale-95 transition-all"
          title="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 text-[#96320E]" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-md mx-auto px-5 pt-3 pb-2 flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Top Summary Banner */}
        <div className="bg-white rounded-[26px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-orange-100/80 mb-3 flex items-center gap-3 shrink-0">
          {/* Character Avatar */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FFF5EE] border-2 border-[#FFD8C2] p-1 flex items-center justify-center shrink-0">
            <img
              src={characterImage}
              alt="레디"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FF734E] text-white flex items-center justify-center border-2 border-white shadow-xs">
              <Star className="w-3.5 h-3.5 fill-white stroke-none" />
            </div>
          </div>

          {/* Banner Text & Progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3
                className="text-[#33221B] text-[17px] font-black"
                style={{ fontFamily: "'Jua', sans-serif" }}
              >
                레디와 함께 모은 배지
              </h3>
              <span
                className="text-[#FF734E] text-[15px] font-bold bg-[#FFF0ED] px-2.5 py-0.5 rounded-full"
                style={{ fontFamily: "'Jua', sans-serif" }}
              >
                {earnedCount} / {totalCount}개
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#FF9800] to-[#FF5722] rounded-full shadow-xs"
              />
            </div>

            <p
              className="text-[#66554E] text-[13px] mt-1.5 flex items-center gap-1"
              style={{ fontFamily: "'Jua', sans-serif" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>우와! 벌써 {earnedCount}개나 모았어요! 대단해! ✨</span>
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <button
            onClick={() => {
              soundFx.playPop();
              setFilter('all');
            }}
            className={`flex-1 py-2 rounded-2xl text-[15px] font-bold transition-all cursor-pointer border ${
              filter === 'all'
                ? 'bg-[#FF734E] text-white border-transparent shadow-[0_4px_12px_rgba(255,115,78,0.3)]'
                : 'bg-white text-[#66554E] border-slate-200/80 hover:bg-slate-50'
            }`}
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            전체 ({totalCount})
          </button>
          <button
            onClick={() => {
              soundFx.playPop();
              setFilter('earned');
            }}
            className={`flex-1 py-2 rounded-2xl text-[15px] font-bold transition-all cursor-pointer border ${
              filter === 'earned'
                ? 'bg-[#2DD4BF] text-white border-transparent shadow-[0_4px_12px_rgba(45,212,191,0.3)]'
                : 'bg-white text-[#66554E] border-slate-200/80 hover:bg-slate-50'
            }`}
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            획득함 ({earnedCount})
          </button>
          <button
            onClick={() => {
              soundFx.playPop();
              setFilter('locked');
            }}
            className={`flex-1 py-2 rounded-2xl text-[15px] font-bold transition-all cursor-pointer border ${
              filter === 'locked'
                ? 'bg-[#A855F7] text-white border-transparent shadow-[0_4px_12px_rgba(168,85,247,0.3)]'
                : 'bg-white text-[#66554E] border-slate-200/80 hover:bg-slate-50'
            }`}
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            도전 중 ({totalCount - earnedCount})
          </button>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-3 gap-3 pb-6 flex-1 min-h-0 overflow-y-auto pr-0.5">
          {filteredBadges.map((badge, idx) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBadgeClick(badge)}
              className={`relative rounded-[22px] p-3 flex flex-col items-center justify-between text-center cursor-pointer transition-all border shadow-[0_4px_14px_rgba(0,0,0,0.04)] ${
                badge.earned
                  ? 'bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]'
                  : 'bg-slate-50/90 grayscale-[0.3] opacity-80 hover:opacity-100'
              }`}
              style={{
                borderColor: badge.earned ? badge.borderColor : '#E2E8F0',
              }}
            >
              {/* Earned Checkmark / Lock Icon */}
              <div className="absolute top-2 right-2">
                {badge.earned ? (
                  <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-400 text-white flex items-center justify-center shadow-xs">
                    <Lock className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
              </div>

              {/* Badge Visual Icon or Custom Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center my-1">
                {badge.image ? (
                  <img
                    src={badge.image}
                    alt={badge.title}
                    referrerPolicy="no-referrer"
                    className={`max-w-full max-h-full object-contain drop-shadow-md ${
                      !badge.earned ? 'brightness-75 opacity-60' : ''
                    }`}
                  />
                ) : (
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-inner border"
                    style={{
                      backgroundColor: badge.earned ? badge.bgColor : '#F1F5F9',
                      borderColor: badge.earned ? badge.borderColor : '#CBD5E1',
                    }}
                  >
                    <span>{badge.emoji}</span>
                  </div>
                )}
              </div>

              {/* Badge Title */}
              <span
                className={`text-[14px] sm:text-[15px] font-bold leading-tight mt-1 line-clamp-2 ${
                  badge.earned ? 'text-[#33221B]' : 'text-slate-500'
                }`}
                style={{ fontFamily: "'Jua', sans-serif" }}
              >
                {badge.title}
              </span>

              {/* Status or Progress */}
              <div className="mt-1.5 w-full">
                {badge.earned ? (
                  <span
                    className="text-[11px] text-[#10B981] font-bold bg-[#ECFDF5] px-2 py-0.5 rounded-full block text-center"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    획득 완료
                  </span>
                ) : (
                  <span
                    className="text-[11px] text-slate-500 font-bold bg-slate-200/80 px-2 py-0.5 rounded-full block text-center"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    {badge.progress
                      ? `${badge.progress.current}/${badge.progress.total}`
                      : '도전 중'}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Action Button: "이야기 하러 가기" */}
      <div className="relative z-30 w-full max-w-md mx-auto px-5 pb-6 pt-2 shrink-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            soundFx.playSuccess();
            onStartSpeaking();
          }}
          className="w-full py-3.5 sm:py-4 rounded-full bg-[#FF734E] hover:bg-[#FF653D] active:bg-[#F25830] text-white font-extrabold text-[20px] sm:text-[22px] tracking-wide shadow-[0_10px_28px_rgba(255,115,78,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
        >
          <Sparkles className="w-6 h-6" />
          <span style={{ fontFamily: "'Jua', sans-serif" }}>새 배지 얻으러 이야기하기!</span>
        </motion.button>
      </div>

      {/* Interactive Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                soundFx.playPop();
                setSelectedBadge(null);
              }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-[340px] bg-[#FFFDF5] rounded-[32px] p-6 shadow-2xl border-4 border-[#FFE2CC] flex flex-col items-center text-center overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  soundFx.playPop();
                  setSelectedBadge(null);
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FFF0E6] text-[#FF6F3C] flex items-center justify-center cursor-pointer hover:bg-[#FFE2D1] active:scale-95 transition-all"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Badge Visual Container */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mt-2 mb-3">
                {selectedBadge.earned && (
                  <div className="absolute inset-0 bg-[#FDE047]/30 rounded-full blur-xl animate-pulse" />
                )}

                {selectedBadge.image ? (
                  <img
                    src={selectedBadge.image}
                    alt={selectedBadge.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-contain drop-shadow-xl ${
                      !selectedBadge.earned ? 'grayscale opacity-60' : ''
                    }`}
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-md border-2"
                    style={{
                      backgroundColor: selectedBadge.earned
                        ? selectedBadge.bgColor
                        : '#F1F5F9',
                      borderColor: selectedBadge.earned
                        ? selectedBadge.borderColor
                        : '#CBD5E1',
                    }}
                  >
                    <span>{selectedBadge.emoji}</span>
                  </div>
                )}
              </div>

              {/* Status Tag */}
              <div className="mb-2">
                {selectedBadge.earned ? (
                  <span
                    className="text-[13px] font-bold text-[#10B981] bg-[#ECFDF5] border border-[#10B981]/30 px-3 py-1 rounded-full flex items-center gap-1"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{selectedBadge.earnedDate} 획득 성공!</span>
                  </span>
                ) : (
                  <span
                    className="text-[13px] font-bold text-slate-500 bg-slate-200/80 border border-slate-300 px-3 py-1 rounded-full flex items-center gap-1"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>아직 도전 중이에요</span>
                  </span>
                )}
              </div>

              {/* Badge Title */}
              <h2
                className="text-[#33221B] text-[22px] font-black mb-1"
                style={{ fontFamily: "'Jua', sans-serif" }}
              >
                {selectedBadge.title}
              </h2>

              {/* Description */}
              <p
                className="text-[#66554E] text-[15px] leading-snug mb-3 px-2"
                style={{ fontFamily: "'Jua', sans-serif" }}
              >
                {selectedBadge.desc}
              </p>

              {/* Condition Box */}
              <div className="w-full bg-white rounded-2xl p-3 border border-orange-100 shadow-xs mb-4 text-left">
                <p
                  className="text-[#96320E] text-[12px] font-bold mb-0.5 flex items-center gap-1"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>획득 조건</span>
                </p>
                <p
                  className="text-[#33221B] text-[14px]"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  {selectedBadge.condition}
                </p>
              </div>

              {/* Audio Listen Button & Action Button */}
              <div className="w-full flex flex-col gap-2">
                <button
                  onClick={() => {
                    soundFx.playPop();
                    speechManager.speak(`${selectedBadge.title}! ${selectedBadge.desc}`);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-[#FFF0E6] hover:bg-[#FFE5D4] text-[#96320E] font-bold text-[15px] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>소리로 들려줘</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    setSelectedBadge(null);
                    onStartSpeaking();
                  }}
                  className="w-full py-3 rounded-2xl bg-[#FF734E] hover:bg-[#FF653D] active:scale-98 text-white font-black text-[18px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  <span>지금 이야기하러 가기!</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
