import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetFeatureToggleQuery } from '@app/redux/api/feature-toggles';
import { useSetMulighetIsBasedOnJournalpostMutation } from '@app/redux/api/registreringer/mutations';
import { SaksTypeEnum } from '@app/types/common';
import { Checkbox } from '@navikt/ds-react';
import type { ChangeEventHandler } from 'react';

export const FraJournalpostToggle = () => {
  const { mulighetIsBasedOnJournalpost, id, typeId } = useRegistrering();
  const [setMulighetBasedOnJournalpost, { isLoading }] = useSetMulighetIsBasedOnJournalpostMutation();
  const { data } = useGetFeatureToggleQuery('mulighet-is-based-on-journalpost');
  const canEdit = useCanEdit();

  const enabled =
    data?.enabled === true || typeId === SaksTypeEnum.OMGJØRINGSKRAV || typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK;

  if (!enabled) {
    return null;
  }

  const onChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    if (mulighetIsBasedOnJournalpost === target.checked) {
      return;
    }

    setMulighetBasedOnJournalpost({ mulighetIsBasedOnJournalpost: target.checked, id });
  };

  return (
    <Checkbox size="small" checked={mulighetIsBasedOnJournalpost} onChange={onChange} disabled={!canEdit || isLoading}>
      Fra journalpost
    </Checkbox>
  );
};
