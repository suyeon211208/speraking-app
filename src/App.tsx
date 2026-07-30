import React, { useState } from 'react';
import { MainScreen } from './components/MainScreen';
import { TopicSelectionScreen } from './components/TopicSelectionScreen';
import { SpeakingMode } from './components/SpeakingMode';
import { MyStoryScreen } from './components/MyStoryScreen';
import { AppScreen, TopicOption, StoryRecord } from './types';

const DEFAULT_STORIES: StoryRecord[] = [
  {
    id: '1',
    topicTag: '학교 이야기',
    topicTagBg: '#E6F4EA',
    topicTagColor: '#137333',
    title: '오늘 학교에서 재밌었던 것!',
    dateText: '오늘',
    emoji: '🏫',
    thumbnailBg: 'from-[#FFD8C2] to-[#FFAB91]',
    createdAt: Date.now() - 3600000,
  },
  {
    id: '2',
    topicTag: '좋아하는 동물',
    topicTagBg: '#FCE8E6',
    topicTagColor: '#C5221F',
    title: '내가 좋아하는 동물 친구들',
    dateText: '어제',
    emoji: '🦁',
    thumbnailBg: 'from-[#A7F3D0] to-[#6EE7B7]',
    createdAt: Date.now() - 86400000,
  },
  {
    id: '3',
    topicTag: '주말에 한 일',
    topicTagBg: '#FEF3D6',
    topicTagColor: '#B06000',
    title: '신나는 우리 가족 주말 이야기',
    dateText: '2일 전',
    emoji: '🧺',
    thumbnailBg: 'from-[#FEF08A] to-[#FDE047]',
    createdAt: Date.now() - 172800000,
  },
  {
    id: '4',
    topicTag: '상상 나라',
    topicTagBg: '#F3E8FF',
    topicTagColor: '#7E22CE',
    title: '마법 나라로 여행을 갔어요!',
    dateText: '3일 전',
    emoji: '🏰',
    thumbnailBg: 'from-[#E9D5FF] to-[#C084FC]',
    createdAt: Date.now() - 259200000,
  },
];

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('mystory');
  const [selectedTopic, setSelectedTopic] = useState<TopicOption | null>(null);
  const [stories, setStories] = useState<StoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('my_stories_records');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STORIES;
  });

  const handleSaveStory = (newStory: StoryRecord) => {
    setStories((prev) => {
      const updated = [newStory, ...prev];
      try {
        localStorage.setItem('my_stories_records', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleSelectTopicAndStart = (topic: TopicOption) => {
    setSelectedTopic(topic);
    setScreen('speaking');
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#FFFDF5] font-sans overflow-hidden">
      {screen === 'main' && (
        <MainScreen onStartSpeaking={() => setScreen('topics')} />
      )}

      {screen === 'topics' && (
        <TopicSelectionScreen
          onSelectTopicAndStart={handleSelectTopicAndStart}
          onBackToMain={() => setScreen('main')}
          onGoMyStory={() => setScreen('mystory')}
        />
      )}

      {screen === 'speaking' && (
        <SpeakingMode
          initialTopic={selectedTopic || undefined}
          onChangeTopic={() => setScreen('topics')}
          onBackToMain={() => setScreen('main')}
          onCompleteStory={handleSaveStory}
        />
      )}

      {screen === 'mystory' && (
        <MyStoryScreen
          stories={stories}
          onBack={() => setScreen('topics')}
          onGoHome={() => setScreen('main')}
          onStartSpeaking={() => setScreen('topics')}
        />
      )}
    </div>
  );
}


