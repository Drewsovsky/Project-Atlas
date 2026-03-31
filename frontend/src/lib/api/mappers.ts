import type { User } from '@/types/user';
import type { Profile, CreateProfileRequest, UpdateProfileRequest } from '@/types/profile';

// Convert backend Profile to frontend User
export function profileToUser(profile: Profile): User {
  return {
    id: profile.guid,
    name: profile.name,
    username: profile.nickname,
    email: profile.email,
    avatar: profile.pictureUrl || '/avatars/default.jpg',
    bio: profile.aboutMe || '',
    links: [],
    rating: profile.activityScore,
    role: 'user',
    banned: false,
    createdAt: new Date().toISOString(),
  };
}

// Convert frontend User to backend Profile format
export function userToProfile(user: User, email?: string): Profile {
  return {
    guid: user.id,
    name: user.name,
    email: email || `${user.username}@example.com`, // Fallback email if not provided
    nickname: user.username,
    pictureUrl: user.avatar !== '/avatars/default.jpg' ? user.avatar : undefined,
    aboutMe: user.bio || undefined,
    activityScore: user.rating,
  };
}

// Convert frontend User data to CreateProfileRequest
export function userToCreateProfileRequest(
  user: Partial<User> & { name: string; username: string },
  email: string
): CreateProfileRequest {
  return {
    name: user.name,
    email: email,
    nickname: user.username,
    pictureUrl: user.avatar && user.avatar !== '/avatars/default.jpg' ? user.avatar : undefined,
    aboutMe: user.bio || undefined,
    activityScore: user.rating || 0,
  };
}

// Convert frontend User data to UpdateProfileRequest
export function userToUpdateProfileRequest(
  user: User,
  email?: string
): UpdateProfileRequest {
  return {
    name: user.name,
    email: email || `${user.username}@example.com`, // Use existing email or fallback
    nickname: user.username,
    pictureUrl: user.avatar !== '/avatars/default.jpg' ? user.avatar : undefined,
    aboutMe: user.bio || undefined,
    activityScore: user.rating,
  };
}