import React, { createContext, useEffect, useState } from 'react';
import { AppLoader } from '@app/components/app/loader';
import { IUserData } from '@app/types/bruker';
import { user } from '@app/user';

interface Props {
  children: React.ReactNode;
}

interface StaticData {
  user: IUserData;
}

export const StaticDataContext = createContext<StaticData>({
  user: {
    navIdent: '',
    navn: '',
    roller: [],
    enheter: [],
    ansattEnhet: { id: '', navn: '', lovligeYtelser: [] },
  },
});

export const StaticDataLoader = ({ children }: Props) => {
  const [userData, setUserData] = useState<IUserData | null>(null);

  useEffect(() => {
    user.then(setUserData);
  }, []);

  if (userData === null) {
    return <AppLoader text="Laster bruker..." />;
  }

  return (
    <StaticDataContext.Provider
      value={{
        user: userData,
      }}
    >
      {children}
    </StaticDataContext.Provider>
  );
};
