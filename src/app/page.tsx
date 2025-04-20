import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/client";
import CreatorList from "@/components/features/CreatorList";

export const metadata: Metadata = {
  title: "유튜버 비즈니스 이메일 디렉토리",
  description: "유튜버들의 비즈니스 이메일 정보를 제공하는 디렉토리입니다.",
};

export const revalidate = 3600; // 1시간마다 재검증

async function getCreators() {
  const supabase = createServerSupabaseClient();

  const { data: creators } = await supabase
    .from("creators")
    .select("*")
    .order("subscriber_count", { ascending: false });

  return creators || [];
}

export default async function HomePage() {
  const creators = await getCreators();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        유튜버 비즈니스 이메일 디렉토리
      </h1>
      <CreatorList creators={creators} />
    </main>
  );
}
