export interface Creator {
  id: string;
  channel_id: string;
  channel_title: string;
  subscriber_count: number;
  video_count: number;
  channel_description: string;
  profile_image_url: string;
  last_updated: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      creators: {
        Row: Creator;
        Insert: Omit<Creator, "id" | "created_at">;
        Update: Partial<Omit<Creator, "id" | "created_at">>;
      };
    };
  };
}
