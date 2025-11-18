export const formatSuggestions = (data: any) => {
  if (data.predictions && data.predictions.length > 0) {
    const formattedSuggestions = data.predictions.map((prediction: any) => ({
      id: prediction.place_id,
      title: prediction.description,
    }));
    return formattedSuggestions;
  }
  return undefined;
};
