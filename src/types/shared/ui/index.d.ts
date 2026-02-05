// Types for shared UI components

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'solana' | 'outline' | 'ghost' | 'link' | 'header' | 'destructive' | null;
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | null;
  asChild?: boolean;
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface SubNavItem {
  href: string;
  title: string;
  method: string;
  description: string;
}

interface SubNavProps {
  items: SubNavItem[];
  className?: string;
}

interface ComparisonItem {
  title: string;
  description: string | React.ReactNode;
}

interface MethodComparisonProps {
  title: string;
  description?: string | React.ReactNode;
  items: ComparisonItem[];
  className?: string;
}

interface LearnMoreBoxProps {
  title?: string;
  links: Array<{
    label: string;
    href: string;
  }>;
  className?: string;
}

interface InfoBoxProps {
  children: React.ReactNode;
  className?: string;
}

interface ThemeToggleProps {
  className?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string | React.ReactNode;
  className?: string;
}

interface HeaderProps {
  className?: string;
}

interface WalletDropdownProps {
  address: string;
  onDisconnect: () => void;
}

interface CodeTabsProps {
  typescript: string;
  curl: string;
  className?: string;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'default' | 'muted' | 'unstyled';
  className?: string;
  children: React.ReactNode;
}

interface ExternalLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
}

interface ConnectButtonProps {
  className?: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
}

interface PageSectionProps {
  title?: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface AddressDisplayProps {
  address: string;
  className?: string;
  truncate?: boolean;
  copyable?: boolean;
}

interface LayoutShellProps {
  children: React.ReactNode;
  className?: string;
}

interface JsonLdProps {
  data: Record<string, unknown>;
}
