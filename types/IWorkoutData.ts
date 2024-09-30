export default interface IWorkoutData {
    data: Datum[];
    links: Links;
    meta: Meta;
  }
  
  export interface Meta {
    current_page: number;
    from: number;
    path: string;
    per_page: number;
    to: number;
  }
  
  export interface Links {
    first: string;
    last?: any;
    prev?: any;
    next: string;
  }
  
  export interface Datum {
    id: string;
    trainer_id: string;
    trainer_name: string;
    type: string;
    status: string;
    name: string;
    description: string;
    difficulty: number;
    is_favorite: boolean;
    total_duration: number;
    approved_at: string;
    published_at: string;
    created_at: string;
    updated_at: string;
    user: User;
    video_cover: Videocover;
    routines: Routine[];
    model?: string;
  }
  
  export interface Routine {
    id: string;
    exercise_id: string;
    set_id: string;
    position: number;
    name: string;
    repetitions: number;
    duration: number;
    rest?: number;
    created_at: string;
    updated_at: string;
    video: Videocover;
  }
  
  export interface Videocover {
    id: string;
    user_id: string;
    name: string;
    duration: number;
    size: number;
    thumbnail_url: string;
    playlist_url: string;
    orientation: string;
    aspect_ratio: string;
    attempts: number;
    attempts_exhausted: boolean;
    converted_percentage: number;
    converted_at: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string;
    profile_photo_url: string;
    about?: string;
    country: string;
    gender: string;
    unit: string;
    weight: number;
    age: number;
    height: number;
    roles: string[];
    permissions: string[];
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
    nickname?: string;
    city?: string;
  }