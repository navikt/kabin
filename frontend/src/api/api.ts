import { request } from '@app/api/request';
import { KABAL_API_BASE_PATH } from '@app/redux/api/common';
import type { SvarbrevPreviewInput } from '@app/types/create';

const headers = { 'Content-Type': 'application/json' };

export const createSvarbrevPDF = async (data: SvarbrevPreviewInput, signal?: AbortSignal) =>
  request(`${KABAL_API_BASE_PATH}/svarbrev-preview`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  });
