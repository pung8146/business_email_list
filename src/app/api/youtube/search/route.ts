import { NextResponse } from "next/server";
import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "검색어를 입력해주세요" },
      { status: 400 }
    );
  }

  try {
    const response = await youtube.search.list({
      part: ["snippet"],
      q: query,
      type: ["channel"],
      maxResults: 10,
    });

    const channels =
      response.data.items?.map((item) => ({
        channelId: item.id?.channelId,
        title: item.snippet?.title,
        description: item.snippet?.description,
        thumbnailUrl: item.snippet?.thumbnails?.default?.url,
      })) || [];

    return NextResponse.json({ channels });
  } catch (error) {
    console.error("Error searching YouTube channels:", error);
    return NextResponse.json(
      { error: "채널 검색 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
