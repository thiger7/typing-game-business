import { useCallback, useEffect, useRef, useState } from "react";

import { words } from "../data/words";
import { GameState, TypeStats, Word } from "../types";

// ゲーム関連の定数
const DEFAULT_TIME_LIMIT = 103; // 100秒制限
const COMBO_THRESHOLD = 5; // コンボボーナスの閾値

export const useTypingGame = (timeLimit = DEFAULT_TIME_LIMIT) => {
  // ゲームの状態を管理
  const [gameState, setGameState] = useState<GameState>({
    currentWord: { japanese: "", roman: "" },
    userInput: "",
    mistakeCount: 0,
    questionsRemaining: 0,
    questionLimit: 0,
    timeLeft: timeLimit,
    wordTimeLimit: 0,
    wordTimeLeft: 0,
    score: 0,
    isGameStarted: false,
    isGameOver: false,
    lastMistakeChar: "",
  });

  // タイプ統計データ
  const [typeStats, setTypeStats] = useState<TypeStats>({
    totalTyped: 0,
    correctTyped: 0,
    mistakeTyped: 0,
    combo: 0,
    maxCombo: 0,
    startTime: null,
    wordsCompleted: 0,
    accuracy: 100,
    typingSpeed: 0,
    detailedScores: {
      baseScore: 0,
      comboBonus: 0,
      speedBonus: 0,
      accuracyBonus: 0,
      completionBonus: 0,
    },
  });

  // タイマー参照
  const timerRef = useRef<number | null>(null);

  // 単語ごとの制限時間を更新するインターバル
  const wordTimerIntervalRef = useRef<number | null>(null);

  // 音声ファイルの読み込み
  const typeSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const comboSoundRef = useRef<HTMLAudioElement | null>(null);

  // 音声ファイルを初期化
  useEffect(() => {
    // クライアントサイドでのみ実行されるようにする
    if (typeof window !== "undefined") {
      typeSoundRef.current = new Audio("/audio/typing-sound.mp3");
      wrongSoundRef.current = new Audio("/audio/wrong.mp3");
      correctSoundRef.current = new Audio("/audio/correct.mp3");

      // ボリュームの設定
      if (wrongSoundRef.current) {
        wrongSoundRef.current.volume = 0.3;
      }
      if (comboSoundRef.current) {
        comboSoundRef.current.volume = 0.5;
      }
    }

    return () => {
      // クリーンアップ
      typeSoundRef.current = null;
      wrongSoundRef.current = null;
      correctSoundRef.current = null;
      comboSoundRef.current = null;
    };
  }, []);

  // 音を再生する関数
  const playSound = useCallback((sound: "type" | "wrong" | "correct" | "combo") => {
    // クライアントサイドでのみ実行されるようにする
    if (typeof window === "undefined") return;

    let audio: HTMLAudioElement | null = null;
    switch (sound) {
      case "type":
        audio = typeSoundRef.current;
        break;
      case "wrong":
        audio = wrongSoundRef.current;
        break;
      case "correct":
        audio = correctSoundRef.current;
        break;
      case "combo":
        audio = comboSoundRef.current;
        break;
    }
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.error("音声の再生に失敗しました", e));
    }
  }, []);

  // ランダムな単語を取得する関数
  const getRandomWord = useCallback((wordList: Word[]): Word => {
    return wordList[Math.floor(Math.random() * wordList.length)];
  }, []);

  // 単語ごとの制限時間を計算する関数
  const calculateWordTimeLimit = useCallback((word: string): number => {
    // 基本的に1文字あたり baseTime 秒、最低 minTime 秒
    const baseTime = 1.5; // 1文字あたりの時間（秒）
    const minTime = 3; // 最低時間（秒）
    return Math.max(word.length * baseTime, minTime);
  }, []);

  // 単語タイマーを開始する関数
  const startWordTimer = useCallback(() => {
    // 既存のタイマーをクリア
    if (wordTimerIntervalRef.current && typeof window !== "undefined") {
      clearInterval(wordTimerIntervalRef.current);
      wordTimerIntervalRef.current = null;
    }

    // 単語の長さに基づいて制限時間を計算
    const wordTimeLimit = calculateWordTimeLimit(gameState.currentWord.roman);

    // 初期状態を設定
    setGameState((prev) => ({
      ...prev,
      wordTimeLimit,
      wordTimeLeft: wordTimeLimit,
    }));

    // クライアントサイドでのみ実行されるようにする
    if (typeof window !== "undefined") {
      // タイマーを開始（100msごとに更新）
      wordTimerIntervalRef.current = window.setInterval(() => {
        setGameState((prev) => {
          // 残り時間を更新
          const newWordTimeLeft = Math.max(0, prev.wordTimeLeft - 0.1);

          // 時間切れの場合
          if (newWordTimeLeft <= 0) {
            // タイマーをクリア
            if (wordTimerIntervalRef.current && typeof window !== "undefined") {
              clearInterval(wordTimerIntervalRef.current);
              wordTimerIntervalRef.current = null;
            }

            // 間違い音を鳴らす
            playSound("wrong");

            // 次の問題を表示
            setTimeout(() => {
              setGameState((state) => ({
                ...state,
                currentWord: getRandomWord(words),
                userInput: "",
                mistakeCount: 0,
                lastMistakeChar: "",
              }));
            }, 500);

            // タイプ統計を更新（タイムアウトによるミスとしてカウント）
            setTypeStats((stats) => ({
              ...stats,
              totalTyped: stats.totalTyped + 1,
              mistakeTyped: stats.mistakeTyped + 1,
              combo: 0, // コンボをリセット
              accuracy: Math.round((stats.correctTyped / (stats.totalTyped + 1)) * 100),
            }));
          }

          return {
            ...prev,
            wordTimeLeft: newWordTimeLeft,
          };
        });
      }, 100);
    }

    return wordTimeLimit;
  }, [calculateWordTimeLimit, gameState.currentWord.roman, getRandomWord, playSound]);

  // 新しい単語を表示する関数
  const displayNewWord = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentWord: getRandomWord(words),
      userInput: "",
      mistakeCount: 0,
      lastMistakeChar: "",
    }));
  }, [getRandomWord]);

  // 最終スコアを計算する関数
  const calculateFinalScore = useCallback(() => {
    setTypeStats((prev) => {
      // タイピングスピードを計算（1分あたりの文字数）
      const endTime = new Date();
      const elapsedMinutes = prev.startTime ? (endTime.getTime() - prev.startTime.getTime()) / 60000 : 1;
      const typingSpeed = Math.round(prev.totalTyped / elapsedMinutes);
      // 正確率を計算
      const accuracy = prev.totalTyped > 0 ? Math.round((prev.correctTyped / prev.totalTyped) * 100) : 100;
      // 基本スコアは正確にタイプした文字数
      const baseScore = prev.correctTyped;
      // コンボボーナス（最大コンボ数に応じて）
      const comboBonus = Math.floor(prev.maxCombo / 10) * 100;
      // スピードボーナス（タイピング速度に応じて）
      const speedBonus = Math.floor(typingSpeed / 50) * 200;
      // 正確性ボーナス（正確率に応じて）
      const accuracyBonus = Math.floor(accuracy / 10) * 100;
      // 完走ボーナスは削除（常に0）
      const completionBonus = 0;
      // 最終スコアを計算
      const totalScore = baseScore + comboBonus + speedBonus + accuracyBonus + completionBonus;
      // ゲーム状態の更新
      setGameState((gs) => ({
        ...gs,
        score: totalScore,
      }));
      return {
        ...prev,
        typingSpeed,
        accuracy,
        detailedScores: {
          baseScore,
          comboBonus,
          speedBonus,
          accuracyBonus,
          completionBonus,
        },
      };
    });
  }, []);

  // タイマーを更新する関数
  const updateTimer = useCallback(() => {
    setGameState((prev) => {
      const newTimeLeft = prev.timeLeft - 1;
      // 時間切れの場合はゲーム終了
      if (newTimeLeft <= 0) {
        // タイマーをクリア
        if (timerRef.current && typeof window !== "undefined") {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // 単語タイマーもクリア
        if (wordTimerIntervalRef.current && typeof window !== "undefined") {
          clearInterval(wordTimerIntervalRef.current);
          wordTimerIntervalRef.current = null;
        }
        // 最終スコアを計算
        calculateFinalScore();
        return {
          ...prev,
          timeLeft: 0,
          isGameStarted: false,
          isGameOver: true,
        };
      }
      return {
        ...prev,
        timeLeft: newTimeLeft,
      };
    });
  }, [calculateFinalScore]);

  // ゲームを開始する関数
  const startGame = useCallback(() => {
    // タイプ統計をリセット
    setTypeStats({
      totalTyped: 0,
      correctTyped: 0,
      mistakeTyped: 0,
      combo: 0,
      maxCombo: 0,
      startTime: new Date(),
      wordsCompleted: 0,
      accuracy: 100,
      typingSpeed: 0,
      detailedScores: {
        baseScore: 0,
        comboBonus: 0,
        speedBonus: 0,
        accuracyBonus: 0,
        completionBonus: 0,
      },
    });
    // ゲーム状態を更新
    setGameState((prev) => ({
      ...prev,
      score: 0,
      timeLeft: timeLimit,
      isGameStarted: true,
      isGameOver: false,
    }));

    // タイマーをスタート
    if (timerRef.current && typeof window !== "undefined") {
      clearInterval(timerRef.current);
    }

    // クライアントサイドでのみsetIntervalを実行する
    if (typeof window !== "undefined") {
      timerRef.current = window.setInterval(updateTimer, 1000);
    }
  }, [timeLimit, updateTimer]);

  // 再チャレンジする関数
  const handleRetry = useCallback(() => {
    // タイマーをクリア
    if (timerRef.current && typeof window !== "undefined") {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 単語タイマーもクリア
    if (wordTimerIntervalRef.current && typeof window !== "undefined") {
      clearInterval(wordTimerIntervalRef.current);
      wordTimerIntervalRef.current = null;
    }
    setGameState((prev) => ({
      ...prev,
      score: 0,
      currentWord: { japanese: "", roman: "" },
      userInput: "",
      mistakeCount: 0,
      timeLeft: timeLimit,
      wordTimeLimit: 0,
      wordTimeLeft: 0,
      isGameStarted: false,
      isGameOver: false,
      lastMistakeChar: "",
    }));
    // タイプ統計もリセット
    setTypeStats({
      totalTyped: 0,
      correctTyped: 0,
      mistakeTyped: 0,
      combo: 0,
      maxCombo: 0,
      startTime: null,
      wordsCompleted: 0,
      accuracy: 100,
      typingSpeed: 0,
      detailedScores: {
        baseScore: 0,
        comboBonus: 0,
        speedBonus: 0,
        accuracyBonus: 0,
        completionBonus: 0,
      },
    });
  }, [timeLimit]);

  // 前回のミス状態を保持して不要な音を鳴らさないようにするための参照
  const prevMistakesRef = useRef<{ [key: number]: boolean }>({});
  const lastCorrectCharRef = useRef<number>(-1);

  // ユーザーの入力を処理する関数
  const handleInputChange = useCallback(
    (value: string) => {
      // 前回の入力値と新しい入力値の差分を取得
      const prevInputLength = gameState.userInput.length;
      const newInput = value.slice(prevInputLength);
      // 新しい文字が入力されていない場合は処理しない
      if (newInput.length === 0) {
        return;
      }
      // 新しい文字が一度に複数入力された場合は、一文字ずつ処理する
      // 最初の一文字だけを処理する
      const newChar = newInput[0];
      // 正しい次の文字かどうかをチェック
      const nextCharIndex = gameState.userInput.length;
      const expectedChar = gameState.currentWord.roman[nextCharIndex];
      // 入力が正しいかどうかのフラグ
      let isCorrectInput = false;

      // 1. 基本のroman文字列と一致するかチェック
      if (expectedChar && newChar === expectedChar) {
        isCorrectInput = true;
      }
      // 2. 代替入力パターンと一致するかチェック
      else if (gameState.currentWord.alternatives && gameState.currentWord.alternatives.length > 0) {
        // 各代替パターンをチェック
        for (const alternative of gameState.currentWord.alternatives) {
          // 代替パターンの長さが十分あるか確認
          if (alternative.length > nextCharIndex) {
            // 代替パターンの対応する位置の文字と一致するか
            if (alternative[nextCharIndex] === newChar) {
              isCorrectInput = true;
              break;
            }
          }
        }
      }
      // 期待される文字と一致するかチェック
      if (isCorrectInput) {
        // 正しい入力の場合：タイプ音を再生
        playSound("type");
        // 正しく入力された文字の最後のインデックスを更新
        lastCorrectCharRef.current = nextCharIndex;
        // タイプ統計を更新
        setTypeStats((prev) => {
          const newCombo = prev.combo + 1;
          const newMaxCombo = Math.max(prev.maxCombo, newCombo);
          return {
            ...prev,
            totalTyped: prev.totalTyped + 1,
            correctTyped: prev.correctTyped + 1,
            combo: newCombo,
            maxCombo: newMaxCombo,
            accuracy: Math.round(((prev.correctTyped + 1) / (prev.totalTyped + 1)) * 100),
          };
        });
        // ゲーム状態を更新（正しい入力のみを反映）
        const newUserInput = gameState.userInput + newChar;
        setGameState((prev) => ({
          ...prev,
          userInput: newUserInput,
          mistakeCount: prev.mistakeCount,
          lastMistakeChar: "",
        }));
        // 単語を完全に入力できたかチェック
        if (newUserInput.length === gameState.currentWord.roman.length) {
          // 正解音を鳴らす
          playSound("correct");
          // 単語タイマーをクリア
          if (wordTimerIntervalRef.current && typeof window !== "undefined") {
            clearInterval(wordTimerIntervalRef.current);
            wordTimerIntervalRef.current = null;
          }
          // 単語完了のステータスを更新
          setTypeStats((prev) => ({
            ...prev,
            wordsCompleted: prev.wordsCompleted + 1,
          }));
          // 次の問題を表示
          setTimeout(() => {
            setGameState((state) => ({
              ...state,
              currentWord: getRandomWord(words),
              userInput: "",
              mistakeCount: 0,
              lastMistakeChar: "",
            }));
            // リファレンスをリセット
            lastCorrectCharRef.current = -1;
            prevMistakesRef.current = {};
          }, 300);
        }
      } else {
        // 間違い音を鳴らす
        playSound("wrong");
        // ミスカウントを増やす
        setGameState((prev) => ({
          ...prev,
          mistakeCount: prev.mistakeCount + 1,
          lastMistakeChar: newChar,
        }));
        // タイプ統計を更新
        setTypeStats((prev) => ({
          ...prev,
          totalTyped: prev.totalTyped + 1,
          mistakeTyped: prev.mistakeTyped + 1,
          combo: 0, // コンボをリセット
          accuracy: Math.round((prev.correctTyped / (prev.totalTyped + 1)) * 100),
        }));
      }
    },
    [gameState.userInput, gameState.currentWord, getRandomWord, playSound],
  );

  // 単語が変わったとき、または最初の単語が表示されたときにタイマーを開始
  useEffect(() => {
    if (gameState.isGameStarted && gameState.currentWord.roman && !gameState.isGameOver) {
      const timeLimit = startWordTimer();
      console.log(`単語「${gameState.currentWord.japanese}」の制限時間: ${timeLimit}秒`);
    }

    return () => {
      // タイマーをクリア
      if (wordTimerIntervalRef.current && typeof window !== "undefined") {
        clearInterval(wordTimerIntervalRef.current);
        wordTimerIntervalRef.current = null;
      }
    };
  }, [gameState.currentWord, gameState.isGameStarted, gameState.isGameOver, startWordTimer]);

  // ゲームが終了または一時停止したときにもタイマーをクリア
  useEffect(() => {
    if (!gameState.isGameStarted || gameState.isGameOver) {
      if (wordTimerIntervalRef.current && typeof window !== "undefined") {
        clearInterval(wordTimerIntervalRef.current);
        wordTimerIntervalRef.current = null;
      }
    }
  }, [gameState.isGameStarted, gameState.isGameOver]);

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (timerRef.current && typeof window !== "undefined") {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (wordTimerIntervalRef.current && typeof window !== "undefined") {
        clearInterval(wordTimerIntervalRef.current);
        wordTimerIntervalRef.current = null;
      }
    };
  }, []);

  // 初回のゲーム開始時に新しい単語を表示
  useEffect(() => {
    if (gameState.isGameStarted && gameState.currentWord.japanese === "") {
      displayNewWord();
    }
  }, [gameState.isGameStarted, gameState.currentWord.japanese, displayNewWord]);

  return {
    gameState,
    typeStats,
    startGame,
    handleInputChange,
    handleRetry,
    displayNewWord,
    calculateFinalScore,
  };
};
