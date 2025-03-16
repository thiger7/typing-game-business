export type Word = {
  japanese: string;
  roman: string;
  alternatives?: string[];
};

export type GameState = {
  currentWord: Word;
  userInput: string;
  mistakeCount: number;
  questionsRemaining: number;
  questionLimit: number;
  timeLeft: number;
  score: number;
  isGameStarted: boolean;
  isGameOver: boolean;
  wordTimeLimit: number;
  wordTimeLeft: number;
};

export type GameSettings = {
  questionLimit: number;
};

export type TypeStats = {
  totalTyped: number; // 入力した総文字数
  correctTyped: number; // 正確に入力した文字数
  mistakeTyped: number; // ミスタイプした文字数
  combo: number; // 現在のコンボ数
  maxCombo: number; // 最大コンボ数
  startTime: Date | null; // 開始時間
  wordsCompleted: number; // 完了した単語数
  accuracy: number; // 正確率
  typingSpeed: number; // 1分あたりの入力数
  detailedScores: {
    baseScore: number; // 基本スコア（正しく入力した文字数）
    comboBonus: number; // コンボボーナス
    speedBonus: number; // スピードボーナス
    accuracyBonus: number; // 正確性ボーナス
    completionBonus: number; // 完走ボーナス
  };
};
