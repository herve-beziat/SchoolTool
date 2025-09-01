import { colors, spacing, fonts } from './theme';
import type { GlobalStyles } from '@/types/styleTypes';

export const globalStyles: GlobalStyles = {
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
    width: '100%',
  },
  mainContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    height: '100%',
  },

  widgetContainer: {
    alignItems: 'center',
    // backgroundColor: colors.background,
    height: 'auto',
    width: '100%',
    paddingLeft: 12,
    paddingRight: 12,
    minHeight: 320,
    marginBottom: 12,
    marginTop: 12,
  },

  widget: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  widgetNavContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },

  widgetNavTab: {
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  widgetNavActiveTab: {
    borderBottomColor: '#0084FA',
  },

  widgetNavText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },

  widgetTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },

  widgetSubTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.text,
  },

  calendarNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
  },

  arrow: {
    fontSize: 20,
    color: '#3B82F6',
  },

  weekText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#111',
  },

  widgetRecap: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },

  title: {
    fontSize: fonts.title,
    color: colors.secondary,
  },

  closeBtn: {
    marginTop: 20,
    backgroundColor: '#1188aa',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },

  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#e91e63',
  },
};
