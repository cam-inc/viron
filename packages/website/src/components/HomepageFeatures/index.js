import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: translate({
      id: 'cmn.features.01.title',
      message: 'Frontend-NoCode'
    }),
    img: 'feature_nocode.png',
    description: (
      <>
        {translate({
          id: 'cmn.features.01.body',
          message: 'No need to write any frontend-matter codes.'
        })}
      </>
    ),
  },
  {
    title: translate({
      id: 'cmn.features.02.title',
      message: 'Open-Source Software'
    }),
    img: 'feature_oss.png',
    description: (
      <>
        {translate({
          id: 'cmn.features.02.body',
          message: 'Viron is an open-source software, which grants anyone to edit, study, distribute and contribute to it for free.'
        })}
      </>
    ),
  },
  {
    title: translate({
      id: 'cmn.features.03.title',
      message: 'Fine-Tuned User Interface'
    }),
    img: 'feature_ui.png',
    description: (
      <>
        {translate({
          id: 'cmn.features.03.body',
          message: 'Viron works on all modern browsers and offers responsive UI. It also supports light and dark modes with 24+ color themes.'
        })}
      </>
    ),
  },
  {
    title: translate({
      id: 'cmn.features.04.title',
      message: 'OpenAPI Specification-driven'
    }),
    img: 'feature_oas.png',
    description: (
      <>
        {translate({
          id: 'cmn.features.04.body',
          message: 'What a OAS can describe is what Viron can display on a screen. Viron grows as OAS does.'
        })}
      </>
    ),
  },
];

function Feature({img, title, description}) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
      <img className={styles.featureImg} src={useBaseUrl(`img/${img}`)} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
