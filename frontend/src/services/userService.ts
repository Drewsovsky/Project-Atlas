import { apiClient, API_ENDPOINTS } from '@/lib/api/client';
import type { User } from '@/types/user';
import type { Profile, CreateProfileRequest } from '@/types/profile';
import { 
  profileToUser,
  userToUpdateProfileRequest 
} from '@/lib/api/mappers';
import { users } from '@/lib/dummy-data/users'; // Fallback for missing functionality

export type UserProfilePatch = {
  name: string;
  bio: string;
  links: string[];
};

export type NewUserData = {
  nickname: string;
  name: string;
  email: string;
  pictureUrl?: string;
  aboutMe?: string;
  activityScore?: number;
};

type UserService = {
  getUsers: () => Promise<User[]>;
  getUserById: (id: string) => Promise<User | undefined>;
  getUserByUsername: (username: string) => Promise<User | undefined>;
  getUserByEmail: (email: string) => Promise<User | undefined>;
  createUser: (userData: NewUserData) => Promise<User>;
  updateUserProfile: (
    id: string,
    patch: UserProfilePatch,
  ) => Promise<User | undefined>;
  updateUserRating: (id: string, rating: number) => Promise<User | undefined>;
  setUserBanStatus: (id: string, banned: boolean) => Promise<User | undefined>;
};

// Local storage for frontend-only data until backend supports it
const getStoredUserData = (id: string): { links?: string[], role?: 'user' | 'admin', banned?: boolean } | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(`atlas-user-extras-${id}`);
  return stored ? JSON.parse(stored) : null;
};

const storeUserData = (id: string, extras: { links?: string[], role?: 'user' | 'admin', banned?: boolean }) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`atlas-user-extras-${id}`, JSON.stringify(extras));
};

// Get all users (backend + fallback to dummy data)
const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<Profile[]>(API_ENDPOINTS.profiles.list);
    const backendUsers = response.data.map(profile => {
      const user = profileToUser(profile);
      const extras = getStoredUserData(user.id);
      return extras ? { ...user, ...extras } : user;
    });
    
    // TODO: Remove fallback when backend has all users
    return backendUsers.length > 0 ? backendUsers : [...users];
  } catch (error: any) {
    console.warn('Failed to fetch users from backend, using dummy data:', error);
    return [...users];
  }
};

// Get user by ID
const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    const response = await apiClient.get<Profile>(API_ENDPOINTS.profiles.get(id));
    const user = profileToUser(response.data);
    const extras = getStoredUserData(user.id);
    return extras ? { ...user, ...extras } : user;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return undefined;
    }
    console.warn('Failed to fetch user from backend, checking dummy data:', error);
    // Fallback to dummy data
    return users.find(user => user.id === id);
  }
};

// Get user by username (using nickname field)
const getUserByUsername = async (username: string): Promise<User | undefined> => {
  try {
    // Backend doesn't have a username endpoint, so get all and filter
    // TODO: Add getUserByNickname endpoint to backend
    const allUsers = await getUsers();
    return allUsers.find(user => user.username === username);
  } catch (error: any) {
    console.warn('Failed to fetch user by username:', error);
    return users.find(user => user.username === username);
  }
};

// Get user by email
const getUserByEmail = async (email: string): Promise<User | undefined> => {
  try {
    const allUsers = await getUsers();
    return allUsers.find(u => u.email === email);
  } catch {
    return undefined;
  }
};

// Create new user
const createUser = async (userData: NewUserData): Promise<User> => {
  try {
    const profileData: CreateProfileRequest = {
      name: userData.name,
      email: userData.email,
      nickname: userData.nickname,
      pictureUrl: userData.pictureUrl,
      aboutMe: userData.aboutMe,
      activityScore: userData.activityScore ?? 0,
    };
    const response = await apiClient.post<Profile>(API_ENDPOINTS.profiles.create, profileData);
    
    const user = profileToUser(response.data);
    storeUserData(user.id, { role: 'user', banned: false });
    
    return { ...user, role: 'user', banned: false };
  } catch (error: any) {
    console.error('Failed to create user in backend:', error);
    throw error;
  }
};

// Update user profile
const updateUserProfile = async (
  id: string,
  patch: UserProfilePatch,
): Promise<User | undefined> => {
  try {
    // Get current user to maintain other fields
    const currentUser = await getUserById(id);
    if (!currentUser) return undefined;
    
    // Create updated user data
    const updatedUser: User = {
      ...currentUser,
      name: patch.name,
      bio: patch.bio,
      links: patch.links,
    };
    
    // Update backend profile
    const profileData = userToUpdateProfileRequest(updatedUser);
    await apiClient.put(API_ENDPOINTS.profiles.update(id), profileData);
    
    // Update local storage for frontend-only fields
    const extras = getStoredUserData(id) || {};
    storeUserData(id, { ...extras, links: patch.links });
    
    return updatedUser;
  } catch (error: any) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

// Update user rating (maps to activityScore)
const updateUserRating = async (
  id: string,
  rating: number,
): Promise<User | undefined> => {
  if (!Number.isFinite(rating) || rating < 0) {
    throw new Error('Rating must be a non-negative number.');
  }

  try {
    const currentUser = await getUserById(id);
    if (!currentUser) return undefined;
    
    const updatedUser: User = {
      ...currentUser,
      rating: Math.round(rating),
    };
    
    const profileData = userToUpdateProfileRequest(updatedUser);
    await apiClient.put(API_ENDPOINTS.profiles.update(id), profileData);
    
    return updatedUser;
  } catch (error: any) {
    console.error('Failed to update user rating:', error);
    throw error;
  }
};

// Set user ban status (local only for now)
const setUserBanStatus = async (
  id: string,
  banned: boolean,
): Promise<User | undefined> => {
  try {
    const currentUser = await getUserById(id);
    if (!currentUser) return undefined;
    
    // Store ban status locally since backend doesn't support it yet
    const extras = getStoredUserData(id) || {};
    storeUserData(id, { ...extras, banned });
    
    return { ...currentUser, banned };
  } catch (error: any) {
    console.error('Failed to update user ban status:', error);
    throw error;
  }
};

export const userService: UserService = {
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUserProfile,
  updateUserRating,
  setUserBanStatus,
};
