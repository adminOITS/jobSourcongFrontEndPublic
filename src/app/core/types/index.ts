export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'fr';
}
export type RoleAction = {
  key: string;
  label: string;
  icon: string;
  iconColor: string;
  can: () => boolean;
  action: () => void;
  show?: boolean;
};
export interface ContactUsRequest {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  agreeToTerms: boolean;
}

export interface SubItem {
  label: string;
  route: string;
  icon: string;
}

export interface SidebarItem {
  label: string;
  icon: string;
  route?: string;
  subItems?: SubItem[];
}

export interface SearchRequest {
  sortBy?: string | string[];
  direction: string;
  first: number;
  rows: number;
}

export interface Column {
  field: string;
  header: string;
  visible: boolean;
}

export interface Currency {
  name: string;
  code: string;
  symbol: string;
  locale: string;
}
export interface PipelineColumnHeader {
  key: string;
  label: string;
  count: number;
  icon: string;
  visible: boolean;
}

export interface StatusStyle {
  background: string;
  text: string;
}
export interface StatsCardData {
  title: string;
  value: number;
  icon: string;
  iconColor: string;
  bgColor: string;
  textColor?: string;

  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
}
