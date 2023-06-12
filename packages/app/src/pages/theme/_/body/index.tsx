import React, { useCallback, useMemo, useState } from 'react';
import AcademicCapIcon from '~/components/icon/academicCap/outline';
import ArrowCircleDownIcon from '~/components/icon/arrowCircleDown/outline';
import ArrowCircleUpIcon from '~/components/icon/arrowCircleUp/outline';
import BarsOutLineIcon from '~/components/icon/bars/outline';
import BookOpenIcon from '~/components/icon/bookOpen/outline';
import BulbOutlineIcon from '~/components/icon/bulb/outline';
import BulbSolidIcon from '~/components/icon/bulb/solid';
import CheckCircleIcon from '~/components/icon/checkCircle/outline';
import ChevronDoubleLeftIcon from '~/components/icon/chevronDoubleLeft/outline';
import ChevronDoubleRightIcon from '~/components/icon/chevronDoubleRight/outline';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronLeftIcon from '~/components/icon/chevronLeft/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import ChevronUpIcon from '~/components/icon/chevronUp/outline';
import ClipboardCopyIcon from '~/components/icon/clipboardCopy/outline';
import CollectionIcon from '~/components/icon/collection/solid';
import ColorSwatchIcon from '~/components/icon/colorSwatch/outline';
import DocumentTextIcon from '~/components/icon/documentText/outline';
import DotsCircleHorizontalIcon from '~/components/icon/dotsCircleHorizontal/outline';
import DotsVerticalIcon from '~/components/icon/dotsVertical/outline';
import EmojiSadIcon from '~/components/icon/emojiSad/outline';
import ExclamationIcon from '~/components/icon/exclamation/outline';
import ExternalLinkIcon from '~/components/icon/externalLink/outline';
import FilterOutlineIcon from '~/components/icon/filter/outline';
import FilterSolidIcon from '~/components/icon/filter/solid';
import FolderIcon from '~/components/icon/folder/outline';
import FolderOpenIcon from '~/components/icon/folderOpen/outline';
import GithubIcon from '~/components/icon/github/solid';
import HomeOutlineIcon from '~/components/icon/home/outline';
import HomeSolidIcon from '~/components/icon/home/solid';
import InformationCircleIcon from '~/components/icon/informationCircle/outline';
import LoginIcon from '~/components/icon/login/outline';
import LogoutIcon from '~/components/icon/logout/outline';
import MenuAlt1Icon from '~/components/icon/menuAlt1/outline';
import MinusIcon from '~/components/icon/minus/outline';
import MinusCircleIcon from '~/components/icon/minusCircle/outline';
import MinusSmIcon from '~/components/icon/minusSm/outline';
import PencilIcon from '~/components/icon/pencil/outline';
import PhoneIcon from '~/components/icon/phone/outline';
import PlusIcon from '~/components/icon/plus/outline';
import PlusCircleIcon from '~/components/icon/plusCircle/outline';
import PlusSmIcon from '~/components/icon/plusSm/outline';
import QrcodeIcon from '~/components/icon/qrcode/outline';
import RefreshIcon from '~/components/icon/refresh/outline';
import SadIcon from '~/components/icon/sad/outline';
import SearchIcon from '~/components/icon/search/outline';
import SearchCircleIcon from '~/components/icon/searchCircle/outline';
import ServerIcon from '~/components/icon/server/outline';
import ShareIcon from '~/components/icon/share/outline';
import TagIcon from '~/components/icon/tag/outline';
import TerminalIcon from '~/components/icon/terminal/outline';
import TrashIcon from '~/components/icon/trash/outline';
import TwitterIcon from '~/components/icon/twitter/solid';
import UserGroupIcon from '~/components/icon/userGroup/outline';
import ViewListIcon from '~/components/icon/viewList/outline';
import XCircleIcon from '~/components/icon/xCircle/outline';
import { Props as LayoutProps } from '~/layouts';
import { Theme, THEME } from '~/types/oas';
import { getTokens, Tokens } from '~/utils/colorSystem';
import Mode from './mode';
import Preview from './preview';
import ThemeSelect, { Props as ThemeSelectProps } from './themeSelect';
import Tones from './tones';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className = '' }) => {
  // Theme
  const [theme, setTheme] = useState<Theme>(THEME.RED);
  const handleThemeRequestChange = useCallback<
    ThemeSelectProps['onRequestChange']
  >((theme) => {
    setTheme(theme);
  }, []);

  // tokens
  const tokens = useMemo<Tokens>(() => getTokens(theme), [theme]);

  return (
    <div className={className}>
      <div className="p-4">
        {/* theme selection */}
        <div className="mb-2">
          <ThemeSelect
            theme={theme}
            onRequestChange={handleThemeRequestChange}
          />
        </div>
        <div>
          <Preview tokens={tokens} />
        </div>
        <div>
          <div>Modes</div>
          <ul className="flex flex-col gap-2">
            <li>
              <Mode title="Light Mode" mode={tokens.modes.light} />
            </li>
            <li>
              <Mode title="Dark Mode" mode={tokens.modes.dark} />
            </li>
          </ul>
        </div>
        <div>
          <div>Tonal Palettes</div>
          <ul className="flex flex-col gap-2">
            <li>
              <Tones
                title="Primary"
                list={tokens.tonalPalettes.keyColors.accent.primary}
              />
            </li>
            <li>
              <Tones
                title="Secondary"
                list={tokens.tonalPalettes.keyColors.accent.secondary}
              />
            </li>
            <li>
              <Tones
                title="Tertiary"
                list={tokens.tonalPalettes.keyColors.accent.tertiary}
              />
            </li>
            <li>
              <Tones
                title="Error"
                list={tokens.tonalPalettes.additionalColors.error.base}
              />
            </li>
            <li>
              <Tones
                title="Neutral"
                list={tokens.tonalPalettes.keyColors.neutral.base}
              />
            </li>
            <li>
              <Tones
                title="Neutral Variant"
                list={tokens.tonalPalettes.keyColors.neutral.variant}
              />
            </li>
          </ul>
        </div>
        <section>
          <h1>Icons</h1>
          <div className="grid grid-cols-12">
            <AcademicCapIcon />
            <ArrowCircleDownIcon />
            <ArrowCircleUpIcon />
            <BookOpenIcon />
            <BulbSolidIcon />
            <BulbOutlineIcon />
            <BarsOutLineIcon />
            <CheckCircleIcon />
            <ChevronDoubleLeftIcon />
            <ChevronDoubleRightIcon />
            <ChevronDownIcon />
            <ChevronLeftIcon />
            <ChevronRightIcon />
            <ChevronUpIcon />
            <ClipboardCopyIcon />
            <CollectionIcon />
            <ColorSwatchIcon />
            <DocumentTextIcon />
            <DotsCircleHorizontalIcon />
            <DotsVerticalIcon />
            <EmojiSadIcon />
            <ExclamationIcon />
            <ExternalLinkIcon />
            <FilterOutlineIcon />
            <FilterSolidIcon />
            <FolderIcon />
            <FolderOpenIcon />
            <GithubIcon />
            <HomeOutlineIcon />
            <HomeSolidIcon />
            <InformationCircleIcon />
            <LoginIcon />
            <LogoutIcon />
            <MenuAlt1Icon />
            <MinusIcon />
            <MinusCircleIcon />
            <MinusSmIcon />
            <PencilIcon />
            <PhoneIcon />
            <PlusIcon />
            <PlusCircleIcon />
            <PlusSmIcon />
            <QrcodeIcon />
            <RefreshIcon />
            <SadIcon />
            <SearchIcon />
            <SearchCircleIcon />
            <ServerIcon />
            <ShareIcon />
            <TagIcon />
            <TerminalIcon />
            <TrashIcon />
            <TwitterIcon />
            <UserGroupIcon />
            <ViewListIcon />
            <XCircleIcon />
          </div>
        </section>
      </div>
    </div>
  );
};
export default Body;
