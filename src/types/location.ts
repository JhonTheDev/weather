export interface Location {
  id: string;
  user_id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  is_favorite: boolean;
  created_at: string;
  tz_id: string;
  localtime: string;
}