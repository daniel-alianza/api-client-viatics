import type { LucideIcon } from 'lucide-react';

export interface Interface {
  id: string;
  name: string;
  description: string;
  category: string;
  hasAccess: boolean;
  icon: LucideIcon;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}
