import { CheckmarkIcon, CogRotationIcon } from '@navikt/aksel-icons';
import { Button, InternalHeader } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { css, styled } from 'styled-components';
import { VersionChecker } from './version-checker';

export const VersionCheckerStatus = () => {
  const [needsUpdate, setNeedsUpdate] = useState(false);

  useEffect(() => {
    if (process.env.VERSION === 'dev') {
      return;
    }

    const versionChecker = new VersionChecker(setNeedsUpdate);

    return () => versionChecker.close();
  }, []);

  if (!needsUpdate) {
    return <Version />;
  }

  return (
    <InternalHeader.Button
      as={UpdateButton}
      title="Det finnes en ny versjon av Kabin. Versjonen du ser på nå er ikke siste versjon. Trykk her for å laste siste versjon."
      onClick={() => window.location.reload()}
      size="small"
      data-testid="update-kabin-button"
    >
      <CogRotationIcon /> Oppdater til siste versjon
    </InternalHeader.Button>
  );
};

const Version = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => setShow(false), 20_000);
  }, [setShow]);

  if (!show) {
    return null;
  }

  return (
    <div>
      <IconText>
        <CheckmarkIcon /> Kabin er klar til bruk!
      </IconText>
    </div>
  );
};

const iconText = css`
  display: flex;
  gap: 8px;
  align-items: center;
  white-space: nowrap;
`;

const IconText = styled.span`
  ${iconText}
  color: #fff;
`;

const UpdateButton = styled(Button)`
  ${iconText}
  border-left: none;
`;
