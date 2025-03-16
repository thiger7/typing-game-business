// src/app/api/ranking/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  // ランキング情報を取得
  const { data, error } = await supabaseAdmin
    .from("rankings")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching rankings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  // POSTの場合はサービスロールキーを使用
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    // リクエストボディを取得
    const body = await request.json();
    const { nickname, score, accuracy, typingSpeed } = body;
    
    const { data, error } = await supabaseAdmin
      .from("rankings")
      .insert([{ 
        nickname, 
        score, 
        accuracy, 
        typingSpeed,
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error("Error inserting ranking:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
