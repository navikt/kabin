import { Receiver } from '@app/redux/api/registreringer/types';
import { SvarbrevResponse } from '@app/redux/api/types';

export type SetSendResponse = SvarbrevResponse<{ send: boolean }>;

export type SetOverrideCustomTextResponse = SvarbrevResponse<{ overrideCustomText: boolean }>;

export type SetTitleResponse = SvarbrevResponse<{ title: string }>;

export type SetCustomTextResponse = SvarbrevResponse<{ customText: string }>;

export type ReceiverResponse = SvarbrevResponse<{ receivers: Receiver[] }>;
