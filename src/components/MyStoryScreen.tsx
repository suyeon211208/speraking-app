import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Menu,
  ChevronRight,
  ChevronLeft,
  X,
  MessageCircle,
  BookOpen,
  Home,
  Mic,
  Star,
  Settings,
  Heart,
  Sparkles,
  Smile,
} from 'lucide-react';
import { StoryRecord } from '../types';
import { soundFx } from '../utils/soundEffects';
import characterImage from '../assets/images/charater3.png';
import { HamburgerMenu } from './HamburgerMenu';

interface MyStoryScreenProps {
  stories?: StoryRecord[];
  onBack: () => void;
  onGoHome: () => void;
  onStartSpeaking?: () => void;
}

export const MyStoryScreen: React.FC<MyStoryScreenProps> = ({
  stories = [],
  onBack,
  onGoHome,
  onStartSpeaking,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'myCreated'>('history');
  const [selectedStory, setSelectedStory] = useState<StoryRecord | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleCardClick = (story: StoryRecord) => {
    soundFx.playPop();
    setSelectedStory(story);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="relative w-full h-full min-h-screen bg-[#FFFDF5] flex flex-col justify-between overflow-y-auto"
    >
      {/* Hamburger Menu Drawer */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onGoHome={onGoHome}
        onGoMyStory={() => setIsMenuOpen(false)}
        activeItem="mystory"
      />

      {/* Top Main Container */}
      <div className="w-full max-w-md mx-auto px-5 pt-4 pb-24 flex flex-col gap-4">
        {/* Header Bar */}
        <div className="flex items-start justify-between relative pt-1">
          {/* Left Hamburger Menu Button */}
          <button
            onClick={() => {
              soundFx.playPop();
              setIsMenuOpen(true);
            }}
            className="w-11 h-11 rounded-full bg-white/95 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-amber-100/50 flex items-center justify-center cursor-pointer hover:bg-white active:scale-95 transition-all z-10"
            title="메뉴"
          >
            <Menu className="w-6 h-6 text-[#96320E]" />
          </button>

          {/* Center Title & Subtitle */}
          <div className="flex-1 flex flex-col items-center text-center px-2">
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2DD4BF] fill-[#2DD4BF]" />
              <h1
                className="text-[#33221B] text-[28px] sm:text-[32px] font-black tracking-tight leading-tight"
                style={{ fontFamily: "'Jua', sans-serif" }}
              >
                내 이야기
              </h1>
              <span className="text-xl">💕</span>
            </div>
            <p
              className="text-[#78665E] text-[13px] sm:text-[14px] font-medium mt-0.5"
              style={{ fontFamily: "'Jua', sans-serif" }}
            >
              우리의 소중한 이야기들을 모아봤어!
            </p>
          </div>

          {/* Right Spacer for balanced centering */}
          <div className="w-11" />
        </div>

        {/* Tab Toggle (대화 기록 / 내가 만든 이야기) */}
        <div className="bg-[#F5EFE0] p-1.5 rounded-[24px] flex items-center gap-1 mt-1 shadow-inner border border-amber-100/60">
          <button
            onClick={() => {
              soundFx.playPop();
              setActiveTab('history');
            }}
            className={`flex-1 py-2.5 px-3 rounded-[20px] flex items-center justify-center gap-2 font-bold text-[15px] transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#14B8A6] text-white shadow-[0_4px_12px_rgba(20,184,166,0.3)]'
                : 'text-[#66554E] hover:bg-white/40'
            }`}
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-white/60 text-[#66554E]'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
            </div>
            <span>대화 기록</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              setActiveTab('myCreated');
            }}
            className={`flex-1 py-2.5 px-3 rounded-[20px] flex items-center justify-center gap-2 font-bold text-[15px] transition-all cursor-pointer ${
              activeTab === 'myCreated'
                ? 'bg-[#14B8A6] text-white shadow-[0_4px_12px_rgba(20,184,166,0.3)]'
                : 'text-[#66554E] hover:bg-white/40'
            }`}
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                activeTab === 'myCreated' ? 'bg-white/20 text-white' : 'bg-white/60 text-[#66554E]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span>내가 만든 이야기</span>
          </button>
        </div>

        {/* Stories List */}
        <div className="flex flex-col gap-3.5 mt-1">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(story)}
              className="w-full bg-white rounded-[26px] p-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-orange-100/60 flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
            >
              {/* Left Thumbnail */}
              <div
                className={`w-20 h-20 sm:w-22 sm:h-22 rounded-[20px] bg-gradient-to-br ${story.thumbnailBg} flex items-center justify-center shrink-0 shadow-xs border border-white/60 overflow-hidden text-3xl select-none`}
              >
                {story.emoji || '💬'}
              </div>

              {/* Middle Content: Topic Tag, Dialogue Title, Date */}
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
                {/* Topic Tag Badge */}
                <div className="inline-flex items-center self-start">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[12px] font-extrabold tracking-tight"
                    style={{
                      backgroundColor: story.topicTagBg,
                      color: story.topicTagColor,
                      fontFamily: "'Jua', sans-serif",
                    }}
                  >
                    {story.topicTag}
                  </span>
                </div>

                {/* Dialogue Title */}
                <h3
                  className="text-[#281D17] text-[16px] sm:text-[17px] font-black leading-snug tracking-tight mt-1 truncate"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  {story.title}
                </h3>

                {/* Date & Mood indicator */}
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="text-[#8C7A72] text-[13px] font-semibold"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    {story.dateText}
                  </span>
                  <Smile className="w-4 h-4 text-[#F59E0B] fill-[#FEF3C7]" />
                </div>
              </div>

              {/* Right Character Avatar & Chevron Button */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Red Panda Character Avatar */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#CCFBF1] p-0.5 border-2 border-[#5EEAD4] shadow-xs flex items-center justify-center overflow-hidden">
                  <img
                    src={characterImage}
                    alt="레디"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Chevron > Button */}
                <div className="w-8 h-8 rounded-full bg-[#FAF5EC] text-[#78665E] flex items-center justify-center border border-amber-100 shadow-2xs">
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner Card (Encouragement message) */}
        <div className="mt-2 w-full bg-[#ECFDF5] border-2 border-dashed border-[#A7F3D0] rounded-[24px] p-3.5 flex items-center justify-between gap-3 shadow-xs">
          {/* Left Character */}
          <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
            <img
              src={characterImage}
              alt="레디"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Center Text */}
          <div className="flex-1 text-left">
            <p
              className="text-[#065F46] text-[14px] sm:text-[15px] font-bold leading-tight"
              style={{ fontFamily: "'Jua', sans-serif" }}
            >
              너의 이야기를 들려줘서 <br />
              정말 고마워!
            </p>
            <p
              className="text-[#047857] text-[12px] font-semibold mt-0.5"
              style={{ fontFamily: "'Jua', sans-serif" }}
            >
              다음에도 또 이야기하자!
            </p>
          </div>

          {/* Right Heart Icon */}
          <div className="w-9 h-9 rounded-full bg-[#CCFBF1] text-[#14B8A6] flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-[#14B8A6]" />
          </div>
        </div>
      </div>

      {/* Full Popup View when clicking a story */}
      {selectedStory && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed inset-0 z-50 bg-[#FFFDF5] flex flex-col justify-between overflow-hidden"
        >
          {/* Top Navigation Bar */}
          <div className="w-full max-w-md mx-auto px-5 pt-4 pb-3 flex items-center justify-between border-b border-orange-100/60 bg-white/90 backdrop-blur-md shrink-0">
            <div className="w-10" />

            <h2
              className="text-[#33221B] text-[18px] font-extrabold"
              style={{ fontFamily: "'Jua', sans-serif" }}
            >
              대화 상세 기록
            </h2>

            <button
              onClick={() => {
                soundFx.playPop();
                setSelectedStory(null);
              }}
              className="w-10 h-10 rounded-full bg-white border border-orange-100 shadow-xs flex items-center justify-center text-[#33221B] hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
              title="닫기"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Full Content Area */}
          <div className="w-full max-w-md mx-auto px-5 py-5 flex-1 overflow-y-auto flex flex-col gap-4">
            {/* Header Card */}
            <div className="w-full bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-amber-100/80 flex flex-col items-center text-center gap-3">
              <div
                className={`w-20 h-20 rounded-[22px] bg-gradient-to-br ${selectedStory.thumbnailBg} flex items-center justify-center text-4xl shadow-sm border border-white/80 select-none`}
              >
                {selectedStory.emoji || '💬'}
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <span
                  className="px-3.5 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: selectedStory.topicTagBg,
                    color: selectedStory.topicTagColor,
                    fontFamily: "'Jua', sans-serif",
                  }}
                >
                  {selectedStory.topicTag}
                </span>

                <h1
                  className="text-[#33221B] text-[22px] font-extrabold leading-tight"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  {selectedStory.title}
                </h1>

                <span
                  className="text-[#8C7A72] text-[13px] font-medium"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  {selectedStory.dateText} 대화
                </span>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1">
                <MessageCircle className="w-4 h-4 text-[#FF734E]" />
                <h3
                  className="text-[#33221B] text-[16px] font-bold"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  대화 내용
                </h3>
              </div>

              {selectedStory.messages && selectedStory.messages.length > 0 ? (
                <div className="w-full bg-white p-4 rounded-[24px] border border-orange-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-3">
                  {selectedStory.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${m.sender === 'child' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 mb-1 px-1">
                        {m.sender !== 'child' && (
                          <img
                            src={characterImage}
                            alt="레디"
                            className="w-4 h-4 object-contain"
                          />
                        )}
                        <span
                          className="text-[11px] text-[#8C7A72] font-bold"
                          style={{ fontFamily: "'Jua', sans-serif" }}
                        >
                          {m.sender === 'child' ? '나' : '레디'}
                        </span>
                      </div>
                      <div
                        className={`px-4 py-2.5 rounded-[20px] text-[15px] max-w-[88%] leading-relaxed ${
                          m.sender === 'child'
                            ? 'bg-[#FF734E] text-white font-medium rounded-tr-xs shadow-xs'
                            : 'bg-[#FFF8F3] text-[#33221B] font-medium border border-orange-100 rounded-tl-xs shadow-2xs'
                        }`}
                        style={{ fontFamily: "'Jua', sans-serif" }}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full bg-white p-6 rounded-[24px] border border-orange-100/80 shadow-xs text-center flex flex-col items-center justify-center gap-2">
                  <Smile className="w-8 h-8 text-[#FF9E7D]" />
                  <p
                    className="text-[#66554E] text-[15px]"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    레디와 나눈 따뜻한 이야기 기록입니다!
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Bottom Container Padding */}
      <div className="pb-6" />
    </motion.div>
  );
};
