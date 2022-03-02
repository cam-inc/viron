import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  const description = 'All you do is just create a API server and a OAS2.0 json file. Then viron admin tool is ready to use. You don\'t need to write frontend code!';
  return (
    <Layout
      title={`${siteConfig.title}`}
    description={`${description}`}>

      <header className={styles.header}>
      <div className={styles.header__item}>
      <h1 className="hero__title">{siteConfig.title}</h1>
      <p className="hero__subtitle">{translate({
        id: 'cmn.tagline',
        message: 'Magic to turn OAS into GUI.'
      })}</p>
      <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
    to={useBaseUrl('docs/')}>
      {translate({
        message: 'Get Started'
      })}
            </Link>
      </div>
      <div className={styles.header__item}>
      <img src={useBaseUrl('img/viron_kv.png')}/>
      </div>
      </header>

      <main>
        <section className={styles.features}>

    <div className={styles.feature}>
      <div className={styles.feature__body}>
                <h3>{translate({
                  id: 'cmn.features.01.title',
                  message: 'Frontend-NoCode'
                })}</h3>
                <p>{translate({
                 id: 'cmn.features.01.body',
                 message: 'No need to write any frontend-matter codes.'
                })}</p>
      </div>
      <div className={styles.feature__sub}><img src={useBaseUrl('img/feature_nocode.png')} /></div>
      </div>


      <div className={styles.feature}>
      <div className={styles.feature__body}>
                <h3>{translate({
                  id: 'cmn.features.02.title',
                  message: 'Open-Source Software'
                })}</h3>
                <p>{translate({
                 id: 'cmn.features.02.body',
                 message: 'Viron is an open-source software, which grants anyone to edit, study, distribute and contribute to it for free.'
                })}</p>
      </div>
      <div className={styles.feature__sub}><img src={useBaseUrl('img/feature_oss.png')} /></div>
      </div>

      <div className={styles.feature}>
      <div className={styles.feature__body}>
                <h3>{translate({
                  id: 'cmn.features.03.title',
                  message: 'Fine-Tuned User Interface'
                })}</h3>
                <p>{translate({
                 id: 'cmn.features.03.body',
                 message: 'Viron works on all modern browsers and offers responsive UI. It also supports light and dark modes with 24+ color themes.'
                })}</p>
      </div>
      <div className={styles.feature__sub}><img src={useBaseUrl('img/feature_ui.png')} /></div>
      </div>

    <div className={styles.feature}>
      <div className={styles.feature__body}>
                <h3>{translate({
                  id: 'cmn.features.04.title',
                  message: 'OpenAPI Specification-driven'
                })}</h3>
                <p>{translate({
                 id: 'cmn.features.04.body',
                 message: 'What a OAS can describe is what Viron can display on a screen. Viron grows as OAS does.'
                })}</p>
      </div>
      <div className={styles.feature__sub}><img src={useBaseUrl('img/feature_oas.png')} /></div>
      </div>

        </section>
      </main>
    </Layout>
  );
}

export default Home;
