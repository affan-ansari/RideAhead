import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import {
  AutocompleteDropdown,
  AutocompleteDropdownItem,
  IAutocompleteDropdownRef,
} from 'react-native-autocomplete-dropdown';
import { useTheme } from '../../../contexts/ThemeContext';

interface LabeledAutocompleteProps {
  label: string;
  placeholder: string;
  onChangeText: (query: string) => Promise<AutocompleteDropdownItem[] | null>;
  onSelectItem: (item: AutocompleteDropdownItem | null) => void;
  onClear: () => void;
  onFocus?: () => void;
  initialSuggestions?: AutocompleteDropdownItem[] | null;
  debounce?: number;
  emptyResultText?: string;
  showClear?: boolean;
  suggestionsListMaxHeight?: number;
  initialValue: AutocompleteDropdownItem | string | { id: string } | undefined;
}

export function LabeledAutocomplete({
  label,
  placeholder,
  onChangeText,
  onSelectItem,
  onClear,
  onFocus,
  initialValue = undefined,
  initialSuggestions = null,
  debounce = 600,
  emptyResultText = 'No results found',
  showClear = true,
  suggestionsListMaxHeight = Dimensions.get('window').height * 0.4,
}: LabeledAutocompleteProps) {
  const { theme } = useTheme();
  const dropdownController = useRef<IAutocompleteDropdownRef | null>(null);

  const [suggestions, setSuggestions] = useState<
    AutocompleteDropdownItem[] | null
  >(initialSuggestions);
  const [loading, setLoading] = useState(false);

  const handleChangeText = useCallback(
    async (query: string) => {
      if (typeof query !== 'string' || query.length < 2) {
        setSuggestions(initialSuggestions);
        return;
      }

      setLoading(true);
      try {
        const results = await onChangeText(query);

        if (results && results.length > 0) {
          dropdownController.current?.open();
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [onChangeText, initialSuggestions],
  );

  const handleClear = useCallback(() => {
    setSuggestions(initialSuggestions);
    onClear();
  }, [onClear, initialSuggestions]);

  const handleOpenSuggestionsList = useCallback((isOpened: boolean) => {
    console.log('Suggestions list opened:', isOpened);
  }, []);

  return (
    <View>
      <View
        style={{
          ...styles.labelContainer,
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.primary,
        }}
      >
        <Text style={{ color: theme.colors.buttonText }}>{label}</Text>
      </View>
      <AutocompleteDropdown
        controller={controller => {
          dropdownController.current = controller;
        }}
        initialValue={initialValue}
        direction="down"
        dataSet={suggestions}
        onChangeText={handleChangeText}
        onSelectItem={onSelectItem}
        debounce={debounce}
        loading={loading}
        useFilter={false}
        clearOnFocus={false}
        closeOnBlur={false}
        closeOnSubmit={false}
        onClear={handleClear}
        onOpenSuggestionsList={handleOpenSuggestionsList}
        suggestionsListMaxHeight={suggestionsListMaxHeight}
        textInputProps={{
          placeholder,
          autoCorrect: false,
          autoCapitalize: 'none',
          onFocus,
        }}
        inputContainerStyle={{
          ...styles.inputContainer,
          borderColor: theme.colors.primary,
        }}
        suggestionsListContainerStyle={styles.listContainer}
        emptyResultText={emptyResultText}
        showClear={showClear}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    zIndex: 2,
  },
  listContainer: {
    zIndex: 3,
    elevation: 10,
  },
  labelContainer: {
    borderColor: 'black',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: -3,
    paddingHorizontal: 15,
  },
});
