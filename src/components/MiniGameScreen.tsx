import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  ChevronLeft,
  Gamepad2,
  Sparkles,
  Trophy,
  Volume2,
  RotateCcw,
  Star,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Heart,
  Zap,
  Award,
  Music,
  Palette,
  Play,
  ArrowLeft,
  Music2,
  Flame,
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import { speechManager } from '../utils/speech';
import { HamburgerMenu } from './HamburgerMenu';

import bgImage from '../assets/images/background.png';
import characterImage from '../assets/images/charater3.png';
import starImage from '../assets/images/star.png';

interface MiniGameScreenProps {
  onBack: () => void;
  onGoHome: () => void;
  onGoMyStory: () => void;
  onGoBadges: () => void;
  onGoParent: () => void;
}

interface QuizQuestion {
  id: number;
  hintText: string;
  speakPrompt: string;
  options: { emoji: string; label: string; isCorrect: boolean }[];
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    hintText: '어흥! 나는 밀림의 왕이고 멋진 갈기를 가지고 있어. 누구일까?',
    speakPrompt: '어흥! 나는 밀림의 왕이야. 동물의 왕은 누구일까?',
    options: [
      { emoji: '🦁', label: '사자', isCorrect: true },
      { emoji: '🐰', label: '토끼', isCorrect: false },
      { emoji: '🐶', label: '강아지', isCorrect: false },
      { emoji: '🐱', label: '고양이', isCorrect: false },
    ],
    explanation: '정답! 어흥! 멋진 사자였어!',
  },
  {
    id: 2,
    hintText: '바닷속에서 첨벙첨벙 헤엄치고 커다란 물기둥을 뿜어요!',
    speakPrompt: '바닷속을 헤엄치는 커다란 친구는 누구일까?',
    options: [
      { emoji: '🐵', label: '원숭이', isCorrect: false },
      { emoji: '🐳', label: '고래', isCorrect: true },
      { emoji: '🐥', label: '병아리', isCorrect: false },
      { emoji: '🐸', label: '개구리', isCorrect: false },
    ],
    explanation: '정답! 바다의 거인 고래야!',
  },
  {
    id: 3,
    hintText: '새콤달콤 빨간 색깔에 알록달록 씨앗이 콕콕 박혀있는 과일은?',
    speakPrompt: '새콤달콤 빨갛고 맛있는 과일은 무엇일까?',
    options: [
      { emoji: '🍌', label: '바나나', isCorrect: false },
      { emoji: '🍓', label: '딸기', isCorrect: true },
      { emoji: '🍇', label: '포도', isCorrect: false },
      { emoji: '🍉', label: '수박', isCorrect: false },
    ],
    explanation: '정답! 달콤한 딸기야!',
  },
  {
    id: 4,
    hintText: '하늘에 알록달록 7가지 색깔로 예쁘게 뜨는 다리는?',
    speakPrompt: '비가 온 뒤 하늘에 뜨는 예쁜 무지개는 무엇일까?',
    options: [
      { emoji: '☀️', label: '태양', isCorrect: false },
      { emoji: '🌙', label: '달님', isCorrect: false },
      { emoji: '🌈', label: '무지개', isCorrect: true },
      { emoji: '☁️', label: '구름', isCorrect: false },
    ],
    explanation: '정답! 일곱 빛깔 예쁜 무지개야!',
  },
  {
    id: 5,
    hintText: '유치원에서 알록달록 장난감을 쌓아서 성을 만드는 놀이는?',
    speakPrompt: '높이높이 쌓는 신나는 놀이는 무엇일까?',
    options: [
      { emoji: '🧩', label: '블록 놀이', isCorrect: true },
      { emoji: '⚽', label: '축구', isCorrect: false },
      { emoji: '🎨', label: '그림 그리기', isCorrect: false },
      { emoji: '🎵', label: '노래 부르기', isCorrect: false },
    ],
    explanation: '정답! 높이높이 쌓는 블록 놀이야!',
  },
];

interface HangulQuestion {
  id: number;
  word: string;
  emoji: string;
  hintText: string;
  speakPrompt: string;
  syllables: {
    targetChar: string;
    initial: string;
    vowel: string;
  }[];
}

const HANGUL_QUESTIONS: HangulQuestion[] = [
  {
    id: 1,
    word: '소',
    emoji: '🐄',
    hintText: '음매~ 고소한 우유를 주는 정겨운 "소"',
    speakPrompt: '음매~ 정겨운 동물 소를 완성해보자! 시옷과 오를 찾아봐!',
    syllables: [{ targetChar: '소', initial: 'ㅅ', vowel: 'ㅗ' }],
  },
  {
    id: 2,
    word: '오리',
    emoji: '🦆',
    hintText: '물 위에서 꽥꽥 헤엄치는 귀여운 "오리"',
    speakPrompt: '꽥꽥! 귀여운 오리를 만들어보자! 이응과 오, 리을과 이를 찾아줘!',
    syllables: [
      { targetChar: '오', initial: 'ㅇ', vowel: 'ㅗ' },
      { targetChar: '리', initial: 'ㄹ', vowel: 'ㅣ' },
    ],
  },
  {
    id: 3,
    word: '나비',
    emoji: '🦋',
    hintText: '꽃밭을 살랑살랑 훨훨 날아다니는 예쁜 "나비"',
    speakPrompt: '꽃밭을 날아다니는 나비를 완성해봐! 니은과 아, 비읍과 이!',
    syllables: [
      { targetChar: '나', initial: 'ㄴ', vowel: 'ㅏ' },
      { targetChar: '비', initial: 'ㅂ', vowel: 'ㅣ' },
    ],
  },
  {
    id: 4,
    word: '사자',
    emoji: '🦁',
    hintText: '어흥! 멋진 갈기를 가진 동물의 왕 "사자"',
    speakPrompt: '어흥! 동물의 왕 사자야! 시옷과 아, 지읒과 아!',
    syllables: [
      { targetChar: '사', initial: 'ㅅ', vowel: 'ㅏ' },
      { targetChar: '자', initial: 'ㅈ', vowel: 'ㅏ' },
    ],
  },
  {
    id: 5,
    word: '바다',
    emoji: '🌊',
    hintText: '파도가 찰싹찰싹 치는 푸르고 시원한 "바다"',
    speakPrompt: '시원한 바다를 조각으로 맞춰보자! 비읍과 아, 디귿과 아!',
    syllables: [
      { targetChar: '바', initial: 'ㅂ', vowel: 'ㅏ' },
      { targetChar: '다', initial: 'ㄷ', vowel: 'ㅏ' },
    ],
  },
];

const HANGUL_CONSONANTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const HANGUL_VOWELS = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];

const JAMO_NAMES: { [key: string]: string } = {
  ㄱ: '기역',
  ㄴ: '니은',
  ㄷ: '디귿',
  ㄹ: '리을',
  ㅁ: '미음',
  ㅂ: '비읍',
  ㅅ: '시옷',
  ㅇ: '이응',
  ㅈ: '지읒',
  ㅊ: '치읓',
  ㅋ: '키억',
  ㅌ: '티읕',
  ㅍ: '피읖',
  ㅎ: '히읗',
  ㅏ: '아',
  ㅑ: '야',
  ㅓ: '어',
  ㅕ: '여',
  ㅗ: '오',
  ㅛ: '요',
  ㅜ: '우',
  ㅠ: '유',
  ㅡ: '으',
  ㅣ: '이',
};

function combineHangulJamo(initial: string, vowel: string): string {
  const INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const VOWELS_ALL = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const iIdx = INITIALS.indexOf(initial);
  const vIdx = VOWELS_ALL.indexOf(vowel);
  if (iIdx === -1 || vIdx === -1) return '';
  const code = 0xAC00 + (iIdx * 21 + vIdx) * 28;
  return String.fromCharCode(code);
}

type GameMode = 'list' | 'quiz' | 'catcher' | 'rhythm' | 'coloring' | 'hangul';

export const MiniGameScreen: React.FC<MiniGameScreenProps> = ({
  onBack,
  onGoHome,
  onGoMyStory,
  onGoBadges,
  onGoParent,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGameMode, setActiveGameMode] = useState<GameMode>('list');

  // Quiz Game State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Star Catcher State
  const [catcherScore, setCatcherScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isCatcherActive, setIsCatcherActive] = useState(false);
  const [starPosition, setStarPosition] = useState({ top: 40, left: 50, emoji: '⭐' });

  // Rhythm Game State
  const [rhythmScore, setRhythmScore] = useState(0);
  const [rhythmCombo, setRhythmCombo] = useState(0);
  const [isRhythmPlaying, setIsRhythmPlaying] = useState(false);
  const [rhythmNoteIndex, setRhythmNoteIndex] = useState(0);

  // Coloring Game State
  const [selectedColor, setSelectedColor] = useState('#FF5757');
  const [coloredParts, setColoredParts] = useState<{ [key: string]: string }>({});

  // Hangul Game State
  const [hangulQIdx, setHangulQIdx] = useState(0);
  const [hangulSyllableIdx, setHangulSyllableIdx] = useState(0);
  const [selectedConsonant, setSelectedConsonant] = useState<string | null>(null);
  const [selectedVowel, setSelectedVowel] = useState<string | null>(null);
  const [hangulScore, setHangulScore] = useState(0);
  const [isHangulCompleted, setIsHangulCompleted] = useState(false);
  const [hangulFeedback, setHangulFeedback] = useState<string | null>(null);

  // Adaptive Difficulty & Hint State
  const [hangulDifficulty, setHangulDifficulty] = useState<number>(1); // 1: 쉬움 🟢, 2: 보통 🟡, 3: 어려움 🔴
  const [hangulStreak, setHangulStreak] = useState<number>(0);
  const [hangulWrongAttempts, setHangulWrongAttempts] = useState<number>(0);
  const [hangulUsedHint, setHangulUsedHint] = useState<boolean>(false);

  const [quizDifficulty, setQuizDifficulty] = useState<number>(1);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [quizWrongAttempts, setQuizWrongAttempts] = useState<number>(0);
  const [quizUsedHint, setQuizUsedHint] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];
  const currentHangulQ = HANGUL_QUESTIONS[hangulQIdx];
  const currentTargetSyllable = currentHangulQ?.syllables[hangulSyllableIdx];

  // Auto speak hint when question loads
  useEffect(() => {
    if (activeGameMode === 'quiz' && currentQ && !isQuizCompleted) {
      speechManager.speak(currentQ.speakPrompt);
    }
  }, [currentQuestionIdx, activeGameMode, isQuizCompleted]);

  // Auto speak hangul prompt when question changes
  useEffect(() => {
    if (activeGameMode === 'hangul' && currentHangulQ && !isHangulCompleted) {
      speechManager.speak(currentHangulQ.speakPrompt);
    }
  }, [hangulQIdx, activeGameMode, isHangulCompleted]);

  // Handle Jamo Selection
  const checkHangulCombination = (c: string, v: string) => {
    if (!currentTargetSyllable) return;

    const formedChar = combineHangulJamo(c, v);

    if (formedChar === currentTargetSyllable.targetChar) {
      soundFx.playSuccess();
      const nextSyllableIdx = hangulSyllableIdx + 1;

      // Always advance hangulSyllableIdx so all completed syllables display as completed in green
      setHangulSyllableIdx(nextSyllableIdx);
      setSelectedConsonant(null);
      setSelectedVowel(null);

      // Adaptive difficulty logic:
      // If used hint or wrong attempts >= 5, decrease difficulty next time.
      // If answered without hint consecutively (streak >= 2), increase difficulty!
      let newDiff = hangulDifficulty;
      let newStreak = hangulStreak;

      if (hangulUsedHint || hangulWrongAttempts >= 5) {
        newDiff = Math.max(1, hangulDifficulty - 1);
        newStreak = 0;
      } else {
        newStreak = hangulStreak + 1;
        if (newStreak >= 2) {
          newDiff = Math.min(3, hangulDifficulty + 1);
          newStreak = 0;
        }
      }

      const diffChanged = newDiff !== hangulDifficulty;
      setHangulDifficulty(newDiff);
      setHangulStreak(newStreak);

      const earnedScore = hangulDifficulty === 1 ? 15 : hangulDifficulty === 2 ? 20 : 30;

      if (nextSyllableIdx < currentHangulQ.syllables.length) {
        setHangulWrongAttempts(0);
        setHangulUsedHint(false);
        setHangulFeedback(`우와! '${formedChar}' 완성! 다음 글자도 맞춰봐! ✨`);
        speechManager.speak(`맞았어! ${formedChar}! 다음 글자도 만들어보자!`);
      } else {
        setHangulScore((prev) => prev + earnedScore);

        let bonusMsg = '';
        if (diffChanged && newDiff > hangulDifficulty) {
          bonusMsg = ' 🔥 연승! 난이도 UP!';
        } else if (diffChanged && newDiff < hangulDifficulty) {
          bonusMsg = ' 💡 힌트/재시도로 다음단계 난이도 DOWN!';
        }

        if (hangulQIdx < HANGUL_QUESTIONS.length - 1) {
          setHangulFeedback(`짝짝짝! '${currentHangulQ.word}' 단어 완성! 🎉${bonusMsg}`);
          speechManager.speak(`대단해! 정답! ${currentHangulQ.word}!`);
          setTimeout(() => {
            setHangulQIdx((prev) => prev + 1);
            setHangulSyllableIdx(0);
            setHangulWrongAttempts(0);
            setHangulUsedHint(false);
            setHangulFeedback(null);
          }, 2200);
        } else {
          setHangulFeedback(`짝짝짝! '${currentHangulQ.word}' 단어 완성! 🎉${bonusMsg}`);
          setTimeout(() => {
            setIsHangulCompleted(true);
            speechManager.speak(`우와! 모든 한글 조각을 다 맞췄어! 정말 최고야!`);
          }, 1500);
        }
      }
    } else {
      soundFx.playPop();
      const nextWrong = hangulWrongAttempts + 1;
      setHangulWrongAttempts(nextWrong);

      if (nextWrong >= 5) {
        setHangulUsedHint(true);
        setHangulFeedback(`5번 틀렸어요! 💡 힌트로 반짝이는 정답 자모를 눌러봐요! (다음 난이도 DOWN)`);
        speechManager.speak(`5번 실패했어요. 정답 조각을 노란색으로 반짝여줄게요! 난이도가 조정됩니다.`);
      } else if (nextWrong >= 3) {
        setHangulFeedback(`3번 연속 틀렸어요! 💡 [힌트 보기] 버튼을 터치해 정답 힌트를 들어보세요!`);
        speechManager.speak(`3번 틀렸어요! 힌트가 준비되었어요. 힌트 버튼을 눌러보세요!`);
      } else {
        setHangulFeedback(`'${formedChar}'이 만들어졌어요! 다시 시도해볼까요? 💪 (${nextWrong}회 틀림)`);
        speechManager.speak(`아쉬워요! 다시 글자를 맞춰봐요!`);
      }

      setTimeout(() => {
        setSelectedConsonant(null);
        setSelectedVowel(null);
      }, 1500);
    }
  };

  const handleUseHangulHint = () => {
    if (!currentTargetSyllable) return;
    soundFx.playPop();
    setHangulUsedHint(true);
    speechManager.speak(`이번 글자의 자음은 ${JAMO_NAMES[currentTargetSyllable.initial]} 이고, 모음은 ${JAMO_NAMES[currentTargetSyllable.vowel]} 이예요! 반짝이는 조각을 눌러봐!`);
    setHangulFeedback(`💡 힌트 사용! 자음 '${currentTargetSyllable.initial}' + 모음 '${currentTargetSyllable.vowel}' 조각이 반짝입니다!`);
  };

  const handleSelectConsonant = (c: string) => {
    soundFx.playPop();
    const name = JAMO_NAMES[c] || c;
    speechManager.speak(name);
    setSelectedConsonant(c);

    if (selectedVowel) {
      checkHangulCombination(c, selectedVowel);
    }
  };

  const handleSelectVowel = (v: string) => {
    soundFx.playPop();
    const name = JAMO_NAMES[v] || v;
    speechManager.speak(name);
    setSelectedVowel(v);

    if (selectedConsonant) {
      checkHangulCombination(selectedConsonant, v);
    }
  };

  const handleRestartHangul = () => {
    soundFx.playPop();
    setHangulQIdx(0);
    setHangulSyllableIdx(0);
    setSelectedConsonant(null);
    setSelectedVowel(null);
    setHangulScore(0);
    setIsHangulCompleted(false);
    setHangulFeedback(null);
    setHangulWrongAttempts(0);
    setHangulUsedHint(false);
    setHangulDifficulty(1);
    setHangulStreak(0);
  };

  // Star Catcher Game Timer
  useEffect(() => {
    let timer: any = null;
    if (isCatcherActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isCatcherActive) {
      setIsCatcherActive(false);
      soundFx.playSuccess();
      speechManager.speak(`우와! 반짝 별을 ${catcherScore}개나 잡았어! 대단해!`);
    }
    return () => clearInterval(timer);
  }, [isCatcherActive, timeLeft, catcherScore]);

  const moveStarToRandomPosition = () => {
    const emojis = ['⭐', '🌟', '✨', '🎈', '💖', '👑'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const randomTop = Math.floor(Math.random() * 65) + 15;
    const randomLeft = Math.floor(Math.random() * 70) + 15;
    setStarPosition({ top: randomTop, left: randomLeft, emoji: randomEmoji });
  };

  const handleStartCatcher = () => {
    soundFx.playSuccess();
    setCatcherScore(0);
    setTimeLeft(15);
    setIsCatcherActive(true);
    moveStarToRandomPosition();
    speechManager.speak('준비~ 시작! 반짝 별을 톡톡 터치해봐!');
  };

  const handleTapStar = () => {
    if (!isCatcherActive) return;
    soundFx.playPop();
    setCatcherScore((prev) => prev + 1);
    moveStarToRandomPosition();
  };

  const handleAnswerSelect = (optionIdx: number, option: { label: string; isCorrect: boolean }) => {
    if (selectedOptionIdx !== null) return;

    setSelectedOptionIdx(optionIdx);

    if (option.isCorrect) {
      setIsCorrect(true);
      soundFx.playSuccess();
      setScore((prev) => prev + 20);
      speechManager.speak(currentQ.explanation);
    } else {
      setIsCorrect(false);
      soundFx.playPop();
      speechManager.speak('아쉬워요! 다시 생각해볼까요?');
    }

    setTimeout(() => {
      if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestionIdx((prev) => prev + 1);
        setSelectedOptionIdx(null);
        setIsCorrect(null);
      } else {
        setIsQuizCompleted(true);
        soundFx.playSuccess();
        speechManager.speak(`축하해! 모든 퀴즈를 풀고 ${score + (option.isCorrect ? 20 : 0)}점을 받았어!`);
      }
    }, 2000);
  };

  const handleRestartQuiz = () => {
    soundFx.playPop();
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedOptionIdx(null);
    setIsCorrect(null);
    setIsQuizCompleted(false);
  };

  const handleRhythmTap = (buttonIndex: number) => {
    soundFx.playPop();
    setRhythmScore((prev) => prev + 10);
    setRhythmCombo((prev) => prev + 1);
    setRhythmNoteIndex((prev) => (prev + 1) % 4);
  };

  const COLOR_PALETTE = ['#FF5757', '#FF914D', '#FFDE59', '#7ED957', '#5271FF', '#8C52FF', '#FF66C4', '#FFFFFF'];

  const GAMES_LIST = [
    {
      id: 'hangul',
      title: '한글 조각 맞추기',
      icon: '🔤',
      badge: '신규 🌟',
      badgeBg: 'bg-indigo-600 text-white',
      color: 'from-indigo-400 to-blue-600',
      description: '소리를 듣고 자음(ㄱ,ㄴ,ㄷ...)과 모음(ㅏ,ㅑ,ㅓ...) 조각을 맞춰 예쁜 단어를 만들어보아요!',
      playText: '한글 맞추기 시작',
    },
    {
      id: 'quiz',
      title: '낱말 퀴즈 놀이',
      icon: '🦁',
      badge: '추천 ⭐',
      badgeBg: 'bg-amber-500 text-white',
      color: 'from-amber-400 to-orange-500',
      description: '레디의 힌트를 듣고 알맞은 동물과 낱말을 찾아보아요!',
      playText: '퀴즈 시작하기',
    },
    {
      id: 'catcher',
      title: '반짝 별 잡기',
      icon: '⭐',
      badge: '인기 🔥',
      badgeBg: 'bg-purple-600 text-white',
      color: 'from-purple-500 to-indigo-600',
      description: '통통 튀어오르는 반짝 별을 톡톡 터치해서 모아보아요!',
      playText: '별 잡기 시작',
    },
    {
      id: 'rhythm',
      title: '동요 리듬 탭탭',
      icon: '🎵',
      badge: '신남 🎶',
      badgeBg: 'bg-pink-500 text-white',
      color: 'from-pink-400 to-rose-500',
      description: '신나는 어린이 동요에 맞춰 하트 노트를 박자에 맞게 탭해봐요!',
      playText: '리듬 연주하기',
    },
    {
      id: 'coloring',
      title: '알록달록 색칠놀이',
      icon: '🎨',
      badge: '창의 🎨',
      badgeBg: 'bg-emerald-500 text-white',
      color: 'from-emerald-400 to-teal-600',
      description: '레디와 친구들을 내가 좋아하는 예쁜 물감 색으로 꾸며보아요!',
      playText: '색칠 시작하기',
    },
  ];

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
        onGoBadges={onGoBadges}
        onGoParent={onGoParent}
        onGoMiniGame={() => {
          setIsMenuOpen(false);
          setActiveGameMode('list');
        }}
        activeItem="minigame"
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
          <Gamepad2 className="w-5 h-5 text-[#FF734E]" />
          <span
            className="text-[#33221B] text-[18px] font-black"
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            {activeGameMode === 'list' ? '미니게임 놀이터' : '레디 미니게임'}
          </span>
        </div>

        <button
          onClick={() => {
            soundFx.playPop();
            if (activeGameMode !== 'list') {
              setActiveGameMode('list');
            } else {
              onBack();
            }
          }}
          className="w-11 h-11 rounded-full bg-white/95 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-amber-100/60 flex items-center justify-center cursor-pointer hover:bg-white active:scale-95 transition-all"
          title={activeGameMode !== 'list' ? '게임목록' : '뒤로가기'}
        >
          <ChevronLeft className="w-6 h-6 text-[#96320E]" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-md mx-auto px-5 pt-3 pb-3 flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* ================= MODE 1: GAME LIST SCREEN ================= */}
        {activeGameMode === 'list' && (
          <div className="flex-1 flex flex-col">
            {/* Greeting Header Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[24px] p-4 border border-amber-200/70 shadow-xs flex items-center gap-3 mb-4 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white border border-amber-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img src={characterImage} alt="레디" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2
                  className="text-[#33221B] text-[18px] font-black leading-tight"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  신나는 미니게임 리스트! 🎮
                </h2>
                <p className="text-[#66554E] text-[14px] mt-0.5" style={{ fontFamily: "'Jua', sans-serif" }}>
                  어떤 게임을 해볼까요? 좋아하는 놀이를 터치해봐요!
                </p>
              </div>
            </div>

            {/* Game List Grid */}
            <div className="grid grid-cols-1 gap-3.5 flex-1 pb-2">
              {GAMES_LIST.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    soundFx.playPop();
                    setActiveGameMode(game.id as GameMode);
                  }}
                  className="bg-white rounded-[24px] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.05)] border-2 border-amber-100 hover:border-orange-300 transition-all cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden group"
                >
                  {/* Left Icon & Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-sm shrink-0`}
                    >
                      {game.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${game.badgeBg}`}
                          style={{ fontFamily: "'Jua', sans-serif" }}
                        >
                          {game.badge}
                        </span>
                      </div>
                      <h3
                        className="text-[#33221B] text-[18px] font-black truncate"
                        style={{ fontFamily: "'Jua', sans-serif" }}
                      >
                        {game.title}
                      </h3>
                      <p className="text-[#806B62] text-[13px] leading-tight line-clamp-2 mt-0.5" style={{ fontFamily: "'Jua', sans-serif" }}>
                        {game.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Play Action Button */}
                  <div className="shrink-0 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 group-hover:bg-[#FF734E] group-hover:text-white transition-all flex items-center justify-center text-[#FF734E]">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ================= MODE 6: HANGUL MATCHING GAME ================= */}
        {activeGameMode === 'hangul' && (
          <div className="flex-1 flex flex-col justify-between">
            {!isHangulCompleted ? (
              <>
                {/* Character Hint Box */}
                <div className="bg-white rounded-[24px] p-3 shadow-sm border border-indigo-100 flex items-center gap-3 mb-2 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 p-1 flex items-center justify-center shrink-0">
                    <span className="text-3xl">{currentHangulQ.emoji}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full" style={{ fontFamily: "'Jua', sans-serif" }}>
                          단어 {hangulQIdx + 1} / {HANGUL_QUESTIONS.length}
                        </span>

                        {/* Difficulty Level Badge */}
                        <span
                          className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
                            hangulDifficulty === 1
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : hangulDifficulty === 2
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}
                          style={{ fontFamily: "'Jua', sans-serif" }}
                        >
                          {hangulDifficulty === 1 ? '🟢 1단계 (쉬움)' : hangulDifficulty === 2 ? '🟡 2단계 (보통)' : '🔴 3단계 (어려움)'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          soundFx.playPop();
                          speechManager.speak(currentHangulQ.speakPrompt);
                        }}
                        className="text-[12px] font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-all"
                        style={{ fontFamily: "'Jua', sans-serif" }}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>소리 재생</span>
                      </button>
                    </div>

                    <p className="text-[#33221B] text-[14px] font-bold leading-tight" style={{ fontFamily: "'Jua', sans-serif" }}>
                      "{currentHangulQ.hintText}"
                    </p>
                  </div>
                </div>

                {/* Word Target Slot & Combining Workspace */}
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[24px] p-3 shadow-md border-2 border-indigo-300 text-white mb-2 shrink-0 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between text-[12px] font-extrabold text-indigo-100 mb-1.5 px-1" style={{ fontFamily: "'Jua', sans-serif" }}>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>조각 모아 단어 만들기 (점수: {hangulScore}점)</span>
                    </div>
                    {hangulWrongAttempts > 0 && (
                      <span className="text-amber-200 bg-black/20 px-2 py-0.5 rounded-full">
                        틀린 횟수: {hangulWrongAttempts}회
                      </span>
                    )}
                  </div>

                  {/* Target Syllables Display */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {currentHangulQ.syllables.map((syl, idx) => {
                      const isCurrent = idx === hangulSyllableIdx;
                      const isCompleted = idx < hangulSyllableIdx;

                      return (
                        <div
                          key={idx}
                          className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 border-white text-white font-black text-2xl shadow-sm'
                              : isCurrent
                              ? 'bg-white border-amber-300 text-slate-800 font-black text-2xl shadow-lg ring-4 ring-amber-300/50 scale-105'
                              : 'bg-white/20 border-white/40 text-white/60 font-bold text-xl'
                          }`}
                        >
                          <span style={{ fontFamily: "'Jua', sans-serif" }}>
                            {isCompleted
                              ? syl.targetChar
                              : isCurrent
                              ? combineHangulJamo(selectedConsonant || '', selectedVowel || '') || '?'
                              : '?'}
                          </span>
                          <span className="text-[10px] opacity-80" style={{ fontFamily: "'Jua', sans-serif" }}>
                            {isCompleted ? '완성' : isCurrent ? '맞추는 중' : `글자 ${idx + 1}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Combination State indicator */}
                  <div className="flex items-center gap-2 text-[13px] font-bold bg-black/20 px-3.5 py-1 rounded-full border border-white/20" style={{ fontFamily: "'Jua', sans-serif" }}>
                    <span>선택 조각:</span>
                    <span className="px-2 py-0.5 rounded bg-white/30 text-amber-200 font-black">
                      {selectedConsonant ? `${selectedConsonant} (${JAMO_NAMES[selectedConsonant]})` : '자음'}
                    </span>
                    <span>+</span>
                    <span className="px-2 py-0.5 rounded bg-white/30 text-pink-200 font-black">
                      {selectedVowel ? `${selectedVowel} (${JAMO_NAMES[selectedVowel]})` : '모음'}
                    </span>
                  </div>

                  {hangulFeedback && (
                    <div className="mt-1.5 text-[13px] font-bold text-amber-200 animate-bounce text-center" style={{ fontFamily: "'Jua', sans-serif" }}>
                      {hangulFeedback}
                    </div>
                  )}
                </div>

                {/* Jamo Selection Tiles */}
                <div className="flex-1 flex flex-col justify-between min-h-0 gap-2">
                  {/* Consonant Blocks (자음) */}
                  <div className="bg-white rounded-[20px] p-2 border border-amber-200/80 shadow-xs flex flex-col">
                    <div className="flex items-center justify-between mb-1 text-[12px] font-bold text-amber-800" style={{ fontFamily: "'Jua', sans-serif" }}>
                      <span>1️⃣ 자음 조각 (첫소리: ㄱ,ㄴ,ㄷ...)</span>
                      {(hangulWrongAttempts >= 3 || hangulUsedHint) && (
                        <span className="text-amber-600 animate-pulse">💡 정답 자음 반짝임!</span>
                      )}
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                      {HANGUL_CONSONANTS.map((c) => {
                        const isSelected = selectedConsonant === c;
                        const isCorrectTarget = currentTargetSyllable?.initial === c;
                        const isHintActive = (hangulWrongAttempts >= 3 || hangulUsedHint) && isCorrectTarget;

                        return (
                          <motion.button
                            key={c}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSelectConsonant(c)}
                            className={`h-11 rounded-xl font-black text-lg flex items-center justify-center cursor-pointer border-2 transition-all ${
                              isSelected
                                ? 'bg-amber-400 border-amber-600 text-slate-900 shadow-md ring-2 ring-amber-300 scale-105'
                                : isHintActive
                                ? 'bg-amber-300 border-amber-500 text-amber-950 shadow-lg ring-4 ring-amber-400 animate-pulse scale-110 font-black'
                                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900 shadow-2xs'
                            }`}
                            style={{ fontFamily: "'Jua', sans-serif" }}
                          >
                            {c}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vowel Blocks (모음) */}
                  <div className="bg-white rounded-[20px] p-2 border border-pink-200/80 shadow-xs flex flex-col">
                    <div className="flex items-center justify-between mb-1 text-[12px] font-bold text-pink-800" style={{ fontFamily: "'Jua', sans-serif" }}>
                      <span>2️⃣ 모음 조각 (가운뎃소리: ㅏ,ㅑ,ㅓ...)</span>
                      {(hangulWrongAttempts >= 3 || hangulUsedHint) && (
                        <span className="text-pink-600 animate-pulse">💡 정답 모음 반짝임!</span>
                      )}
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {HANGUL_VOWELS.map((v) => {
                        const isSelected = selectedVowel === v;
                        const isCorrectTarget = currentTargetSyllable?.vowel === v;
                        const isHintActive = (hangulWrongAttempts >= 3 || hangulUsedHint) && isCorrectTarget;

                        return (
                          <motion.button
                            key={v}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSelectVowel(v)}
                            className={`h-11 rounded-xl font-black text-lg flex items-center justify-center cursor-pointer border-2 transition-all ${
                              isSelected
                                ? 'bg-pink-400 border-pink-600 text-white shadow-md ring-2 ring-pink-300 scale-105'
                                : isHintActive
                                ? 'bg-pink-300 border-pink-500 text-pink-950 shadow-lg ring-4 ring-pink-400 animate-pulse scale-110 font-black'
                                : 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-900 shadow-2xs'
                            }`}
                            style={{ fontFamily: "'Jua', sans-serif" }}
                          >
                            {v}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 pt-1 shrink-0">
                    <button
                      onClick={() => {
                        soundFx.playPop();
                        setSelectedConsonant(null);
                        setSelectedVowel(null);
                        setHangulFeedback(null);
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] flex items-center justify-center gap-1 border border-slate-300 cursor-pointer"
                      style={{ fontFamily: "'Jua', sans-serif" }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>조각 초기화</span>
                    </button>

                    {/* Hint Button Trigger (Active when >= 3 wrong attempts or always available) */}
                    <button
                      onClick={handleUseHangulHint}
                      className={`flex-1 py-2 px-3 rounded-xl font-black text-[13px] flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        hangulWrongAttempts >= 3 || hangulUsedHint
                          ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-amber-500 ring-2 ring-amber-300 animate-bounce shadow-md'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                      }`}
                      style={{ fontFamily: "'Jua', sans-serif" }}
                    >
                      <span>💡 레디의 힌트 받기</span>
                      {hangulWrongAttempts >= 3 && <span className="text-[11px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full">추천!</span>}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Hangul Game Completion Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] p-6 shadow-xl border-4 border-indigo-200 flex flex-col items-center text-center my-auto"
              >
                <div className="text-6xl mb-3 animate-bounce">🔤🎉</div>

                <h2 className="text-[#33221B] text-[26px] font-black mb-1" style={{ fontFamily: "'Jua', sans-serif" }}>
                  한글 조각 맞추기 완주! 🏆
                </h2>

                <p className="text-[#66554E] text-[16px] mb-4" style={{ fontFamily: "'Jua', sans-serif" }}>
                  소리를 듣고 글자 조각들을 척척 맞춰낸 똑똑한 한글 박사님!
                </p>

                <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-200 mb-5">
                  <span className="text-indigo-800 text-[15px] font-bold block" style={{ fontFamily: "'Jua', sans-serif" }}>
                    획득한 점수
                  </span>
                  <span className="text-indigo-600 text-[36px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                    {hangulScore}점
                  </span>
                </div>

                <button
                  onClick={handleRestartHangul}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[20px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>다시 한글 놀이하기</span>
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* ================= MODE 2: QUIZ GAME ================= */}
        {activeGameMode === 'quiz' && (
          <div className="flex-1 flex flex-col justify-between">
            {!isQuizCompleted ? (
              <>
                {/* Character Speech Box */}
                <div className="bg-white rounded-[26px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-orange-100/80 flex items-start gap-3 mb-3 shrink-0">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FFF5EE] border-2 border-[#FFD8C2] p-1 flex items-center justify-center shrink-0">
                    <img
                      src={characterImage}
                      alt="레디"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-[13px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full"
                        style={{ fontFamily: "'Jua', sans-serif" }}
                      >
                        문제 {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
                      </span>
                      <button
                        onClick={() => {
                          soundFx.playPop();
                          speechManager.speak(currentQ.speakPrompt);
                        }}
                        className="text-[12px] font-bold text-[#96320E] bg-[#FFF0E6] hover:bg-[#FFE2D1] px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-all"
                        style={{ fontFamily: "'Jua', sans-serif" }}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>다시 들려줘</span>
                      </button>
                    </div>

                    <p
                      className="text-[#33221B] text-[16px] sm:text-[17px] font-bold leading-snug"
                      style={{ fontFamily: "'Jua', sans-serif" }}
                    >
                      "{currentQ.hintText}"
                    </p>
                  </div>
                </div>

                {/* Score & Progress Status */}
                <div className="flex items-center justify-between bg-amber-50/80 px-4 py-2 rounded-2xl border border-amber-200/60 mb-3 shrink-0">
                  <span
                    className="text-[#96320E] text-[14px] font-bold flex items-center gap-1"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>현재 점수: {score}점</span>
                  </span>
                  <div className="flex gap-1">
                    {QUIZ_QUESTIONS.map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full border ${
                          i < currentQuestionIdx
                            ? 'bg-[#10B981] border-[#059669]'
                            : i === currentQuestionIdx
                            ? 'bg-[#FF734E] border-[#EA580C] animate-pulse'
                            : 'bg-slate-200 border-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 4 Quiz Options Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOptionIdx === idx;
                    let cardBg = 'bg-white border-slate-200 hover:border-orange-300';
                    if (isSelected) {
                      cardBg = opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-100'
                        : 'bg-rose-50 border-rose-400 ring-4 ring-rose-100';
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={selectedOptionIdx !== null}
                        onClick={() => handleAnswerSelect(idx, opt)}
                        className={`relative rounded-[24px] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${cardBg}`}
                      >
                        <span className="text-4xl sm:text-5xl mb-2">{opt.emoji}</span>
                        <span
                          className="text-[#33221B] text-[18px] font-black"
                          style={{ fontFamily: "'Jua', sans-serif" }}
                        >
                          {opt.label}
                        </span>

                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            {opt.isCorrect ? (
                              <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                            ) : (
                              <XCircle className="w-6 h-6 text-[#F43F5E]" />
                            )}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Quiz Completion Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] p-6 shadow-xl border-4 border-[#FFE2CC] flex flex-col items-center text-center my-auto"
              >
                <div className="relative w-24 h-24 mb-2">
                  <img src={starImage} alt="Star" className="w-full h-full object-contain animate-bounce" />
                </div>

                <h2
                  className="text-[#33221B] text-[26px] font-black mb-1"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  축하해! 퀴즈 왕 완성! 🎉
                </h2>

                <p className="text-[#66554E] text-[16px] mb-4" style={{ fontFamily: "'Jua', sans-serif" }}>
                  모든 문제를 아주 씩씩하고 똑똑하게 잘 맞췄어요!
                </p>

                <div className="bg-[#FFF5EE] px-6 py-3 rounded-2xl border border-[#FFD8C2] mb-5">
                  <span className="text-[#96320E] text-[15px] font-bold block" style={{ fontFamily: "'Jua', sans-serif" }}>
                    최종 점수
                  </span>
                  <span className="text-[#FF734E] text-[36px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                    {score}점
                  </span>
                </div>

                <button
                  onClick={handleRestartQuiz}
                  className="w-full py-3.5 rounded-2xl bg-[#FF734E] hover:bg-[#FF653D] text-white font-black text-[20px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>다시 도전하기</span>
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* ================= MODE 3: STAR CATCHER GAME ================= */}
        {activeGameMode === 'catcher' && (
          <div className="flex-1 flex flex-col">
            {/* Header Status Bar */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-purple-100 shadow-xs mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-[#33221B] text-[16px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                  모은 별: {catcherScore}개
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  ⏱️ 남은 시간: {timeLeft}초
                </span>
              </div>
            </div>

            {/* Interactive Game Play Arena */}
            <div className="relative flex-1 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-[28px] overflow-hidden border-4 border-purple-200 shadow-inner p-4 min-h-[300px]">
              {isCatcherActive ? (
                <motion.button
                  key={`${starPosition.top}-${starPosition.left}`}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1.2, rotate: 0 }}
                  exit={{ scale: 0 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={handleTapStar}
                  className="absolute p-3 rounded-full cursor-pointer bg-white/20 backdrop-blur-md border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                  style={{
                    top: `${starPosition.top}%`,
                    left: `${starPosition.left}%`,
                  }}
                >
                  <span className="text-4xl sm:text-5xl block animate-pulse">{starPosition.emoji}</span>
                </motion.button>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-xs">
                  <div className="w-20 h-20 mb-3 bg-white/10 rounded-full p-2 border border-white/30 flex items-center justify-center">
                    <img src={characterImage} alt="레디" className="w-full h-full object-contain" />
                  </div>

                  <h3 className="text-white text-[24px] font-black mb-1" style={{ fontFamily: "'Jua', sans-serif" }}>
                    {timeLeft === 0 ? `게임 종료! 총 ${catcherScore}개 획득! 🌟` : '레디의 반짝 별 잡기! ✨'}
                  </h3>

                  <p className="text-purple-200 text-[15px] mb-5" style={{ fontFamily: "'Jua', sans-serif" }}>
                    화면에 뿅! 나타나는 별을 톡톡 터치해서 누구보다 많이 모아보세요!
                  </p>

                  <button
                    onClick={handleStartCatcher}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-black text-[20px] shadow-lg transition-all cursor-pointer flex items-center gap-2"
                    style={{ fontFamily: "'Jua', sans-serif" }}
                  >
                    <Zap className="w-6 h-6 fill-slate-900" />
                    <span>{timeLeft === 0 ? '다시 시작하기' : '게임 시작!'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MODE 4: RHYTHM TAP GAME ================= */}
        {activeGameMode === 'rhythm' && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-pink-200 shadow-xs mb-3 shrink-0">
              <span className="text-[#33221B] text-[16px] font-black flex items-center gap-1" style={{ fontFamily: "'Jua', sans-serif" }}>
                <Music2 className="w-5 h-5 text-pink-500" />
                <span>점수: {rhythmScore}점</span>
              </span>
              <span className="text-[14px] font-bold text-rose-600 bg-rose-50 px-3 py-0.5 rounded-full border border-rose-200">
                🔥 {rhythmCombo} COMBO!
              </span>
            </div>

            <div className="flex-1 bg-gradient-to-b from-pink-900 via-purple-950 to-slate-900 rounded-[28px] border-4 border-pink-300 p-4 flex flex-col items-center justify-between relative overflow-hidden">
              <div className="text-center pt-2">
                <span className="text-pink-200 text-[14px] font-bold" style={{ fontFamily: "'Jua', sans-serif" }}>
                  🎵 곰 세 마리가 한 집에 있어~
                </span>
                <p className="text-white text-[18px] font-black mt-1" style={{ fontFamily: "'Jua', sans-serif" }}>
                  반짝이는 하트 버튼을 톡톡 탭해요!
                </p>
              </div>

              {/* Rhythm Note Stage */}
              <div className="grid grid-cols-4 gap-3 w-full max-w-xs my-auto">
                {['💖', '🌟', '🎈', '⭐'].map((emoji, idx) => (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleRhythmTap(idx)}
                    className={`h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 shadow-lg ${
                      rhythmNoteIndex === idx
                        ? 'bg-gradient-to-b from-pink-400 to-rose-500 border-white ring-4 ring-pink-300 animate-bounce'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-3xl mb-1">{emoji}</span>
                    <span className="text-xs font-bold text-white" style={{ fontFamily: "'Jua', sans-serif" }}>
                      TAP
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="w-full text-center pb-2">
                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    setRhythmScore(0);
                    setRhythmCombo(0);
                    speechManager.speak('신나게 박자에 맞춰 연주해봐요!');
                  }}
                  className="px-6 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-[15px] cursor-pointer"
                  style={{ fontFamily: "'Jua', sans-serif" }}
                >
                  새로 시작하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODE 5: COLORING GAME ================= */}
        {activeGameMode === 'coloring' && (
          <div className="flex-1 flex flex-col">
            {/* Coloring Canvas */}
            <div className="bg-white rounded-[28px] border-4 border-emerald-200 shadow-md p-4 flex-1 flex flex-col items-center justify-between mb-3">
              <div className="text-center mb-2">
                <span className="text-emerald-700 text-[16px] font-black" style={{ fontFamily: "'Jua', sans-serif" }}>
                  🎨 터치해서 예쁜 색깔로 칠해보세요!
                </span>
              </div>

              {/* Character Drawing Outlines */}
              <div className="w-full max-w-[240px] aspect-square relative border-2 border-dashed border-emerald-300 rounded-3xl p-4 flex items-center justify-center bg-emerald-50/50">
                <div className="grid grid-cols-2 gap-2 w-full h-full">
                  {['head', 'body', 'leftEar', 'rightEar'].map((part) => (
                    <div
                      key={part}
                      onClick={() => {
                        soundFx.playPop();
                        setColoredParts((prev) => ({ ...prev, [part]: selectedColor }));
                      }}
                      style={{ backgroundColor: coloredParts[part] || '#FFFFFF' }}
                      className="rounded-2xl border-2 border-slate-400 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-center font-bold text-slate-500 text-xs shadow-xs"
                    >
                      {part === 'head' && '얼굴 🐱'}
                      {part === 'body' && '옷 👕'}
                      {part === 'leftEar' && '귀 👂'}
                      {part === 'rightEar' && '모자 🧢'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Palette Buttons */}
              <div className="flex items-center justify-center gap-2 pt-3 w-full overflow-x-auto">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      soundFx.playPop();
                      setSelectedColor(color);
                    }}
                    style={{ backgroundColor: color }}
                    className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer ${
                      selectedColor === color ? 'border-black ring-2 ring-emerald-400 scale-110' : 'border-white shadow-xs'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
