import { PartActionsContainer } from '@app/components/overstyringer/layout';
import { RemovePartButton } from '@app/components/overstyringer/part-read/remove-part';
import { SearchPartButton } from '@app/components/overstyringer/part-read/search-part-button';
import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import type { EnterSearchModeCallback, ISetPart } from '@app/components/overstyringer/part-read/types';
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
      if (
        p.defaultPart.identifikator === part?.identifikator ||
        excludedPartIds.includes(p.defaultPart.identifikator)
      ) {
        return list;
      }

      list.push(<SetPartButton key={p.label} {...p} partField={partField} />);

      return list;
    }, [])}
    {!optional || part === null ? null : <RemovePartButton partField={partField} />}
    <SearchPartButton enterSearchMode={enterSearchMode} />
  </PartActionsContainer>
);
