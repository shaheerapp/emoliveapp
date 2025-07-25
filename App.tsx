import {
  View,
  Alert,
  I18nManager,
  BackHandler,
  Platform,
  LayoutAnimation,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import Routes from './src/Routes/Index';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import AppContext from './src/Context/AppContext';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { StatusBar } from 'react-native';
import { colors } from './src/styles/colors';

// Replace <TOKEN> with your actual GitHub token

export default function App() {
  if (I18nManager.isRTL) {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    // Show an alert and restart app
    Alert.alert(
      'Restart Required',
      'The Emo Live needs to restart to apply set Arabic settings.',
      [{ text: 'OK', onPress: () => BackHandler.exitApp() }],
    );
  }

  // Custom Toast Config
  const toastConfig = {
    error: (props: any) => <ErrorToast {...props} text2NumberOfLines={5} />,
  };

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 30 : 0 }}>
        <Provider store={store}>
          <AppContext>
            <Routes />
          </AppContext>
          <Toast config={toastConfig} />
        </Provider>
      </View>
    </GestureHandlerRootView>
  );
}
