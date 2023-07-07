import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import GithubIcon from '~/components/icon/github/solid';
import TwitterIcon from '~/components/icon/twitter/outline';
import Link from '~/components/link';
import { URL } from '~/constants';
import { useTranslation } from '~/hooks/i18n';
import Popover, { usePopover } from '~/portals/popover';
import { Pathname, URL as _URL } from '~/types';

type ServiceType = {
  i18nKey: string;
  to: Pathname | _URL;
  icon: JSX.Element;
  isComingSoon?: boolean;
};
const services: ServiceType[] = [
  {
    i18nKey: 'service.twitter',
    to: URL.TWITTER,
    icon: <TwitterIcon className="w-5 h-5" />,
    isComingSoon: true,
  },
  {
    i18nKey: 'service.github',
    to: URL.GITHUB,
    icon: <GithubIcon className="w-5 h-5" />,
  },
];

type Props = BaseProps;
const Services: React.FC<Props> & {
  renewal: React.FC<Props>;
} = ({ on }) => {
  return (
    <ul className="flex justify-center gap-2 text-2xl">
      {services.map((service) => (
        <li key={service.to}>
          <Service on={on} service={service} />
        </li>
      ))}
    </ul>
  );
};

const Renewal: React.FC<Props> = ({ on, className }) => {
  return (
    <ul className={className}>
      {services.map((service) => {
        return (
          <li key={service.to}>
            <ServiceRenewal on={on} service={service} />
          </li>
        );
      })}
    </ul>
  );
};

Services.renewal = Renewal;

export default Services;

type ServiceProps = BaseProps & {
  service: ServiceType;
};

const Service: React.FC<ServiceProps> = ({ on, service }) => {
  const popover = usePopover<HTMLButtonElement>();
  const handleButtonClick = useCallback(() => {
    popover.open();
  }, [popover]);

  return (
    <>
      {!service.isComingSoon ? (
        <Link className="block group focus:outline-none" to={service.to}>
          <div
            className={`text-2xl text-thm-on-${on} group-hover:text-thm-on-${on}-low group-active:text-thm-on-${on}-slight group-focus:ring-2 group-focus:ring-thm-on-${on}`}
          >
            {service.icon}
          </div>
        </Link>
      ) : (
        <button
          className="block group focus:outline-none"
          ref={popover.targetRef}
          onClick={handleButtonClick}
        >
          <div
            className={`text-2xl text-thm-on-${on} group-hover:text-thm-on-${on}-low group-active:text-thm-on-${on}-slight group-focus:ring-2 group-focus:ring-thm-on-${on}`}
          >
            {service.icon}
          </div>
        </button>
      )}
      <Popover {...popover.bind}>
        <div>Coming Soon.</div>
      </Popover>
    </>
  );
};

const ServiceRenewal: React.FC<ServiceProps> = ({ on, service }) => {
  const popover = usePopover<HTMLButtonElement>();
  const handleButtonClick = useCallback(() => {
    popover.open();
  }, [popover]);
  const { t } = useTranslation();

  return (
    <>
      {!service.isComingSoon ? (
        <Link
          className={`flex gap-2 text-xs items-center text-thm-on-${on} hover:underline active:text-thm-on-${on}-low focus:outline outline-2 outline-thm-outline`}
          to={service.to}
        >
          {service.icon}
          <span>{t(service.i18nKey)}</span>
        </Link>
      ) : (
        <button
          className={`flex gap-2 text-xs items-center text-thm-on-${on} hover:underline active:text-thm-on-${on}-low focus:outline outline-2 outline-thm-outline`}
          ref={popover.targetRef}
          onClick={handleButtonClick}
        >
          {service.icon}
          <span>{t(service.i18nKey)}</span>
        </button>
      )}
      <Popover {...popover.bind}>
        <div>Coming Soon.</div>
      </Popover>
    </>
  );
};
