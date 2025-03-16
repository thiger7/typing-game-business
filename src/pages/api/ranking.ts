import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../app/services/supabaseClient";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // サーバーサイドでのみアクセス可能
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // ランキング情報を取得
    const { data, error } = await supabaseAdmin.from("rankings").select("*").order("score", { ascending: false }).limit(10);

    if (error) {
      console.error("Error fetching rankings:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } else if (req.method === "POST") {
    // ランキング情報を登録
    const { nickname, score, accuracy, typingSpeed } = req.body;
    console.log("Received data:", { nickname, score, accuracy, typingSpeed });
    // 管理者クライアントを使用してデータを挿入
    const { data, error } = await supabaseAdmin.from("rankings").insert([{ nickname, score, accuracy, typingSpeed }]);
    if (error) {
      console.error("Error inserting ranking:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
