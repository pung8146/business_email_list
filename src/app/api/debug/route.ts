import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // DB 구조 정보 가져오기
    const { data: tableInfo, error: tableError } = await supabase
      .from("creators")
      .select("*")
      .limit(0);

    if (tableError) {
      return NextResponse.json(
        {
          error: "테이블 정보 조회 실패",
          details: tableError,
        },
        { status: 500 }
      );
    }

    // 환경 변수 확인 (민감 정보는 마스킹)
    const envInfo = {
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY ? "설정됨" : "미설정",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "설정됨"
        : "미설정",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "설정됨"
        : "미설정",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? "설정됨"
        : "미설정",
    };

    return NextResponse.json({
      message: "디버그 정보",
      tableColumns: tableInfo ? Object.keys(tableInfo) : [],
      environmentVariables: envInfo,
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      {
        error: "디버그 엔드포인트 오류",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
