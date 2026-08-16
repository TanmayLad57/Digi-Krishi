import { mockResponsesEn } from './mockResponses.en';
import { mockResponsesHi } from './mockResponses.hi';
import { mockResponsesMr } from './mockResponses.mr';
import { mockResponsesMl } from './mockResponses.ml';

export function getMockResponses(langCode = 'en') {
  const code = (langCode || 'en').toLowerCase().split('-')[0];
  switch (code) {
    case 'hi':
      return mockResponsesHi;
    case 'mr':
      return mockResponsesMr;
    case 'ml':
      return mockResponsesMl;
    case 'en':
    default:
      return mockResponsesEn;
  }
}
