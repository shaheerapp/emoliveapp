import {
  View,
  Alert,
  I18nManager,
  BackHandler,
  Platform,
  LayoutAnimation,
} from 'react-native';
import React from 'react';
import Routes from './src/Routes/Index';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {store} from './src/store/store';
import Toast from 'react-native-toast-message';
import AppContext from './src/Context/AppContext';
import {Provider} from 'react-redux';

// Replace <TOKEN> with your actual GitHub token

export default function App() {
  if (I18nManager.isRTL) {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    // Show an alert and restart app
    Alert.alert(
      'Restart Required',
      'The Emo Live needs to restart to apply set Arabic settings.',
      [{text: 'OK', onPress: () => BackHandler.exitApp()}],
    );
  }

  return (
    <GestureHandlerRootView>
      <View style={{flex: 1}}>
        <Provider store={store}>
          <AppContext>
            <Routes />
          </AppContext>
          <Toast />
        </Provider>
      </View>
    </GestureHandlerRootView>
  );
}
