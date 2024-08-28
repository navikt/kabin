import { RemovePartButton } from '@app/components/overstyringer/part-read/remove-part';
import { SearchPartButton } from '@app/components/overstyringer/part-read/search-part-button';
import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import type { EnterSearchModeCallback, ISetPart } from '@app/components/overstyringer/part-read/types';
import { PartActionsContainer } from '@app/components/overstyringer/styled-components';
import type { BaseProps } from '@app/components/overstyringer/types';

export interface ActionsProps extends BaseProps {
  options?: ISetPart[];
  optional?: boolean;
}

export const Actions = ({
  part,
  partField,
  enterSearchMode,
  options = [],
  excludedPartIds = [],
  optional = false,
}: ActionsProps & EnterSearchModeCallback) => (
  <PartActionsContainer>
    {options.reduce<React.ReactNode[]>((list, p) => {
      if (p.defaultPart.id === part?.id || excludedPartIds.includes(p.defaultPart.id)) {
        return list;
      }

      return [...list, <SetPartButton key={p.label} {...p} partField={partField} />];
    }, [])}
    {!optional || part === null ? null : <RemovePartButton partField={partField} />}
    <SearchPartButton enterSearchMode={enterSearchMode} />
  </PartActionsContainer>
);
