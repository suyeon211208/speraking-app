import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  ChevronLeft,
  User,
  TrendingUp,
  MessageSquare,
  Sparkles,
  BarChart3,
  Calendar,
  Clock,
  Volume2,
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Brain,
  Lightbulb,
  Heart,
  ChevronRight,
  PieChart as PieIcon,
  Smile,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { soundFx } from '../utils/soundEffects';
import { speechManager } from '../utils/speech';
import { HamburgerMenu } from './HamburgerMenu';

import bgImage from '../assets/images/background.png';
import characterImage from '../assets/images/charater3.png';

interface ParentDashboardScreenProps {
  onBack: () => void;
  onGoHome: () => void;
  onGoMyStory: () => void;
  onGoBadges: () => void;
  onGoMiniGame?: () => void;
}

// Session Quantitative Trend Data (회차별 정량 지표 데이터)
const SESSION_TREND_DATA = [
  { session: '1회차', date: '07.20', wordCount: 48, sentenceLength: 3.2, diversity: 52, confidence: 60, topic: '동물' },
  { session: '2회차', date: '07.22', wordCount: 65, sentenceLength: 3.8, diversity: 58, confidence: 68, topic: '학교' },
  { session: '3회차', date: '07.24', wordCount: 82, sentenceLength: 4.3, diversity: 64, confidence: 72, topic: '음식' },
  { session: '4회차', date: '07.26', wordCount: 95, sentenceLength: 4.9, diversity: 70, confidence: 78, topic: '상상' },
  { session: '5회차', date: '07.28', wordCount: 110, sentenceLength: 5.4, diversity: 76, confidence: 82, topic: '동물' },
  { session: '6회차', date: '07.29', wordCount: 128, sentenceLength: 5.8, diversity: 80, confidence: 86, topic: '학교' },
  { session: '7회차', date: '07.31', wordCount: 145, sentenceLength: 6.2, diversity: 84, confidence: 90, topic: '상상' },
  { session: '8회차', date: '08.01', wordCount: 168, sentenceLength: 6.8, diversity: 88, confidence: 94, topic: '동물' },
];

// Topic Distribution Data (주제별 발화 분포)
const TOPIC_DISTRIBUTION_DATA = [
  { name: '동물 친구들', value: 35, color: '#FF734E' },
  { name: '유치원/학교', value: 25, color: '#2DD4BF' },
  { name: '상상 모험', value: 25, color: '#A855F7' },
  { name: '맛있는 음식', value: 15, color: '#F59E0B' },
];

// Session Dialog Transcripts (회차별 상세 대화 내용 및 분석)
const SESSION_TRANSCRIPTS = [
  {
    id: 's8',
    sessionNumber: 8,
    title: '제 8회차: 수족관 고래 이야기',
    date: '2026년 8월 1일',
    topic: '동물 친구들 🐳',
    duration: '4분 35초',
    turns: 12,
    wordCount: 168,
    avgLength: '6.8단어',
    diversity: '88점 (상위 8%)',
    highlights: ['반짝거리는', '거대한 고래', '첨벙첨벙 수영했어'],
    transcript: [
      { sender: 'ready', text: '안녕! 오늘 레디랑 바닷속 수족관으로 놀러가볼까? 바다에서 어떤 동물을 만나고 싶어?', time: '10:12' },
      { sender: 'child', text: '나는 커다란 고래를 만나고 싶어요! 분수도 뿜는 고래예요!', time: '10:12' },
      { sender: 'ready', text: '와! 커다란 고래라니 멋지다! 고래가 헤엄치는 모습은 어땠어?', time: '10:13' },
      { sender: 'child', text: '파란 바닷속에서 첨벙첨벙 수영하는데 정말 신나보였어요! 물방울이 반짝거렸어요.', time: '10:13' },
      { sender: 'ready', text: '물방울이 반짝거렸다니 표현이 정말 예쁘다! 고래한테 무슨 말을 해주고 싶었어?', time: '10:14' },
      { sender: 'child', text: '고래야 안녕! 나랑 같이 바닷속 모험을 떠나자고 말하고 싶어요!', time: '10:14' },
      { sender: 'ready', text: '고래도 정말 기뻐할 거야! 레디랑 함께 고래 타고 모험 떠나자~!', time: '10:15' },
    ],
    feedback: {
      strengths: '생생한 묘사 어휘("첨벙첨벙", "반짝거렸어요")와 복합 문장 구조를 아주 자연스럽게 사용했습니다.',
      progressNote: '초기 1~2회차에 비해 발화 문장 길이가 2.1배 길어졌고, 자신감 있게 긴 이야기를 이어갔습니다.',
      parentTip: '아이에게 "고래가 만약 말을 할 수 있다면 뭐라고 했을까?" 같은 상상력 질문을 이어서 해주세요.',
    },
  },
  {
    id: 's7',
    sessionNumber: 7,
    title: '제 7회차: 유치원 블록 성 만들기',
    date: '2026년 7월 31일',
    topic: '유치원/학교 🏫',
    duration: '3분 50초',
    turns: 10,
    wordCount: 145,
    avgLength: '6.2단어',
    diversity: '84점',
    highlights: ['알록달록 블록', '친구랑 나눠써서', '높은 성 완성'],
    transcript: [
      { sender: 'ready', text: '유치원에서 오늘 제일 신나는 일은 뭐였어?', time: '15:20' },
      { sender: 'child', text: '친구랑 블록 놀이 영역에서 엄청 높은 알록달록 성을 만들었어요!', time: '15:20' },
      { sender: 'ready', text: '우와! 알록달록 성이라니! 블록이 모자라진 않았어?', time: '15:21' },
      { sender: 'child', text: '조금 모자랐는데 민우가 블록을 나눠줘서 같이 크게 완성했어요.', time: '15:22' },
      { sender: 'ready', text: '서로 양보하고 협동하는 마음이 참 예쁘다! 정말 기분 좋았겠다!', time: '15:23' },
    ],
    feedback: {
      strengths: '상황의 원인과 결과를 가리키는 접속어구("조금 모자랐는데", "나눠줘서")를 능숙하게 사용했습니다.',
      progressNote: '타인과의 상호작용 및 사회성 경험을 언어로 구체화하는 능력이 급격히 상승했습니다.',
      parentTip: '칭찬해주실 때 "친구랑 나누어서 완성했을 때 마음이 어땠어?"처럼 감정 어휘를 함께 다듬어주세요.',
    },
  },
  {
    id: 's6',
    sessionNumber: 6,
    title: '제 6회차: 신비한 공룡 섬 모험',
    date: '2026년 7월 29일',
    topic: '상상 모험 🔮',
    duration: '4분 10초',
    turns: 11,
    wordCount: 128,
    avgLength: '5.8단어',
    diversity: '80점',
    highlights: ['티라노사우루스', '용감하게 안녕', '나뭇잎 선물'],
    transcript: [
      { sender: 'ready', text: '만약 공룡 섬에 도착하면 제일 먼저 누구를 만나고 싶어?', time: '11:05' },
      { sender: 'child', text: '이빨이 큰 티라노사우루스를 만나고 싶어요! 전혀 무섭지 않아요!', time: '11:05' },
      { sender: 'ready', text: '와, 정말 용감하다! 공룡한테 무슨 선물을 주고 싶어?', time: '11:06' },
      { sender: 'child', text: '초식 공룡한테는 싱싱한 나뭇잎을 주고 티라노한테는 고기 인형을 줄 거예요.', time: '11:07' },
    ],
    feedback: {
      strengths: '공룡의 종류에 따라 적절한 분류 표현(초식/육식) 및 적절한 단어 선택을 보여주었습니다.',
      progressNote: '질문에 답변만 하지 않고 스스로 상상한 아이디어를 부연 설명하는 표현력이 생겼습니다.',
      parentTip: '좋아하는 공룡 책을 함께 보며 책 속 표현을 말로 따라 해보는 놀이를 추천합니다.',
    },
  },
];

export const ParentDashboardScreen: React.FC<ParentDashboardScreenProps> = ({
  onBack,
  onGoHome,
  onGoMyStory,
  onGoBadges,
  onGoMiniGame,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'trends' | 'transcripts' | 'coaching'>('trends');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('s8');

  const currentSession = SESSION_TRANSCRIPTS.find((s) => s.id === selectedSessionId) || SESSION_TRANSCRIPTS[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#F8FAFC] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Background overlay */}
      <img
        src={bgImage}
        alt="Background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-25"
      />

      {/* Hamburger Menu Drawer */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onGoHome={onGoHome}
        onGoMyStory={onGoMyStory}
        onGoBadges={onGoBadges}
        onGoParent={() => setIsMenuOpen(false)}
        onGoMiniGame={onGoMiniGame}
        activeItem="parent"
      />

      {/* Navigation Header */}
      <div className="relative z-30 w-full max-w-md mx-auto px-5 pt-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            soundFx.playPop();
            setIsMenuOpen(true);
          }}
          className="w-11 h-11 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-slate-200/80 flex items-center justify-center cursor-pointer hover:bg-slate-50 active:scale-95 transition-all"
          title="메뉴"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>

        <div className="flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full shadow-xs border border-slate-200">
          <ShieldCheck className="w-5 h-5 text-[#C2410C]" />
          <span
            className="text-[#1E293B] text-[18px] font-black"
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            보호자 리포트 & 분석
          </span>
        </div>

        <button
          onClick={() => {
            soundFx.playPop();
            onBack();
          }}
          className="w-11 h-11 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-slate-200/80 flex items-center justify-center cursor-pointer hover:bg-slate-50 active:scale-95 transition-all"
          title="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
      </div>

      {/* Child Profile Banner */}
      <div className="relative z-20 w-full max-w-md mx-auto px-5 pt-3 shrink-0">
        <div className="bg-gradient-to-r from-[#FFF7ED] via-white to-[#EFF6FF] rounded-[24px] p-4 shadow-xs border border-orange-100/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-[#FFEDD5] border border-[#FDBA74] flex items-center justify-center shrink-0">
              <img
                src={characterImage}
                alt="레디"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-[#1E293B] text-[18px] font-black"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  김하늘 어린이 <span className="text-[13px] text-orange-600 font-bold bg-orange-100/80 px-2 py-0.5 rounded-md">만 6세</span>
                </h2>
              </div>
              <p className="text-slate-500 text-[12px] mt-0.5" style={{ fontFamily: "'Jua', sans-serif" }}>
                최근 대화: 2026.08.01 (총 8회차 완료)
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>우수 발달중</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="relative z-20 w-full max-w-md mx-auto px-5 pt-3 shrink-0">
        <div className="flex bg-slate-200/70 p-1 rounded-2xl gap-1 border border-slate-200/80">
          <button
            onClick={() => {
              soundFx.playPop();
              setActiveTab('trends');
            }}
            className={`flex-1 py-2 rounded-xl text-[14px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'trends'
                ? 'bg-white text-[#C2410C] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            <BarChart3 className="w-4 h-4" />
            <span>변화 추이 (정량)</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              setActiveTab('transcripts');
            }}
            className={`flex-1 py-2 rounded-xl text-[14px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'transcripts'
                ? 'bg-white text-[#C2410C] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            <MessageSquare className="w-4 h-4" />
            <span>회차별 대화 내용</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              setActiveTab('coaching');
            }}
            className={`flex-1 py-2 rounded-xl text-[14px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'coaching'
                ? 'bg-white text-[#C2410C] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            <Lightbulb className="w-4 h-4" />
            <span>코칭 가이드</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="relative z-20 w-full max-w-md mx-auto px-5 pt-3 pb-6 flex-1 min-h-0 overflow-y-auto">
        {/* TAB 1: 회차별 변화 추이 (정량 지표) */}
        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3.5 pb-8"
          >
            {/* Top 4 Quantitative Metric Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 text-[12px] mb-1">
                  <span>총 누적 발화 어휘</span>
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#1E293B] text-[24px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                    1,120
                  </span>
                  <span className="text-slate-500 text-[13px]" style={{ fontFamily: "'Jua', sans-serif" }}>개</span>
                </div>
                <span className="text-emerald-600 text-[11px] font-bold mt-1 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> 최근 회차당 평균 +168개
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-teal-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 text-[12px] mb-1">
                  <span>평균 문장 길이</span>
                  <FileText className="w-4 h-4 text-teal-500" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#1E293B] text-[24px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                    6.8
                  </span>
                  <span className="text-slate-500 text-[13px]" style={{ fontFamily: "'Jua', sans-serif" }}>단어/문장</span>
                </div>
                <span className="text-emerald-600 text-[11px] font-bold mt-1 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> 1회차(3.2단어) 대비 +2.1배
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 text-[12px] mb-1">
                  <span>어휘 표현 다양성</span>
                  <Brain className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#1E293B] text-[24px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                    88
                  </span>
                  <span className="text-slate-500 text-[13px]" style={{ fontFamily: "'Jua', sans-serif" }}>점 / 100</span>
                </div>
                <span className="text-purple-600 text-[11px] font-bold mt-1 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" /> 또래 대비 우수 수준
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 text-[12px] mb-1">
                  <span>발화 자발성 지수</span>
                  <Smile className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#1E293B] text-[24px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                    94
                  </span>
                  <span className="text-slate-500 text-[13px]" style={{ fontFamily: "'Jua', sans-serif" }}>%</span>
                </div>
                <span className="text-amber-600 text-[11px] font-bold mt-1 flex items-center gap-0.5">
                  <Award className="w-3 h-3" /> 적극적 대화 자신감
                </span>
              </div>
            </div>

            {/* CHART 1: 회차별 발화량 & 문장 길이 변화 추이 */}
            <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[#1E293B] text-[16px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                    회차별 발화량 & 문장 길이 추이
                  </h3>
                  <p className="text-slate-500 text-[12px]">회차를 거듭할수록 발화 어휘 수와 문장이 길어집니다</p>
                </div>
              </div>

              <div className="w-full h-[200px] text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SESSION_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="wordGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF734E" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FF734E" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="lengthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="session" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0', fontSize: '12px' }}
                      formatter={(val: any, name: any) => [
                        name === 'wordCount' ? `${val}개` : `${val}단어`,
                        name === 'wordCount' ? '어휘 발화량' : '평균 문장 길이',
                      ]}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="wordCount" stroke="#FF734E" strokeWidth={2.5} fillOpacity={1} fill="url(#wordGrad)" name="wordCount" />
                    <Area yAxisId="right" type="monotone" dataKey="sentenceLength" stroke="#2DD4BF" strokeWidth={2.5} fillOpacity={1} fill="url(#lengthGrad)" name="sentenceLength" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-5 mt-2 pt-2 border-t border-slate-100 text-[12px] font-bold">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF734E]" />
                  <span className="text-slate-700">어휘 발화량 (개)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#2DD4BF]" />
                  <span className="text-slate-700">평균 문장 길이 (단어)</span>
                </div>
              </div>
            </div>

            {/* CHART 2: 어휘 다양성 & 자신감 지수 (Bar Chart) */}
            <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[#1E293B] text-[16px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                    어휘 다양성 & 대화 자신감 지수
                  </h3>
                  <p className="text-slate-500 text-[12px]">다양한 단어 사용과 자발적 대화 자신감 성장도</p>
                </div>
              </div>

              <div className="w-full h-[180px] text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SESSION_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="session" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0', fontSize: '12px' }}
                      formatter={(val: any, name: any) => [`${val}점`, name === 'diversity' ? '어휘 다양성' : '자신감 지수']}
                    />
                    <Bar dataKey="diversity" fill="#A855F7" radius={[4, 4, 0, 0]} name="diversity" />
                    <Bar dataKey="confidence" fill="#F59E0B" radius={[4, 4, 0, 0]} name="confidence" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-5 mt-2 pt-2 border-t border-slate-100 text-[12px] font-bold">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#A855F7]" />
                  <span className="text-slate-700">어휘 다양성 지수</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="text-slate-700">대화 자신감</span>
                </div>
              </div>
            </div>

            {/* CHART 3: 주제별 관심도 분포 (Pie Chart) */}
            <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs">
              <h3 className="text-[#1E293B] text-[16px] font-black mb-1" style={{ fontFamily: "'Jua', sans-serif" }}>
                주제별 발화 관심도 분포
              </h3>
              <p className="text-slate-500 text-[12px] mb-2">아이가 가장 적극적으로 몰입해서 표현한 대화 주제</p>

              <div className="flex items-center justify-between gap-2">
                <div className="w-[140px] h-[140px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={TOPIC_DISTRIBUTION_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {TOPIC_DISTRIBUTION_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1 flex flex-col gap-1.5 text-[13px]">
                  {TOPIC_DISTRIBUTION_DATA.map((topic) => (
                    <div key={topic.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color }} />
                        <span className="text-slate-700 font-bold" style={{ fontFamily: "'Jua', sans-serif" }}>
                          {topic.name}
                        </span>
                      </div>
                      <span className="text-slate-900 font-extrabold">{topic.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: 회차별 대화 내용 (Detailed Transcripts) */}
        {activeTab === 'transcripts' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 pb-8"
          >
            {/* Session Selector Selector Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
              {SESSION_TRANSCRIPTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundFx.playPop();
                    setSelectedSessionId(s.id);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-[13px] font-bold shrink-0 transition-all cursor-pointer border ${
                    selectedSessionId === s.id
                      ? 'bg-[#FF734E] text-white border-transparent shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  제 {s.sessionNumber}회차 ({s.date.split('년 ')[1]})
                </button>
              ))}
            </div>

            {/* Selected Session Header Card */}
            <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                <div>
                  <span className="text-[12px] font-bold text-orange-600 bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    {currentSession.topic}
                  </span>
                  <h3 className="text-[#1E293B] text-[18px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                    {currentSession.title}
                  </h3>
                  <div className="flex items-center gap-3 text-slate-500 text-[12px] mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {currentSession.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {currentSession.duration} ({currentSession.turns}턴)
                    </span>
                  </div>
                </div>
              </div>

              {/* Session Specific Indicators */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-500 block">발화 어휘 수</span>
                  <span className="text-[16px] font-black text-[#1E293B]" style={{ fontFamily: "'Jua', sans-serif" }}>
                    {currentSession.wordCount}개
                  </span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[11px] text-slate-500 block">평균 문장 길이</span>
                  <span className="text-[16px] font-black text-teal-600" style={{ fontFamily: "'Jua', sans-serif" }}>
                    {currentSession.avgLength}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">어휘 다양성</span>
                  <span className="text-[16px] font-black text-purple-600" style={{ fontFamily: "'Jua', sans-serif" }}>
                    {currentSession.diversity}
                  </span>
                </div>
              </div>

              {/* Key Highlights Tags */}
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[12px] font-bold text-slate-500 mr-1">주요 표현:</span>
                {currentSession.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[12px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    ✨ #{h}
                  </span>
                ))}
              </div>
            </div>

            {/* Conversation Transcript Log */}
            <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[#1E293B] text-[15px] font-black flex items-center gap-1.5" style={{ fontFamily: "'Jua', sans-serif" }}>
                  <MessageSquare className="w-4 h-4 text-[#FF734E]" />
                  <span>실제 대화록 ({currentSession.transcript.length}개 메시지)</span>
                </h4>
                <span className="text-slate-400 text-[11px]">음성 및 텍스트 기록</span>
              </div>

              <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {currentSession.transcript.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.sender === 'child' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5 px-1">
                      <span className="text-[11px] font-bold text-slate-500">
                        {msg.sender === 'child' ? '👦 아이' : '🦊 레디'}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                    </div>

                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-2xs ${
                        msg.sender === 'child'
                          ? 'bg-[#FF734E] text-white rounded-tr-none font-bold'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none font-medium border border-slate-200/60'
                      }`}
                      style={{ fontFamily: "'Jua', sans-serif" }}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {msg.sender === 'child' && (
                      <button
                        onClick={() => {
                          soundFx.playPop();
                          speechManager.speak(msg.text);
                        }}
                        className="mt-0.5 text-[11px] text-orange-600 hover:underline flex items-center gap-1 px-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>아이 음성 다시듣기</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Expert Analysis Box */}
            <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 p-4 rounded-[24px] border border-orange-200/80 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[#96320E] font-black text-[15px]" style={{ fontFamily: "'Jua', sans-serif" }}>
                <Brain className="w-5 h-5 text-orange-600" />
                <span>AI 언어발달 전문가 총평</span>
              </div>

              <div className="bg-white/90 p-3 rounded-2xl border border-orange-100 text-[13px] leading-relaxed text-slate-800 flex flex-col gap-2">
                <div>
                  <span className="font-bold text-orange-700 block mb-0.5" style={{ fontFamily: "'Jua', sans-serif" }}>
                    🌟 이번 회차 잘한 점
                  </span>
                  <p>{currentSession.feedback.strengths}</p>
                </div>

                <div className="border-t border-orange-100 pt-2">
                  <span className="font-bold text-teal-700 block mb-0.5" style={{ fontFamily: "'Jua', sans-serif" }}>
                    📈 회차별 성장 관찰
                  </span>
                  <p>{currentSession.feedback.progressNote}</p>
                </div>

                <div className="border-t border-orange-100 pt-2">
                  <span className="font-bold text-purple-700 block mb-0.5" style={{ fontFamily: "'Jua', sans-serif" }}>
                    💡 가정 내 홈 코칭 추천
                  </span>
                  <p>{currentSession.feedback.parentTip}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: 홈 코칭 가이드 */}
        {activeTab === 'coaching' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3.5 pb-8"
          >
            {/* Guide Card 1 */}
            <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-teal-700 font-black text-[16px] mb-2" style={{ fontFamily: "'Jua', sans-serif" }}>
                <Lightbulb className="w-5 h-5 text-teal-600" />
                <span>아이의 말하기를 넓혀주는 3가지 질문법</span>
              </div>
              <p className="text-slate-600 text-[13px] mb-3 leading-relaxed">
                단순히 "응/아니"로 답하는 질문 대신, 아이의 생각과 감정을 끌어내는 열린 질문을 활용해 보세요.
              </p>

              <div className="flex flex-col gap-2">
                <div className="bg-teal-50/80 p-3 rounded-xl border border-teal-100 text-[13px]">
                  <span className="font-bold text-teal-900 block" style={{ fontFamily: "'Jua', sans-serif" }}>
                    1. 구체적인 표현 유도하기
                  </span>
                  <p className="text-slate-700 mt-0.5">"오늘 기분 어땠어?" ➔ "오늘 유치원에서 어떤 일이 제일 재미있었어?"</p>
                </div>

                <div className="bg-orange-50/80 p-3 rounded-xl border border-orange-100 text-[13px]">
                  <span className="font-bold text-orange-900 block" style={{ fontFamily: "'Jua', sans-serif" }}>
                    2. 원인과 이유 상상하기
                  </span>
                  <p className="text-slate-700 mt-0.5">"공룡은 왜 큰 나뭇잎을 먹었을까? 만약 고기를 먹었다면 어떻게 되었을까?"</p>
                </div>

                <div className="bg-purple-50/80 p-3 rounded-xl border border-purple-100 text-[13px]">
                  <span className="font-bold text-purple-900 block" style={{ fontFamily: "'Jua', sans-serif" }}>
                    3. 감정 언어 확장하기
                  </span>
                  <p className="text-slate-700 mt-0.5">"좋았어" 대신 "뿌듯했어", "가슴이 콩닥콩닥했어" 같은 다채로운 감정 단어 들려주기</p>
                </div>
              </div>
            </div>

            {/* Guide Card 2 */}
            <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-[#96320E] font-black text-[16px] mb-2" style={{ fontFamily: "'Jua', sans-serif" }}>
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <span>칭찬과 경청 꿀팁</span>
              </div>

              <ul className="text-[13px] text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>아이가 말을 끝마칠 때까지 느긋하게 3초 정도 기다려 주면 발화량이 훨씬 늘어납니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>틀린 문장을 바로 교정하기보다, 올바른 문장으로 되짚어 자연스럽게 따라 말하게 해주세요.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="relative z-30 w-full max-w-md mx-auto px-5 pb-6 pt-2 shrink-0 bg-[#F8FAFC]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            soundFx.playPop();
            onGoHome();
          }}
          className="w-full py-3.5 rounded-full bg-[#1E293B] hover:bg-slate-800 active:bg-slate-900 text-white font-extrabold text-[18px] tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
        >
          <span style={{ fontFamily: "'Jua', sans-serif" }}>아이 학습 화면으로 돌아가기</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
