import { KABAL_API_BASE_QUERY } from '@app/redux/api/common';
import type { SaksTypeEnum } from '@app/types/common';
import type { SvarbrevSetting } from '@app/types/svarbrev-settings';
import { createApi } from '@reduxjs/toolkit/query/react';

interface GetSvarbrevSettingParams {
  ytelseId: string;
  typeId: SaksTypeEnum;
}

export const svarbrevSettingsApi = createApi({
  reducerPath: 'svarbrevSettingsApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    getSvarbrevSetting: builder.query<SvarbrevSetting, GetSvarbrevSettingParams>({
      query: ({ ytelseId, typeId }) => `/svarbrev-settings/ytelser/${ytelseId}/typer/${typeId}`,
    }),
  }),
});

export const { useGetSvarbrevSettingQuery } = svarbrevSettingsApi;
