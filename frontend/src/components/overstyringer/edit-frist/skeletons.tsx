import { Skeleton } from '@navikt/ds-react';
import React from 'react';
import { Container, TopRow } from '@app/components/overstyringer/edit-frist/styled-components';

export const Skeletons = () => (
  <Container>
    <TopRow>
      <Skeleton variant="rounded" width={171} height={32} />
      <Skeleton variant="rounded" width={60} height={32} />
      <Skeleton variant="rounded" width={176} height={32} />
      <Skeleton variant="rounded" width={125} height={32} />
      <div style={{ flexGrow: 1 }}>
        <Skeleton variant="rounded" width="100%" height={32} />
      </div>
    </TopRow>
  </Container>
);
