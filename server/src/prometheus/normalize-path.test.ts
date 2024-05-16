import { describe, expect, it } from '@jest/globals';
import { normalizePath } from './normalize-path';

describe('normalizePath', () => {
  it('should normalize path', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabin-api/api/behandlinger/12345/detaljer');
    const expected = '/kabin-api/api/behandlinger/:id/detaljer';
    expect(actual).toBe(expected);
  });

  it('should normalize path with UUID ID and subpath', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabin-api/api/behandlinger/123e4588-e89b-12d3-a456-426655440000/detaljer');
    const expected = '/kabin-api/api/behandlinger/:id/detaljer';
    expect(actual).toBe(expected);
  });

  it('should normalize path with UUID ID', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabin-api/api/behandlinger/123e4588-e89b-12d3-a456-426655440000');
    const expected = '/kabin-api/api/behandlinger/:id';
    expect(actual).toBe(expected);
  });

  it('should normalize path with numeric ID, without second api prefix', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/some-other-api/behandlinger/12345/detaljer');
    const expected = '/some-other-api/behandlinger/:id/detaljer';
    expect(actual).toBe(expected);
  });

  it('should normalize path UUID but without second api prefix', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/some-other-api/behandlinger/123e4588-e89b-12d3-a456-426655440000/detaljer');
    const expected = '/some-other-api/behandlinger/:id/detaljer';
    expect(actual).toBe(expected);
  });

  it('should normalize query params with NAV-ident', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabin-search/ansatte/oppgaver?sortering=FRIST&some-query=A123456');
    const expected = '/kabin-search/ansatte/oppgaver?sortering=FRIST&some-query=NAVIDENT';
    expect(actual).toBe(expected);
  });

  it('should normalize query params with 2 NAV-idents', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabin-search/ansatte/oppgaver?sortering=FRIST&some-query=A123456,B098765');
    const expected = '/kabin-search/ansatte/oppgaver?sortering=FRIST&some-query=NAVIDENT,NAVIDENT';
    expect(actual).toBe(expected);
  });

  it('should normalize path with NAV-ident', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabin-search/ansatte/A123456');
    const expected = '/kabin-search/ansatte/:id';
    expect(actual).toBe(expected);
  });
});
