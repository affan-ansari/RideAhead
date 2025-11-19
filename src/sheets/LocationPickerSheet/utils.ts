import { AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

export const formatSuggestions = (data: any) => {
  if (data.predictions && data.predictions.length > 0) {
    const formattedSuggestions: AutocompleteDropdownItem[] =
      data.predictions.map((prediction: any) => ({
        id: prediction.place_id,
        title: prediction.description,
      }));
    formattedSuggestions.unshift({
      id: 'choose_from_map',
      title: 'Choose From Map',
    });
    return formattedSuggestions;
  }
  return null;
};
