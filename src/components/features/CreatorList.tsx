import Image from "next/image";
import { Creator } from "@/types/database";

interface CreatorListProps {
  creators: Creator[];
}

export default function CreatorList({ creators }: CreatorListProps) {
  if (!creators || creators.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative w-24 h-24 mb-6">
          <Image
            src="/images/empty-state.svg"
            alt="데이터 없음"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          등록된 크리에이터가 없습니다
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          아직 등록된 유튜버가 없습니다. 나중에 다시 확인해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <div
          key={creator.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16">
              <Image
                src={creator.profile_image_url}
                alt={creator.channel_title}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{creator.channel_title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                구독자 {formatNumber(creator.subscriber_count)}명
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {creator.channel_description}
            </p>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              마지막 업데이트: {formatDate(creator.last_updated)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}천만`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만`;
  }
  return num.toLocaleString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
