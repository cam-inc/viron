import React, { useCallback } from 'react';
import { Props as BaseProps } from '~/components';
import GithubIcon from '~/components/icon/github/solid';
import TwitterIcon from '~/components/icon/twitter/solid';
import Link from '~/components/link';
import { URL } from '~/constants';
import Popover, { usePopover } from '~/portals/popover';
import { Pathname, URL as _URL } from '~/types';

type ServiceType = {
  to: Pathname | _URL;
  icon: JSX.Element;
  isComingSoon?: boolean;
};
const services: ServiceType[] = [
  {
    to: URL.GITHUB,
    icon: <GithubIcon className="w-em" />,
  },
  {
    to: URL.TWITTER,
    icon: <TwitterIcon className="w=em" />,
    isComingSoon: true,
  },
];

type Props = BaseProps;
const Services: React.FC<Props> = ({ on }) => {
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
