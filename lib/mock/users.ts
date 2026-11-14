import type { User } from "@/lib/types";

export const users: User[] = [
  {
    id: "u1",
    username: "akash",
    displayName: "Akash Hossain",
    email: "akash@space.local",
    role: "admin",
    quotaGB: 800,
    usedGB: 164,
    status: "active",
    lastLogin: "Today, 09:42",
    folders: ["movies", "music", "photos", "documents", "downloads"],
  },
  {
    id: "u2",
    username: "nusrat",
    displayName: "Nusrat Jahan",
    email: "nusrat@space.local",
    role: "user",
    quotaGB: 200,
    usedGB: 142.6,
    status: "active",
    lastLogin: "Today, 08:15",
    folders: ["movies", "music", "photos"],
  },
  {
    id: "u3",
    username: "rafi",
    displayName: "Rafi Ahmed",
    email: "rafi@space.local",
    role: "user",
    quotaGB: 150,
    usedGB: 38.2,
    status: "active",
    lastLogin: "Yesterday, 22:30",
    folders: ["movies", "music"],
  },
  {
    id: "u4",
    username: "mim",
    displayName: "Mim Akter",
    email: "mim@space.local",
    role: "user",
    quotaGB: 100,
    usedGB: 96.4,
    status: "active",
    lastLogin: "12 Nov, 19:05",
    folders: ["photos", "documents"],
  },
  {
    id: "u5",
    username: "tanvir",
    displayName: "Tanvir Hasan",
    email: "tanvir@space.local",
    role: "user",
    quotaGB: 50,
    usedGB: 4.1,
    status: "disabled",
    lastLogin: "28 Oct, 14:20",
    folders: ["music"],
  },
];

/** Folders an admin can grant access to when creating a user. */
export const FOLDER_OPTIONS: { id: string; label: string }[] = [
  { id: "movies", label: "Movies & Series" },
  { id: "music", label: "Music" },
  { id: "photos", label: "Public Photos" },
  { id: "documents", label: "Shared Documents" },
  { id: "downloads", label: "Downloads" },
];

/** The two identities used by the "Demo mode" switch. */
export const DEMO_ADMIN = users[0];
export const DEMO_USER = users[1];
