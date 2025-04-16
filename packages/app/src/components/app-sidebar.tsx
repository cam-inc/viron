import {
  Home,
  Group,
  FileText,
  Rocket,
  CircleHelp,
  Github,
} from 'lucide-react';
import * as React from 'react';
import { INTERNAL_PAGE_PATHS, URL } from '~/constants';
import { useI18n, useTranslation } from '~/hooks/i18n';
import Link from './link';
import Logo from './logo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  navMain: [
    {
      title: 'internalPagePaths.dashboard',
      to: INTERNAL_PAGE_PATHS.ENDPOINTS,
      icon: Home,
    },
    {
      title: 'internalPagePaths.groups',
      to: INTERNAL_PAGE_PATHS.GROUPS,
      icon: Group,
    },
  ],
  navSecondary: [
    {
      title: 'documentation',
      to: URL.DOCUMENTATION,
      icon: FileText,
    },
    {
      title: 'releaseNotes',
      to: URL.RELEASE_NOTES,
      icon: Rocket,
    },
    {
      title: 'help',
      to: URL.HELP,
      icon: CircleHelp,
    },
    {
      title: 'service.github',
      to: URL.GITHUB,
      icon: Github,
    },
  ],
};

export function AppSidebar() {
  const { t } = useTranslation();
  const { languages, changeLanguage, language: currentLanguage } = useI18n();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="">
              <Link to="/" className="flex items-center gap-1">
                <Logo
                  left="text-thm-on-surface-high"
                  right="text-thm-on-surface"
                />
                <div className="text-xl font-bold">Viron</div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.to}>
                      <item.icon />
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.to}>
                      <item.icon />
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <Select value={currentLanguage} onValueChange={changeLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {t(`language.${language}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
