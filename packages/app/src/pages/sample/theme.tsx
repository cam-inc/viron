import classnames from 'classnames';
import { PageProps } from 'gatsby';
import React from 'react';
import useTheme from '$hooks/theme';
import { constructFakeDocument } from '$utils/oas';

type Props = PageProps;
const ThemePage: React.FC<Props> = () => {
  const document = constructFakeDocument({
    info: {
      title: 'fake document',
      version: '0.0.0',
      'x-pages': [],
      'x-theme': 'lime',
    },
  });
  useTheme(document);

  return (
    <div className="bg-background-l dark:bg-background-d">
      {/* app bar */}
      <div className="bg-primary-variant-l dark:bg-primary-variant-d p-4">
        <div className="text-on-primary-variant-l dark:text-on-primary-variant-d">
          primary variant
        </div>
        <div className="text-on-primary-variant-high-l dark:text-on-primary-variant-high-d">
          primary variant high
        </div>
        <div className="text-on-primary-variant-medium-l dark:text-on-primary-variant-medium-d">
          primary variant medium
        </div>
        <div className="text-on-primary-variant-disabled-l dark:text-on-primary-variant-disabled-d">
          primary variant disabled
        </div>
      </div>
      {/* header */}
      <div className="bg-primary-l dark:bg-primary-d p-4">
        <div className="text-on-primary-l dark:text-on-primary-d">primary</div>
        <div className="text-on-primary-high-l dark:text-on-primary-high-d">
          primary high
        </div>
        <div className="text-on-primary-medium-l dark:text-on-primary-medium-d">
          primary medium
        </div>
        <div className="text-on-primary-disabled-l dark:text-on-primary-disabled-d">
          primary disabled
        </div>
      </div>
      <div className="p-8">
        <div className="text-on-background-l dark:text-on-background-d mb-2 ">
          on background
        </div>
        <div className="text-on-background-high-l dark:text-on-background-high-d mb-2 ">
          on background high
        </div>
        <div className="text-on-background-medium-l dark:text-on-background-medium-d mb-2 ">
          on background medium
        </div>
        <div className="text-on-background-disabled-l dark:text-on-background-disabled-d mb-2 ">
          on background disabled
        </div>
        <div className="text-on-background-variant-l dark:text-on-background-variant-d mb-2 ">
          on background variant
        </div>
        <div className="text-on-background-variant-high-l dark:text-on-background-variant-high-d mb-2 ">
          on background variant high
        </div>
        <div className="text-on-background-variant-medium-l dark:text-on-background-variant-medium-d mb-2 ">
          on background variant medium
        </div>
        <div className="text-on-background-variant-disabled-l dark:text-on-background-variant-disabled-d mb-2 ">
          on background variant disabled
        </div>
        <ul>
          {['00', '01', '02', '03', '04', '06', '08', '12', '16', '24'].map(
            function (depth) {
              return (
                <li
                  className={classnames(
                    'shadow-04dp rounded p-4 mb-4 last:mb-0',
                    {
                      'bg-surface-00dp-l': depth === '00',
                      'dark:bg-surface-00dp-d': depth === '00',
                      'bg-surface-01dp-l': depth === '01',
                      'dark:bg-surface-01dp-d': depth === '01',
                      'bg-surface-02dp-l': depth === '02',
                      'dark:bg-surface-02dp-d': depth === '02',
                      'bg-surface-03dp-l': depth === '03',
                      'dark:bg-surface-03dp-d': depth === '03',
                      'bg-surface-04dp-l': depth === '04',
                      'dark:bg-surface-04dp-d': depth === '04',
                      'bg-surface-06dp-l': depth === '06',
                      'dark:bg-surface-06dp-d': depth === '06',
                      'bg-surface-08dp-l': depth === '08',
                      'dark:bg-surface-08dp-d': depth === '08',
                      'bg-surface-12dp-l': depth === '12',
                      'dark:bg-surface-12dp-d': depth === '12',
                      'bg-surface-16dp-l': depth === '16',
                      'dark:bg-surface-16dp-d': depth === '16',
                      'bg-surface-24dp-l': depth === '24',
                      'dark:bg-surface-24dp-d': depth === '24',
                    }
                  )}
                  key={depth}
                >
                  <div className="text-on-surface-l dark:text-on-surface-d mb-2 ">
                    on surface
                  </div>
                  <div className="text-on-surface-high-l dark:text-on-surface-high-d mb-2 ">
                    on surface high
                  </div>
                  <div className="text-on-surface-medium-l dark:text-on-surface-medium-d mb-2 ">
                    on surface medium
                  </div>
                  <div className="text-on-surface-disabled-l dark:text-on-surface-disabled-d mb-2 ">
                    on surface disabled
                  </div>
                  <div className="bg-error-l dark:bg-error-d p-2 rounded mb-2">
                    <div className="text-on-error-l dark:text-on-error-d">
                      on error
                    </div>
                    <div className="text-on-error-high-l dark:text-on-error-high-d">
                      on error high
                    </div>
                    <div className="text-on-error-medium-l dark:text-on-error-medium-d">
                      on error medium
                    </div>
                    <div className="text-on-error-disabled-l dark:text-on-error-disabled-d">
                      on error disabled
                    </div>
                  </div>
                  {/* shadows */}
                  <div className="bg-surface-04dp-l dark:bg-surface-04dp-d mb-4 w-24 h-24 rounded-sm" />
                  <div className="bg-surface-04dp-l dark:bg-surface-04dp-d shadow-00dp mb-4 w-24 h-24 rounded-sm" />
                  <div className="bg-surface-04dp-l dark:bg-surface-04dp-d shadow-01dp mb-4 w-24 h-24 rounded-sm" />
                  <div className="bg-surface-04dp-l dark:bg-surface-04dp-d shadow-02dp mb-4 w-24 h-24 rounded-sm" />
                  <div className="bg-surface-04dp-l dark:bg-surface-04dp-d shadow-03dp mb-4 w-24 h-24 rounded-sm" />
                  <div className="bg-surface-04dp-l dark:bg-surface-04dp-d shadow-04dp mb-4 w-24 h-24 rounded-sm" />
                  <div className="bg-surface-04dp-l dark:bg-surface-04dp-d shadow-06dp mb-4 w-24 h-24 rounded-sm" />
                </li>
              );
            }
          )}
        </ul>
      </div>
      {/* footer */}
      <div className="bg-secondary-l dark:bg-secondary-d p-4">
        <div className="text-on-secondary-l dark:text-on-secondary-d">
          secondary
        </div>
        <div className="text-on-secondary-high-l dark:text-on-secondary-high-d">
          secondary high
        </div>
        <div className="text-on-secondary-medium-l dark:text-on-secondary-medium-d">
          secondary medium
        </div>
        <div className="text-on-secondary-disabled-l dark:text-on-secondary-disabled-d">
          secondary disabled
        </div>
      </div>
      {/* footer small */}
      <div className="bg-secondary-variant-l dark:bg-secondary-variant-d p-4">
        <div className="text-on-secondary-variant-l dark:text-on-secondary-variant-d">
          secondary variant
        </div>
        <div className="text-on-secondary-variant-high-l dark:text-on-secondary-variant-high-d">
          secondary variant high
        </div>
        <div className="text-on-secondary-variant-medium-l dark:text-on-secondary-variant-medium-d">
          secondary variant medium
        </div>
        <div className="text-on-secondary-variant-disabled-l dark:text-on-secondary-variant-disabled-d">
          secondary variant disabled
        </div>
      </div>
    </div>
  );
};
export default ThemePage;
