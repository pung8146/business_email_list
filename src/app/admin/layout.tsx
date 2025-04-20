import { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 페이지 - 유튜버 비즈니스 이메일 디렉토리",
  description: "유튜버 채널을 검색하고 등록하는 관리자 페이지입니다.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
