// Backend Profile types (matching the C# contracts)
export interface Profile {
  guid: string;
  name: string;
  email: string;
  nickname: string;
  pictureUrl?: string;
  aboutMe?: string;
  activityScore: number;
}

export interface CreateProfileRequest {
  name: string;
  email: string;
  nickname: string;
  pictureUrl?: string;
  aboutMe?: string;
  activityScore: number;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  nickname: string;
  pictureUrl?: string;
  aboutMe?: string;
  activityScore: number;
}

export interface GetProfileResponse {
  guid: string;
  name: string;
  email: string;
  nickname: string;
  pictureUrl?: string;
  aboutMe?: string;
  activityScore: number;
}