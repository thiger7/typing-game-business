import { RankingEntry, RegisterRankingRequest } from "../types";

const API_URL = "/api/ranking";

export const getRankings = async (): Promise<RankingEntry[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("ランキングデータの取得に失敗しました");
  }
  return response.json();
};

export const registerRanking = async (data: RegisterRankingRequest): Promise<RankingEntry> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response from server:", errorText);
    throw new Error("ランキング登録に失敗しました");
  }
  return response.json();
};
