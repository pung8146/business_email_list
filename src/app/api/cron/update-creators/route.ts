import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";
import { getChannelInfo } from "@/lib/youtube/client";

export const runtime = "edge";

export async function GET(request: Request) {
  // 토큰 검증
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const supabase = createServerSupabaseClient();

    // 기존 크리에이터 목록 조회
    const { data: creators } = await supabase
      .from("creators")
      .select("channel_id");

    if (!creators) {
      return NextResponse.json({ error: "No creators found" }, { status: 404 });
    }

    // 각 크리에이터 정보 업데이트
    const updates = await Promise.all(
      creators.map(async (creator) => {
        const channelInfo = await getChannelInfo(creator.channel_id);

        if (!channelInfo) {
          return null;
        }

        return supabase
          .from("creators")
          .update({
            channel_title: channelInfo.title,

            subscriber_count: channelInfo.subscriberCount,
            video_count: channelInfo.videoCount,
            channel_description: channelInfo.description,
            profile_image_url: channelInfo.profileImageUrl,
            last_updated: new Date().toISOString(),
          })
          .eq("channel_id", creator.channel_id);
      })
    );

    return NextResponse.json({
      message: "Update completed",
      updated: updates.filter(Boolean).length,
    });
  } catch (error) {
    console.error("Error updating creators:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
