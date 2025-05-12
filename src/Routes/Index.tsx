import React, {useState, useEffect, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Landing from '../Screens/Guest/Landing';
import Phone from '../Screens/Guest/Phone';
import SplashScreen from '../Screens/Guest/SplashScreen';
import GeneralPermission from '../Components/GeneralPermission';
import HomeB from '../Screens/Auth/Home/HomeB';
import Notifications from '../Screens/Auth/Home/Notifications';
import UserProfile from '../Screens/Auth/Home/Profile/UserProfile';
import Coin from '../Screens/Auth/Home/Profile/Coin';
import VIP from '../Screens/Auth/Home/Profile/VIP';
import Ranking from '../Screens/Auth/Home/Profile/ShortCuts/Ranking';
import Friends from '../Screens/Auth/Home/Profile/ShortCuts/Friends';
import Agency from '../Screens/Auth/Home/Profile/ShortCuts/Agency';
import PurchaseVIP from '../Screens/Auth/Home/Profile/PurchaseVIP';
import JoinAgency from '../Screens/Auth/Home/Profile/ShortCuts/JoinAgency';
import UpdatePassword from '../Screens/Auth/Home/Profile/CRUD/UpdatePassword';
import Register from '../Screens/Guest/Register';
import LiveStreamingTest from '../tests/LiveStreaming';
import BlockedUsers from '../Screens/Auth/Home/Profile/Settings/BlockedList';
import ForgetPassword from '../Screens/Guest/ForgetPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AgencyMembers from '../Screens/Auth/Home/Profile/Agency/AgencyMembers';
import Chat from '../Screens/Auth/Home/Chat/Chat';
import GoLive from '../Screens/Auth/Home/Tabs/GoLive';
import PlayCenter from '../Screens/Auth/Games/PlayCenter';
import ScoreCard from '../Screens/Auth/Games/ScoreCard';
import StrangerMessages from '../Screens/Auth/Home/Chat/StrangerMessages';
import Settings from '../Screens/Auth/Home/Profile/ShortCuts/Settings';
import NotificationSettings from '../Screens/Auth/Home/Profile/Settings/NotificationSettings';
import ConnectionError from '../Screens/General/ConnectionError';
import Privacy from '../Screens/Auth/Home/Profile/Settings/Privacy';
import Level from '../Screens/Auth/Home/Profile/Level/Level';
import LiveBattle from '../Screens/Auth/Home/PK/LiveBattle';
import LiveStreaming from '../Screens/Auth/Home/Tabs/Streaming/LiveStreaming';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import GoLive2 from '../Screens/Auth/Home/Chat/GoLive2';
import Inbox from '../Screens/Auth/Home/Chat/Inbox';
// import Notifications from '../Screens/Auth/Home/Notifications';
// import Chat2 from ""
import {useAppContext} from '../Context/AppContext';
import Chat2 from './Test/Chat2';
// import Edit
import EditProfile from '../Screens/Auth/Home/Profile/EditProfile';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {isSearchBarAvailableForCurrentPlatform} from 'react-native-screens';
import {colors} from '../styles/colors';
// const Navigation = createStaticNavigation(RootStack);
const Stack = createNativeStackNavigator();

export default function Index() {
  const {userAuthInfo, netConnection, loader} = useAppContext();
  const {user} = userAuthInfo;
  const {connection} = netConnection;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {connection ? (
          <Stack.Group screenOptions={{headerShown: false}}>
            {loader ? (
              <>
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
              </>
            ) : (
              <>
                {user == null ? (
                  <Stack.Group>
                    <Stack.Screen name="Landing" component={Landing} />
                    <Stack.Screen name="Phone" component={Phone} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen
                      name="ForgetPassword"
                      component={ForgetPassword}
                    />
                    <Stack.Screen
                      name="GeneralPermission"
                      component={GeneralPermission}
                    />
                  </Stack.Group>
                ) : (
                  <>
                    {/* <Stack.Screen
                        name="LiveStreamingTest"
                        component={LiveStreamingTest}
                      /> */}
                    <Stack.Screen name="HomeB" component={HomeB} />
                    <Stack.Screen name="ScoreCard" component={ScoreCard} />
                    <Stack.Screen name="VIP" component={VIP} />
                    <Stack.Group>
                      <Stack.Screen name="Agency" component={Agency} />
                      <Stack.Screen name="Friends" component={Friends} />
                      <Stack.Screen name="Inbox" component={Inbox} />
                      <Stack.Screen name="Ranking" component={Ranking} />
                    </Stack.Group>
                    <Stack.Screen
                      name="GeneralPermission"
                      component={GeneralPermission}
                    />
                    <Stack.Screen name="UserProfile" component={UserProfile} />

                    <Stack.Screen name="PurchaseVIP" component={PurchaseVIP} />
                    <Stack.Group>
                      <Stack.Screen name="LiveBattle" component={LiveBattle} />
                    </Stack.Group>
                    <Stack.Screen
                      name="UpdatePassword"
                      component={UpdatePassword}
                    />
                    <Stack.Group>
                      <Stack.Screen name="GoLive2" component={GoLive2} />
                      <Stack.Screen
                        name="LiveStreaming"
                        component={LiveStreaming}
                      />
                    </Stack.Group>

                    <Stack.Screen name="Chat" component={Chat} />
                    <Stack.Screen name="PlayCenter" component={PlayCenter} />

                    <Stack.Screen name="Chat2" component={Chat2} />
                    <Stack.Screen
                      name="StrangerMessages"
                      component={StrangerMessages}
                    />
                    <Stack.Screen name="GoLive" component={GoLive} />
                    <Stack.Screen name="Coin" component={Coin} />
                    <Stack.Screen
                      name="AgencyMembers"
                      component={AgencyMembers}
                    />
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen name="JoinAgency" component={JoinAgency} />
                    <Stack.Screen name="Level" component={Level} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                    <Stack.Screen name="Privacy" component={Privacy} />
                    <Stack.Screen
                      name="Notifications"
                      component={Notifications}
                    />
                    <Stack.Screen
                      name="NotificationSettings"
                      component={NotificationSettings}
                    />
                    <Stack.Screen
                      name="BlockedUsers"
                      component={BlockedUsers}
                    />
                  </>
                )}
              </>
            )}
          </Stack.Group>
        ) : (
          <Stack.Screen
            name="ConnectionError"
            options={{
              headerTitle: 'Connection Error',
              headerStyle: {
                backgroundColor: colors.LG,
              },
              headerTintColor: colors.complimentary,
              // statusBarStyle: 'dark',
            }}
            component={ConnectionError}
          />
        )}

        {/* <Stack.Screen  name="Home" component={HomeScreen}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
