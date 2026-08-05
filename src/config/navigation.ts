import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Settings,
  BarChart3,
  MessageSquare,
  FolderOpen,
  HelpCircle,
  Layers, // Tambahkan icon untuk Semesters
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavItem[];
}

export const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Semesters', // Menu baru
    href: '/dashboard/semesters',
    icon: Layers,
  },
  {
    title: 'Timetable',
    href: '/dashboard/timetable',
    icon: Calendar,
  },
  {
    title: 'Courses',
    href: '/dashboard/courses',
    icon: BookOpen,
    badge: 5,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: 3,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: FolderOpen,
    children: [
      {
        title: 'Active Projects',
        href: '/dashboard/projects/active',
        icon: FolderOpen,
      },
      {
        title: 'Archived',
        href: '/dashboard/projects/archived',
        icon: FolderOpen,
      },
    ],
  },
];

export const bottomNavItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Help',
    href: '/dashboard/help',
    icon: HelpCircle,
  },
];