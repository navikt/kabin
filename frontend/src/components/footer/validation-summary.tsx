import { useFieldName } from '@app/hooks/use-field-name';
import { useSectionTitle } from '@app/hooks/use-section-title';
import type { IValidationError, IValidationSection } from '@app/types/validation';
import { Alert, Link } from '@navikt/ds-react';

interface Props {
  sections: IValidationSection[];
}

export const ValidationSummary = ({ sections }: Props) => {
  if (sections.length === 0) {
    return null;
  }

  const errorMessages = sections.map(({ section, properties }) => (
    <Section section={section} properties={properties} key={section} />
  ));

  return (
    <Alert variant="warning">
      <StyledHeader>Kan ikke fullføre registrering. Dette mangler:</StyledHeader>
      <article className="m-0 mt-2.5 p-0">{errorMessages}</article>
    </Alert>
  );
};

const Section = ({ properties, section }: IValidationSection) => (
  <section className="mt-2.5">
    <h1 className="text-lg">{useSectionTitle(section)}</h1>
    <ul className="pl-4">
      {properties.map((p) => (
        <Field key={`${p.field}-${p.reason}`} {...p} />
      ))}
    </ul>
  </section>
);

const Field = ({ field, reason }: IValidationError) => (
  <li>
    <strong>{`${useFieldName(field)}: `}</strong>
    <Link href={`#${field}`} className="inline">
      {reason}
    </Link>
  </li>
);

export const StyledHeader = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mt-0 text-base">{children}</h3>
);
