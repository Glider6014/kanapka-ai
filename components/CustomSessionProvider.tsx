'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

type CustomSessionProviderProps = {
  children: ReactNode;
};

const CustomSessionProvider = ({ children }: CustomSessionProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default CustomSessionProvider;
