import { PageProps } from 'gatsby';
import React from 'react';
import useTheme from '$hooks/theme';

type Props = PageProps;
const SamplePage: React.FC<Props> = () => {
  useTheme();
  return (
    <div className="h-full p-2 bg-background">
      <div className="p-2 bg-background mb-2">
        <div className="text-on-background">on-background</div>
        <div className="text-on-background-high">on-background-high</div>
        <div className="text-on-background-medium">on-background-medium</div>
        <div className="text-on-background-low">on-background-low</div>
        <div className="text-on-background-slight">on-background-slight</div>
        <div className="text-on-background-faint">on-background-faint</div>
      </div>

      <div className="p-2 bg-surface mb-2">
        <div className="text-on-surface">on-surface</div>
        <div className="text-on-surface-high">on-surface-high</div>
        <div className="text-on-surface-medium">on-surface-medium</div>
        <div className="text-on-surface-low">on-surface-low</div>
        <div className="text-on-surface-slight">on-surface-slight</div>
        <div className="text-on-surface-faint">on-surface-faint</div>
      </div>

      <div className="p-2 bg-primary mb-2">
        <div className="text-on-primary">on-primary</div>
        <div className="text-on-primary-high">on-primary-high</div>
        <div className="text-on-primary-medium">on-primary-medium</div>
        <div className="text-on-primary-low">on-primary-low</div>
        <div className="text-on-primary-slight">on-primary-slight</div>
        <div className="text-on-primary-faint">on-primary-faint</div>
      </div>

      <div className="p-2 bg-primary-variant mb-2">
        <div className="text-on-primary-variant">on-primary-variant</div>
        <div className="text-on-primary-variant-high">
          on-primary-variant-high
        </div>
        <div className="text-on-primary-variant-medium">
          on-primary-variant-medium
        </div>
        <div className="text-on-primary-variant-low">
          on-primary-variant-low
        </div>
        <div className="text-on-primary-variant-slight">
          on-primary-variant-slight
        </div>
        <div className="text-on-primary-variant-faint">
          on-primary-variant-faint
        </div>
      </div>

      <div className="p-2 bg-complementary mb-2">
        <div className="text-on-complementary">on-complementary</div>
        <div className="text-on-complementary-high">on-complementary-high</div>
        <div className="text-on-complementary-medium">
          on-complementary-medium
        </div>
        <div className="text-on-complementary-low">on-complementary-low</div>
        <div className="text-on-complementary-slight">
          on-complementary-slight
        </div>
        <div className="text-on-complementary-faint">
          on-complementary-faint
        </div>
      </div>

      <div className="p-2 bg-complementary-variant mb-2">
        <div className="text-on-complementary-variant">
          on-complementary-variant
        </div>
        <div className="text-on-complementary-variant-high">
          on-complementary-variant-high
        </div>
        <div className="text-on-complementary-variant-medium">
          on-complementary-variant-medium
        </div>
        <div className="text-on-complementary-variant-low">
          on-complementary-variant-low
        </div>
        <div className="text-on-complementary-variant-slight">
          on-complementary-variant-slight
        </div>
        <div className="text-on-complementary-variant-faint">
          on-complementary-variant-faint
        </div>
      </div>

      <div className="p-2 bg-error mb-2">
        <div className="text-on-error">on-error</div>
        <div className="text-on-error-high">on-error-high</div>
        <div className="text-on-error-medium">on-error-medium</div>
        <div className="text-on-error-low">on-error-low</div>
        <div className="text-on-error-slight">on-error-slight</div>
        <div className="text-on-error-faint">on-error-faint</div>
      </div>
    </div>
  );
};

export default SamplePage;
