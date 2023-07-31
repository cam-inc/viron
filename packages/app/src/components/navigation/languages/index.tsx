import classNames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import CheckCircleIcon from '~/components/icon/checkCircle/solid';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import LanguageIcon from '~/components/icon/language/outline';
import { useTranslation, useI18n } from '~/hooks/i18n';
import Popover, { usePopover } from '~/portals/popover';

type Props = BaseProps;
const Languages: React.FC<Props> = ({ className = '', on }) => {
  const { t } = useTranslation();
  const { languages, changeLanguage, language: currentLanguage } = useI18n();
  const menuPopover = usePopover<HTMLButtonElement>();

  return (
    <>
      <div className={classNames(className, 'flex gap-2')}>
        <button
          ref={menuPopover.targetRef}
          className="flex items-center text-sm gap-2"
          onClick={menuPopover.open}
        >
          <LanguageIcon className="w-[1.42em] h-[1.42em]" />
          {t(`language.${currentLanguage}`)}
          <ChevronDownIcon className="w-em" />
        </button>
      </div>
      <Popover.renewal {...menuPopover.bind}>
        <ul className="flex flex-col gap-2 min-w-[108px]">
          {languages.map((language) => (
            <li key={language}>
              <button
                className={`h-6 w-full flex items-center px-1 hover:underline focus:outline-none active:text-thm-on-${on}-low focus:ring-2 focus:ring-thm-on-${on}`}
                onClick={() => changeLanguage(language)}
              >
                <CheckCircleIcon
                  className={classNames('w-4 mr-2', {
                    [`text-thm-on-${on}-faint`]: language !== currentLanguage,
                  })}
                />
                {t(`language.${language}`)}
              </button>
            </li>
          ))}
        </ul>
      </Popover.renewal>
    </>
  );
};

export default Languages;
