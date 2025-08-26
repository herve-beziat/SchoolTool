import { colors, spacing, fonts } from './theme';
import type { IndexStyles } from '@/types/styleTypes';

export const indexStyles: IndexStyles = { 
  chartSection: {
    width: '92%',
    minHeight: 320,
    marginBottom: 12,
    marginTop: 12,
    height: '40%',
  },
  calendarSection: {
    width: '92%',
    height: '40%',
  },
  loginWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
};
