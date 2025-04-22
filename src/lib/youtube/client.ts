import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export interface YouTubeChannelInfo {
  channelId: string;
  title: string;
  description: string;
  businessEmail: string | null;
  subscriberCount: number;
  videoCount: number;
  profileImageUrl: string;
}

export async function getChannelInfo(
  channelId: string
): Promise<YouTubeChannelInfo | null> {
  try {
    console.log(`Fetching channel info for ID: ${channelId}`);
    const response = await youtube.channels.list({
      part: ["snippet", "statistics"],
      id: [channelId],
    });

    if (!response.data.items?.length) {
      console.log(`No channel found with ID: ${channelId}`);
      return null;
    }

    const channel = response.data.items[0];
    console.log(
      `Channel data received:`,
      JSON.stringify(
        {
          id: channel.id,
          title: channel.snippet?.title,
          description: channel.snippet?.description?.substring(0, 100) + "...",
          stats: channel.statistics,
        },
        null,
        2
      )
    );

    const businessEmail = extractBusinessEmail(
      channel.snippet?.description || ""
    );

    console.log(`Extracted business email: ${businessEmail || "None found"}`);

    return {
      channelId: channel.id!,
      title: channel.snippet?.title || "",
      description: channel.snippet?.description || "",
      businessEmail,
      subscriberCount: parseInt(channel.statistics?.subscriberCount || "0"),
      videoCount: parseInt(channel.statistics?.videoCount || "0"),
      profileImageUrl: channel.snippet?.thumbnails?.default?.url || "",
    };
  } catch (error) {
    console.error("Error fetching channel info:", error);
    return null;
  }
}

function extractBusinessEmail(description: string): string | null {
  console.log(
    `Extracting business email from description (length: ${description.length})`
  );

  // 비즈니스 이메일을 찾기 위한 일반적인 패턴들
  const patterns = [
    /(?:business|business\s+inquiries|business\s+email|contact|email)[\s:]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match?.[1]) {
      console.log(`Found email match with pattern: ${match[1]}`);
      return match[1];
    }
  }

  console.log(`No business email found in description`);
  return null;
}
