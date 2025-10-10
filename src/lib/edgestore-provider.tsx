'use client';

import { EdgeStoreProvider } from '@/lib/edgestore'; // <-- Import from our new lib file
import React from 'react';

type Props = {
  children?: React.ReactNode;
};

export const EdgeStoreProviderClient = ({ children }: Props) => {
  return <EdgeStoreProvider>{children}</EdgeStoreProvider>;
};