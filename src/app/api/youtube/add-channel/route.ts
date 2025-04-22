import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";
import { getChannelInfo } from "@/lib/youtube/client";

export async function POST(request: Request) {
  try {
    const { channelId } = await request.json();

    if (!channelId) {
      return NextResponse.json(
        { error: "채널 ID를 입력해주세요" },
        { status: 400 }
      );
    }

    const channelInfo = await getChannelInfo(channelId);

    if (!channelInfo) {
      return NextResponse.json(
        { error: "채널 정보를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 이미 존재하는 채널인지 확인
    const { data: existingChannel } = await supabase
      .from("creators")
      .select("id")
      .eq("channel_id", channelId)
      .single();

    if (existingChannel) {
      return NextResponse.json(
        { error: "이미 등록된 채널입니다" },
        { status: 409 }
      );
    }

    // 새로운 채널 등록
    const insertData = {
      channel_id: channelInfo.channelId,
      channel_title: channelInfo.title,
      business_email: channelInfo.businessEmail,
      subscriber_count: channelInfo.subscriberCount,
      video_count: channelInfo.videoCount,
      channel_description: channelInfo.description,
      profile_image_url: channelInfo.profileImageUrl,
      last_updated: new Date().toISOString(),
    };

    console.log("Trying to insert data:", JSON.stringify(insertData, null, 2));

    const { data, error } = await supabase
      .from("creators")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error adding channel:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: `채널 등록 중 오류가 발생했습니다: ${
            error.message || JSON.stringify(error)
          }`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "채널이 성공적으로 등록되었습니다",
      channel: data,
    });
  } catch (error) {
    console.error(
      "Error in add-channel route:",
      error instanceof Error ? error : JSON.stringify(error, null, 2)
    );
    return NextResponse.json(
      {
        error: `요청 처리 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
      },
      { status: 500 }
    );
  }
}
