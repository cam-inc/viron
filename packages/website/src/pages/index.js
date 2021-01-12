import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'フロントレス',
    imageUrl: 'img/frontend.png',
    description: (
      <>
        HTML、CSS、JavaScript等のフロント用ソースコードを記述する必要はありません。APIサーバのみを用意して下さい。
      </>
    ),
  },
  {
    title: 'OAS駆動',
    imageUrl: 'img/oas.png',
    description: (
      <>
        OpenAPI Specification 3.0に準拠。
      </>
    ),
  },
  {
    title: '無料/オープンソース',
    imageUrl: 'img/oss.png',
    description: (
      <>
        GitHub上でオープンソースとして公開されています。誰でも無料で使用できます。
      </>
    ),
  },
  {
    title: 'デスクトップアプリ提供',
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Chrome アプリを提供
      </>
    ),
  },
  {
    title: 'レスポンシブデザイン',
    imageUrl: 'img/responsive.png',
    description: (
      <>
        デスクトップ端末とモバイル端末上で画面サイズに応じたレイアウトが設定されます。
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  const description = 'All you do is just create a API server and a OAS2.0 json file. Then viron admin tool is ready to use. You don\'t need to write frontend code!';
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={`${description}`}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <p className="hero__subtitle">{description}</p>
          <div className={styles.buttons}>
          <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
