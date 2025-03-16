import { RankingEntry, RegisterRankingRequest } from '../types';

// ローカルストレージのキー
const RANKING_KEY = 'typing_game_ranking';

// ランキングデータを取得する
export const getRankings = (): RankingEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const data = localStorage.getItem(RANKING_KEY);
    if (!data) return [];
    
    const rankings = JSON.parse(data) as RankingEntry[];
    return rankings;
  } catch (error) {
    console.error('ランキングデータの取得に失敗しました:', error);
    return [];
  }
};

// ランキングに新しいスコアを登録する
export const registerRanking = async (data: RegisterRankingRequest): Promise<RankingEntry> => {
  if (typeof window === 'undefined') {
    throw new Error('ブラウザ環境でのみ利用可能です');
  }
  
  // 現在のランキングを取得
  const currentRankings = getRankings();
  
  // 新しいランキングエントリを作成
  const newEntry: RankingEntry = {
    id: generateId(),
    nickname: data.nickname,
    score: data.score,
    accuracy: data.accuracy,
    typingSpeed: data.typingSpeed,
    date: new Date().toISOString(),
  };
  
  // ランキングに追加して保存
  const updatedRankings = [...currentRankings, newEntry];
  
  // スコアの降順でソート
  updatedRankings.sort((a, b) => b.score - a.score);
  
  // 最大100件までに制限
  const limitedRankings = updatedRankings.slice(0, 100);
  
  // ローカルストレージに保存
  localStorage.setItem(RANKING_KEY, JSON.stringify(limitedRankings));
  
  return newEntry;
};

// ランキングデータを初期化する (開発用)
export const clearRankings = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(RANKING_KEY);
};

// ユニークIDを生成するヘルパー関数
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};