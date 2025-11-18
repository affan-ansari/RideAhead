import { StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SheetProvider } from 'react-native-actions-sheet';
import './src/sheets/sheets';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ThemeProvider>
      <AutocompleteDropdownContextProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <SheetProvider>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </SheetProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AutocompleteDropdownContextProvider>
    </ThemeProvider>
  );
}

export default App;
