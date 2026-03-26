import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#000000',
}));

describe('ThemedText', () => {
  it('affiche le texte passé en children', () => {
    const { getByText } = render(<ThemedText>Bonjour SchoolTool</ThemedText>);
    expect(getByText('Bonjour SchoolTool')).toBeTruthy();
  });

  it('applique le type title sans erreur', () => {
    const { getByText } = render(
      <ThemedText type="title">Titre principal</ThemedText>,
    );
    expect(getByText('Titre principal')).toBeTruthy();
  });
});

describe('ThemedView', () => {
  it('rend les enfants correctement', () => {
    const { getByText } = render(
      <ThemedView>
        <ThemedText>Contenu de la vue</ThemedText>
      </ThemedView>,
    );
    expect(getByText('Contenu de la vue')).toBeTruthy();
  });
});