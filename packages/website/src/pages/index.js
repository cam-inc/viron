import useBaseUrl from "@docusaurus/useBaseUrl"
import React from "react"
import Layout from "@theme/Layout"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import styles from "./index.module.css"
import HomepageFeatures from "@site/src/components/HomepageFeatures"

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.inner}>
          <div>
            <img
              className={styles.kv}
              src={useBaseUrl(`img/viron_kv.png`)}
              role="img"
            />
          </div>
          <div>
            <h1 className="hero__title">{siteConfig.title}</h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/introduction"
              >
                Introduction
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function Arts() {
  return (
    <div className={styles.videoArea}>
      <video controls autoPlay src={useBaseUrl(`video/demo.mp4`)} />
    </div>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="All you do is just create a API server and a OAS2.0 json file. Then viron admin tool is ready to use. You don\'t need to write frontend code!"
    >
      <HomepageHeader />
      <main>
        <Arts />
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
