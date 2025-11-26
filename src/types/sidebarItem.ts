export interface ISidebarItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  isButton?: boolean;
}
