'use client';

import * as React from 'react';
import BaseDrawer from '../molecules/BaseDrawer';

type Props = {
  children: React.ReactNode;
};

const BaseLayout = (props: Props) => {
  const { children } = props;

  return <BaseDrawer>{children}</BaseDrawer>;
};

export default BaseLayout;
