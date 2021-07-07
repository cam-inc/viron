export const ON = {
  BACKGROUND: 'background',
  SURFACE: 'surface',
  PRIMARY: 'primary',
  COMPLEMENTARY: 'complementary',
} as const;
export type On = typeof ON[keyof typeof ON];

export const URL = {
  DOCUMENTATION: 'https://viron.app/TODO/documentation/',
  BLOG: 'https://viron.app/TODO/blog/',
  RELEASE_NOTES: 'https://viron.app/TODO/release_notes/',
  HELP: 'https://viron.app/TODO/help/',
  TERMS_OF_USE: 'https://viron.app/TODO/terms/',
  PRIVACY_POLICY: 'https://viron.app/TODO/privacy_policy/',
  GITHUB: 'https://github.com/cam-inc/viron/',
  TWITTER: 'https://twitter.com/TODO',
} as const;
export type Url = typeof URL[keyof typeof URL];
