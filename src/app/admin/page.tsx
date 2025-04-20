"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  channelId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        `/api/youtube/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "검색 중 오류가 발생했습니다");
      }

      setSearchResults(data.channels || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "채널 검색 중 오류가 발생했습니다"
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddChannel = async (channelId: string) => {
    try {
      setError(null);
      setSuccessMessage(null);

      const response = await fetch("/api/youtube/add-channel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "채널 등록 중 오류가 발생했습니다");
      }

      setSuccessMessage(data.message || "채널이 성공적으로 등록되었습니다");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "채널 등록 중 오류가 발생했습니다"
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">유튜브 채널 검색</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="채널 이름 검색..."
            className="flex-1 px-4 py-2 border dark:bg-gray-700 dark:border-gray-600 rounded-md"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSearching ? "검색 중..." : "검색"}
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
            {successMessage}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">검색 결과</h3>
            <div className="space-y-4">
              {searchResults.map((channel) => (
                <div
                  key={channel.channelId}
                  className="flex items-center gap-4 p-4 border dark:border-gray-600 rounded-md"
                >
                  {channel.thumbnailUrl && (
                    <img
                      src={channel.thumbnailUrl}
                      alt={channel.title}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{channel.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {channel.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddChannel(channel.channelId)}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                  >
                    추가
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
