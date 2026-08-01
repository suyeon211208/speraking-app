import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/soundEffects';
import { speechManager } from '../utils/speech';
import { TopicOption, ChatMessage, StoryRecord } from '../types';
import { CompletionScreen } from './CompletionScreen';

import bgImage from '../assets/images/background.png';
import characterImage from '../assets/images/character_new.png';
import {
  ArrowLeft,
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
} from 'lucide-react';

interface SpeakingModeProps {
  initialTopic?: TopicOption;
  onBackToMain: () => void;
  onChangeTopic?: () => void;
  onCompleteStory?: (story: StoryRecord) => void;
}

const TOPICS: TopicOption[] = [
  {
    id: 'food',
    emoji: '🍎',
    title: '맛있는 음식',
    promptText: '오늘 가장 맛있게 먹은 음식이 뭐야?',
    color: '#FF6B6B',
    bgColor: '#FFF0F0',
  },
  {
    id: 'animal',
    emoji: '🐱',
    title: '좋아하는 동물',
    promptText: '네가 세상에서 제일 좋아하는 동물이 뭐야?',
    color: '#4ECDC4',
    bgColor: '#E6F9F8',
  },
  {
    id: 'play',
    emoji: '🎨',
    title: '재미있는 놀이',
    promptText: '오늘 무슨 재미있는 놀이 하면서 놀았어?',
    color: '#FFD166',
    bgColor: '#FFF9E6',
  },
  {
    id: 'feeling',
    emoji: '🌟',
    title: '오늘의 기분',
    promptText: '오늘 어떤 기분이 들었어? 신나는 일 있었어?',
    color: '#A06CD5',
    bgColor: '#F5ECFD',
  },
];

export const SpeakingMode: React.FC<SpeakingModeProps> = ({
  initialTopic,
  onBackToMain,
  onChangeTopic,
  onCompleteStory,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleFinish = () => {
    soundFx.playPop();
    speechManager.stopSpeak();
    speechManager.stopListening();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const childMsgs = messages.filter((m) => m.sender === 'child');
    const firstText = childMsgs.length > 0 ? childMsgs[0].text : '';

    const gradients = [
      'from-[#FFD8C2] to-[#FFAB91]',
      'from-[#A7F3D0] to-[#6EE7B7]',
      'from-[#FEF08A] to-[#FDE047]',
      'from-[#E9D5FF] to-[#C084FC]',
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newStory: StoryRecord = {
      id: Date.now().toString(),
      topicTag: activeTopic?.title || '오늘의 이야기',
      topicTagBg: activeTopic?.bgColor || '#E6F4EA',
      topicTagColor: activeTopic?.color || '#137333',
      title: firstText
        ? (firstText.length > 20 ? firstText.slice(0, 20) + '...' : firstText)
        : `${activeTopic?.title || '오늘의'} 대화 내용`,
      dateText: '방금 전',
      emoji: activeTopic?.emoji || '💬',
      thumbnailBg: randomGradient,
      messages: messages.map((m) => ({ sender: m.sender, text: m.text })),
      createdAt: Date.now(),
    };

    if (onCompleteStory) {
      onCompleteStory(newStory);
    }
    setIsCompleted(true);
  };
  const [activeTopic, setActiveTopic] = useState<TopicOption | null>(initialTopic || null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [readyReply, setReadyReply] = useState<string>(
    initialTopic
      ? initialTopic.promptText || '좋아하는 동물은 누구야?'
      : '좋아하는 동물은 누구야?'
  );
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [stars, setStars] = useState(1);
  const [customText, setCustomText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initial speech greeting
  useEffect(() => {
    soundFx.playChime();
    if (!isMuted) {
      speechManager.speak(readyReply);
    }
    return () => {
      speechManager.stopSpeak();
      speechManager.stopListening();
    };
  }, []);

  // Trigger TTS whenever readyReply changes
  const speakReadyReply = (text: string) => {
    setReadyReply(text);
    if (!isMuted) {
      setIsSpeaking(true);
      speechManager.speak(text, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Process user speech or message through server API
  const handleUserMessage = async (userText: string) => {
    if (!userText.trim()) return;

    soundFx.playPop();

    // Add child's message
    const childMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'child',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, childMsg]);
    setTranscript('');
    setCustomText('');
    setIsThinking(true);

    // Call server Gemini chat API
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          topic: activeTopic?.title,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || '우와 정말?! 레디도 너무 궁금해! 🌟';

      setIsThinking(false);

      // Reward stars and confetti
      setStars((prev) => prev + 1);
      soundFx.playSuccess();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF734E', '#4ECDC4', '#FFD166', '#A06CD5'],
      });

      // Add Ready's response
      const readyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ready',
        text: replyText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, readyMsg]);

      speakReadyReply(replyText);
    } catch (err) {
      console.error(err);
      setIsThinking(false);
      const fallbackText = '우와! 이야기해줘서 고마워! 레디는 네가 너무 좋아! 💖';
      speakReadyReply(fallbackText);
    }
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (isListening) {
      speechManager.stopListening();
      setIsListening(false);
      if (transcript.trim()) {
        handleUserMessage(transcript);
      }
    } else {
      speechManager.stopSpeak();
      setIsSpeaking(false);

      speechManager.startListening(
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            setIsListening(false);
            handleUserMessage(text);
          }
        },
        (error) => {
          console.warn('Speech rec error:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
      setIsListening(true);
      soundFx.playPop();
    }
  };

  // Select Topic
  const handleSelectTopic = (topic: TopicOption) => {
    setActiveTopic(topic);
    soundFx.playPop();
    speakReadyReply(`${topic.emoji} ${topic.promptText}`);
  };

  if (isCompleted) {
    return <CompletionScreen onNext={onBackToMain} />;
  }

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-[#FFFDF5] select-none">
      {/* Playground Background */}
      <img
        src={bgImage}
        alt="Playground"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90"
      />

      {/* Top Header Bar */}
      <div className="relative z-30 w-full max-w-md px-5 pt-3 flex items-center justify-between shrink-0">
        {/* Left: Back Arrow + 오늘의 이야기 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playPop();
              speechManager.stopSpeak();
              speechManager.stopListening();
              if (onChangeTopic) {
                onChangeTopic();
              } else {
                onBackToMain();
              }
            }}
            className="w-9 h-9 rounded-full bg-[#FFF0E6] text-[#96320E] flex items-center justify-center cursor-pointer hover:bg-[#FFE2D1] active:scale-95 transition-all shadow-xs"
            title="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1
            className="text-[#6E2207] text-[20px] sm:text-[22px] tracking-tight"
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            오늘의 이야기
          </h1>
        </div>

        {/* Right: 종료 버튼 + 00:00 타이머 */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleFinish}
            className="px-3 py-1 rounded-full bg-[#FFEAE0] text-[#96320E] text-[14px] cursor-pointer hover:bg-[#FFDCD0] active:scale-95 transition-all shadow-2xs"
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            종료
          </button>
          <span
            className="text-[#6E2207] text-[17px] sm:text-[19px] font-bold tracking-wider"
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            {formatTime(timerSeconds)}
          </span>
        </div>
      </div>

      {/* Topic Badge Banner */}
      <div className="relative z-20 mt-2 shrink-0 flex justify-center">
        <div className="px-4 py-1.5 rounded-full bg-[#F05A28] border-2 border-white text-white shadow-md flex items-center gap-1">
          <span
            className="text-[15px] sm:text-[17px] tracking-tight"
            style={{ fontFamily: "'Jua', sans-serif" }}
          >
            주제 : {activeTopic ? activeTopic.title : '좋아하는 동물'}
          </span>
        </div>
      </div>

      {/* Main Center Content Area */}
      <div className="relative z-20 w-full max-w-md flex-1 px-5 py-2 flex flex-col items-center justify-between min-h-0 overflow-hidden">
        {/* Speech Bubble Card */}
        <div className="w-full relative mt-1 mb-1 shrink-0">
          <motion.div
            key={readyReply}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full bg-white/95 backdrop-blur-xs rounded-[28px] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-orange-100/60 flex flex-col items-center justify-center min-h-[95px]"
          >
            <p
              className="text-[#33221B] text-[20px] sm:text-[23px] leading-snug text-center tracking-tight"
              style={{ fontFamily: "'Jua', sans-serif" }}
            >
              "{readyReply.replace(/^["'“”]+|["'“”]+$/g, '')}"
            </p>

            {/* Speech Arrow Tail */}
            <div className="absolute -bottom-[12px] left-[50%] -translate-x-[50%] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-white/95" />

            {/* Speaker TTS Icon Button */}
            <button
              onClick={() => {
                soundFx.playPop();
                speakReadyReply(readyReply);
              }}
              className="absolute -bottom-2 -right-1 w-9 h-9 rounded-full bg-white text-[#F05A28] flex items-center justify-center shadow-md border border-orange-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="다시 듣기"
            >
              <Volume2 className="w-4 h-4 stroke-[2.2]" />
            </button>
          </motion.div>
        </div>

        {/* Ready Character View */}
        <div className="relative flex-1 flex items-center justify-center w-full my-1 min-h-0 overflow-visible">
          <motion.div
            animate={
              isSpeaking
                ? { y: [0, -6, 0], scale: [1, 1.02, 1] }
                : isListening
                ? { scale: [1, 1.04, 1] }
                : { y: [0, -4, 0] }
            }
            transition={{ repeat: Infinity, duration: isSpeaking ? 1.2 : 3 }}
            className="relative cursor-pointer flex items-center justify-center h-full max-h-[42vh] sm:max-h-[340px] min-h-[180px] w-full"
            onClick={() => {
              soundFx.playPop();
              speakReadyReply('귀쫑긋! 네 이야기를 듣고 있어! 또 말해줘! 🌟');
            }}
          >
            <img
              src={characterImage}
              alt="레디"
              referrerPolicy="no-referrer"
              className="h-full max-h-[38vh] sm:max-h-[320px] w-auto max-w-[78vw] sm:max-w-[320px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] translate-y-1"
            />
          </motion.div>
        </div>

        {/* Bottom Microphone Control Section */}
        <div className="w-full flex flex-col items-center gap-1.5 shrink-0 pb-3 pt-1">
          {/* Mic button */}
          <div className="flex items-center justify-center gap-6 w-full">
            {/* Center Mic Button Wrapper with White Wave Animation */}
            <div className="relative flex items-center justify-center">
              {isListening && (
                <>
                  <motion.span
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: [1, 1.45, 1.75], opacity: [0.8, 0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut' }}
                    className="absolute w-18 h-18 rounded-full bg-white/80 pointer-events-none shadow-sm"
                  />
                  <motion.span
                    initial={{ scale: 1, opacity: 0.9 }}
                    animate={{ scale: [1, 1.35, 1.6], opacity: [0.9, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, delay: 0.5, ease: 'easeOut' }}
                    className="absolute w-18 h-18 rounded-full border-4 border-white/90 pointer-events-none shadow-xs"
                  />
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={toggleListening}
                className="relative z-10 w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-[#2DD4BF] hover:bg-[#26B8A5] text-white shadow-[0_8px_24px_rgba(45,212,191,0.4)] transition-all cursor-pointer border-2 border-white/30"
              >
                <Mic className={`w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2] ${isListening ? 'animate-bounce' : ''}`} />
              </motion.button>
            </div>
          </div>

          {/* Pill Note Badge: "눌러서 말해보자!" */}
          <div className="px-5 py-1.5 rounded-full bg-[#FFEAE0]/90 border border-orange-100 shadow-2xs">
            <span
              className="text-[#6E2207] text-[17px] sm:text-[19px] font-black tracking-tight"
              style={{ fontFamily: "'Jua', sans-serif" }}
            >
              {isListening ? '듣고 있어요! 말해봐요...' : '눌러서 말해보자!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
