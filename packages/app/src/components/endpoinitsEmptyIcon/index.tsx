import classNames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';

type Props = BaseProps;
const EndpointsEmptyIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={classNames(className, 'fill-current')}
      viewBox="0 0 183 153"
    >
      <path d="M167.4 28.9C168.1 29.3 168.9 29 169.3 28.3L173.4 20.7C173.8 20 173.5 19.2 172.8 18.8C172.1 18.4 171.3 18.7 170.9 19.4L166.8 27C166.4 27.7 166.7 28.5 167.4 28.9Z" />
      <path d="M164.4 31.5L163 34.1C162.6 34.8 162.9 35.7 163.6 36C164.3 36.4 165.1 36.1 165.5 35.4L166.9 32.8C167.3 32.1 167 31.2 166.3 30.9C165.6 30.6 164.8 30.8 164.4 31.5Z" />
      <path d="M182 24.2C181.4 23.7 180.5 23.7 180 24.2L178.1 26.2C178 26.3 177.9 26.4 177.9 26.5C177.6 27 177.7 27.7 178.2 28.2C178.8 28.7 179.7 28.7 180.2 28.2L182.1 26.2C182.5 25.7 182.5 24.8 182 24.2Z" />
      <path d="M174.7 29.6L168.3 36.1C168.2 36.2 168.1 36.3 168.1 36.4C167.8 36.9 167.9 37.6 168.4 38.1C169 38.6 169.9 38.6 170.4 38.1L176.8 31.6C177.3 31 177.3 30.1 176.8 29.6C176.2 29 175.3 29 174.7 29.6Z" />
      <path d="M162.5 18.6C163.3 18.8 164 18.3 164.2 17.6L164.6 15.9C164.8 15.1 164.3 14.4 163.6 14.2C163 14 162.3 14.3 162 14.9C161.9 15 161.9 15.1 161.9 15.2L161.5 16.9C161.3 17.7 161.7 18.4 162.5 18.6Z" />
      <path d="M158.8 33.1C159.6 33.3 160.3 32.8 160.5 32.1L162.9 22.4C163.1 21.6 162.6 20.9 161.9 20.7C161.3 20.5 160.6 20.8 160.3 21.4C160.2 21.5 160.2 21.6 160.2 21.7L157.8 31.4C157.6 32.1 158.1 32.9 158.8 33.1Z" />
      <path d="M17.1 11.1C17.1 9.79999 16.1 8.79999 14.8 8.79999C13.5 8.79999 12.5 9.79999 12.5 11.1C12.5 12.4 13.5 13.4 14.8 13.4C16.1 13.4 17.1 12.4 17.1 11.1Z" />
      <path d="M24.1 13.4C25.4 13.4 26.4 12.4 26.4 11.1C26.4 9.79999 25.4 8.79999 24.1 8.79999C22.8 8.79999 21.8 9.79999 21.8 11.1C21.7 12.4 22.8 13.4 24.1 13.4Z" />
      <path d="M33.3 13.4C34.6 13.4 35.6 12.4 35.6 11.1C35.6 9.79999 34.6 8.79999 33.3 8.79999C32 8.79999 31 9.79999 31 11.1C31 12.4 32 13.4 33.3 13.4Z" />
      <path d="M9.29997 26.7C8.39997 26.7 7.59998 27.5 7.59998 28.4V29C7.59998 29.9 8.39997 30.7 9.29997 30.7C10.2 30.7 11 29.9 11 29V28.4C11 27.4 10.3 26.7 9.29997 26.7Z" />
      <path d="M9.29997 32.9C8.39997 32.9 7.59998 33.7 7.59998 34.6V60.7C7.59998 61.6 8.39997 62.4 9.29997 62.4C10.2 62.4 11 61.6 11 60.7V34.6C11 33.7 10.3 32.9 9.29997 32.9Z" />
      <path d="M17.5 89.9H69.6C70.5 89.9 71.3001 89.1 71.3001 88.2C71.3001 87.3 70.5 86.5 69.6 86.5H17.5C16.6 86.5 15.8 87.3 15.8 88.2C15.8 89.1 16.6 89.9 17.5 89.9Z" />
      <path d="M174.6 59.5C169.4 43.7 154.9 33.7 139.2 33.4V13.1C139.2 5.9 133.4 0 126.2 0H13C5.8 0 0 5.8 0 13.1V105C0 112.2 5.8 118.1 13 118.1H126.2C131.9 118.1 136.7 114.4 138.5 109.3C138.6 109.3 138.6 109.3 138.7 109.3C140.9 109.3 143.1 109.1 145.3 108.7L145.8 110.1L143.6 110.8C143 111 142.6 111.4 142.3 111.9C142 112.4 142 113 142.2 113.6L152.5 145.2C153.3 147.7 155.1 149.8 157.4 151C158.8 151.7 160.3 152.1 161.9 152.1C162.9 152.1 164 151.9 165 151.6C170.2 149.9 173 144.3 171.3 139.1L160.9 107.5C160.5 106.3 159.2 105.7 158.1 106.1L155.9 106.8L155.5 105.4C172.2 97 180.5 77.5 174.6 59.5ZM48.1 3.4H126.2C131.5 3.4 135.8 7.8 135.8 13.1V18.7H48.1V3.4ZM126.2 114.6H13C7.7 114.6 3.4 110.2 3.4 104.9V22.1H13C13.9 22.1 14.7 21.3 14.7 20.4C14.7 19.5 13.9 18.7 13 18.7H3.4V13.1C3.4 7.8 7.7 3.4 13 3.4H44.7V18.7H24.9C24 18.7 23.2 19.5 23.2 20.4C23.2 21.3 24 22.1 24.9 22.1H135.8V33.5C132.8 33.7 129.8 34.3 126.8 35.3C125.9 35.6 125 35.9 124.1 36.3V30.1C124.1 29.2 123.3 28.4 122.4 28.4H16.7C15.8 28.4 15 29.2 15 30.1V78.3C15 79.2 15.8 80 16.7 80H101.9C102.1 81.1 102.4 82.1 102.8 83.1C104.3 87.7 106.6 91.7 109.5 95.3H17.5C16.6 95.3 15.8 96.1 15.8 97C15.8 97.9 16.6 98.7 17.5 98.7H112.6C114.6 100.7 116.9 102.4 119.3 103.8H17.5C16.6 103.8 15.8 104.6 15.8 105.5C15.8 106.4 16.6 107.2 17.5 107.2H121.7C122.5 107.2 123.1 106.7 123.3 105.9C126.9 107.5 130.8 108.6 134.8 109C133.3 112.3 130 114.6 126.2 114.6ZM65.4 54.2L18.4 75.6V32.8L65.4 54.2ZM24.6 31.8H114.7L69.7 52.3L24.6 31.8ZM69.6 56.1L100.9 70.3C100.8 72.4 101 74.5 101.3 76.6H24.6L69.6 56.1ZM101.1 66.7L73.7 54.2L120.8 32.8V37.9C109.9 43.8 102.6 54.6 101.1 66.7ZM161.3 123.3L166.9 140.3C167.8 143.1 166.3 146.1 163.5 147.1C160.7 148 157.6 146.5 156.7 143.7L151.1 126.7L161.3 123.3ZM159.7 118.2L160 119.1L149.8 122.5L149.5 121.6L159.7 118.2ZM157.3 111L158.3 114L148.1 117.4L147.1 114.4L157.3 111ZM149.6 107.6C149.9 107.5 150.1 107.4 150.4 107.3C150.7 107.2 150.9 107.1 151.2 107L151.5 108L149.9 108.5L149.6 107.6ZM149 103.1C140.6 105.9 131.5 105.2 123.6 101.1C115.6 97.1 109.7 90.2 107 81.7C104.2 73.2 104.9 64.2 108.9 56.2C112.9 48.2 119.8 42.3 128.2 39.5C131.6 38.4 135.1 37.8 138.6 37.8C142.2 37.8 145.7 38.4 149.1 39.5C150.6 40 152.1 40.6 153.5 41.4C161.5 45.4 167.4 52.3 170.2 60.8C176 78.4 166.5 97.3 149 103.1Z" />
      <path d="M144.7 48.8C144.8 48.8 144.8 48.9 144.9 48.9C145.3 49 145.7 49.1 146.1 49.3C146.7 49.5 147.4 49.2 147.6 48.5C147.8 47.9 147.5 47.2 146.8 47C146.4 46.9 146 46.7 145.5 46.6C144.9 46.4 144.2 46.8 144 47.4C143.9 48 144.1 48.6 144.7 48.8Z" />
      <path d="M115.7 59.8C115.4 60.4 115.6 61.1 116.2 61.4C116.8 61.7 117.5 61.5 117.8 60.9C122 52.5 130.8 47.5 140.2 48.1C140.9 48.1 141.4 47.6 141.5 47C141.5 46.3 141 45.8 140.4 45.7C130.1 45 120.4 50.6 115.7 59.8Z" />
      <path d="M167.9 61.7C163 46.9 148 38.1 132.8 41.1C132.2 41.2 131.7 41.9 131.8 42.5C131.9 43.2 132.6 43.6 133.2 43.5C138 42.6 142.9 42.9 147.6 44.4C148.9 44.8 150.2 45.4 151.4 46C158.1 49.4 163.2 55.4 165.6 62.5C170.5 77.4 162.3 93.5 147.5 98.4C140.4 100.8 132.6 100.2 125.8 96.8C119.1 93.4 114 87.4 111.7 80.3C107.3 66.9 113.5 52.4 125.6 46.2C126.1 45.9 126.4 45.3 126.2 44.7C126 44.1 125.3 43.8 124.6 44C124.6 44 124.5 44 124.5 44.1C111.3 50.9 104.6 66.6 109.4 81.1C111.9 88.9 117.4 95.3 124.7 99C132 102.7 140.4 103.3 148.2 100.8C164.3 95.3 173.1 77.9 167.9 61.7Z" />
    </svg>
  );
};

export default EndpointsEmptyIcon;