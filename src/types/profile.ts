export interface UserProfile {
  username: string; // Herkese açık, benzersiz @kullanıcıadı
  bio: string; // Kullanıcının kendisi hakkında yazdığı yazı
  team: string; // 'pehli1', 'linux' vb.
  profilePictureUrl: string; // EdgeStore'dan gelen resim URL'si
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    other?: Record<string, string>;
  };
  followersCount?: number; // Takipçi sayısı (opsiyonel - API ile doldurulur)
  followingCount?: number; // Takip edilenler sayısı
  // Next-Auth'dan gelen ve değiştirilemeyen veriler
  email: string;
  name: string;
  image: string; // Google'dan gelen varsayılan avatar
}
