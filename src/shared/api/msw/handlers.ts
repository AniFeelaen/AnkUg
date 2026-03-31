import { http, HttpResponse } from 'msw';
import { appealsHandlers } from './appealsHandlers';

export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ ok: true })),
  ...appealsHandlers,
];
