import { Tooltip } from '@navikt/ds-react';
import { differenceInMinutes, isSameDay } from 'date-fns';
import { forwardRef, useEffect, useState } from 'react';
import { isoDateTimeToPretty } from '@app/domain/date';

interface Props {
  dateTime: string;
}

export const DateTime = ({ dateTime }: Props) => <time dateTime={dateTime}>{isoDateTimeToPretty(dateTime)}</time>;

// export const DateTime = ({ dateTime }: Props) => (
//   <Tooltip content={isoDateTimeToPretty(dateTime) ?? 'Ukjent'}>
//     <RelativeDateTime dateTime={dateTime} />
//   </Tooltip>
// );

// const RelativeDateTime = forwardRef<HTMLTimeElement, Props>(({ dateTime }, ref) => {
//   const [now, setNow] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setNow(new Date());
//     }, 1_000);

//     return () => clearInterval(interval);
//   }, []);

//   if (!isSameDay(now, dateTime)) {
//     return (
//       <time dateTime={dateTime} ref={ref}>
//         {isoDateTimeToPretty(dateTime)}
//       </time>
//     );
//   }

//   const minutes = differenceInMinutes(now, dateTime);

//   if (minutes > 60) {
//     const hours = Math.floor(minutes / 60);
//     const minutesLeft = minutes % 60;

//     const timer = hours === 1 ? 'time' : 'timer';

//     if (minutesLeft === 0) {
//       return (
//         <time dateTime={dateTime} ref={ref}>
//           ca. {hours} {timer} siden
//         </time>
//       );
//     }

//     if (hours === 1) {
//       const minutter = minutesLeft === 1 ? 'minutt' : 'minutter';

//       return (
//         <time dateTime={dateTime} ref={ref}>
//           ca. {hours} {timer} og {minutesLeft} {minutter} siden
//         </time>
//       );
//     }

//     return (
//       <time dateTime={dateTime} ref={ref}>
//         ca. {hours + (minutesLeft >= 30 ? 1 : 0)} {timer} siden
//       </time>
//     );
//   }

//   return (
//     <time dateTime={dateTime} ref={ref}>
//       ca. {minutes} minutter siden
//     </time>
//   );
// });

// RelativeDateTime.displayName = 'InternalDateTime';
