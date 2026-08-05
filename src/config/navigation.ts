import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Settings,
  FolderOpen,
  HelpCircle,
  Layers,
  GraduationCap,
  Briefcase,
  Users,
  FileText,
  Award,
  StickyNote,
  Sparkles,
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
    title: 'Academic',
    href: '/academic',
    icon: GraduationCap,
    children: [
      {
        title: 'Semesters',
        href: '/academic/semesters',
        icon: Layers,
      },
      {
        title: 'Timetable',
        href: '/academic/timetable',
        icon: Calendar,
      },
      {
        title: 'Courses',
        href: '/academic/courses',
        icon: BookOpen,
      },
      {
        title: 'Assignments',
        href: '/academic/assignments',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Learning',
    href: '/learning',
    icon: Sparkles,
    children: [
      {
        title: 'Short Courses',
        href: '/learning/short-courses',
        icon: BookOpen,
      },
      {
        title: 'Projects',
        href: '/learning/projects',
        icon: Briefcase,
      },
      {
        title: 'Certificates',
        href: '/learning/certificates',
        icon: Award,
      },
      {
        title: 'Notes',
        href: '/learning/notes',
        icon: StickyNote,
      },
    ],
  },
  {
    title: 'Organizations',
    href: '/organizations',
    icon: Users,
    children: [
      {
        title: 'Workspaces',
        href: '/organizations/workspaces',
        icon: FolderOpen,
      },
      {
        title: 'Files',
        href: '/organizations/files',
        icon: FileText,
      },
    ],
  },
];

export const bottomNavItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Help',
    href: '/help',
    icon: HelpCircle,
  },
];