import React, {useEffect, useMemo, useState} from 'react';
import {Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PermissionRequiredView from '../Screen/Permissions/PermissionRequiredView';
import Context from '../Context/Context';
import SplashScreen from 'react-native-splash-screen';
import Login from '../Screen/Guest/Login';
import ForgotPassword from '../Screen/Guest/ForgotPassword';
import CheckInbox from '../Screen/Guest/CheckInbox';
import DispatchRoute from '../Screen/newScreen/Shipment/DispatchRoute';
// import Map from '../Screen/newScreen/Maps/Map';
import {updateUser} from '../redux/actions/driverProfile';
import Profile from '../Screen/Home/Account/Profile/Profile';
import SearchScreen from '../Screen/Home/Schedules/SearchScreen';
import SignProofOfDelivery from '../Screen/Home/Schedules/ActiveAssignment/Components/Docs/SignProofOfDelivery';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import ConnectionError from '../Screen/Permissions/ConnectionError';
import Dispatcher from '../Screen/Home/Account/Dispatcher/Dispatcher';
import AssignmentView from '../Screen/Home/Schedules/PendingAssignment/AssignmentView';
import ActiveAssignmentView from '../Screen/Home/Schedules/ActiveAssignment/AssignmentView';
import Availabilty from '../Screen/Home/Account/Availability/Availabilty';
import ArrivedAtPickupp from '../Screen/Home/Schedules/ActiveAssignment/Components/ArrivedAtPickupp';
import ArrivedNextDelivery from '../Screen/Home/Schedules/ActiveAssignment/Components/ArrivedNextDelivery';
import ArrivedAtDelivery from '../Screen/Home/Schedules/ActiveAssignment/Components/ArrivedAtDelivery';
import CompleteShipment from '../Screen/Home/Schedules/ActiveAssignment/Components/CompleteShipment';
import PodSubmission from '../Screen/Home/Schedules/ActiveAssignment/Components/PodSubmission';
import ViewPod from '../Screen/Home/Schedules/ActiveAssignment/Components/ViewPod';
import AddDocument from '../Screen/Home/Account/Profile/Document/Tabs/AddDocument';
import EditProfile from '../Screen/Home/Account/Profile/Info/EditProfile';
import UploadCDL from '../Screen/Home/Account/Profile/Document/Tabs/UploadCDL';
import TWICCard from '../Screen/Home/Account/Profile/Document/Tabs/TWICCard';
import UploadMedicalCertif from '../Screen/Home/Account/Profile/Document/Tabs/UploadMedicalCertif';
import DocumentView from '../Screen/Home/Schedules/ActiveAssignment/Components/DocumentView';
import ViewDriverDoc from '../Screen/Home/Account/Profile/Document/Tabs/ViewDriverDoc';
import {
  shipmentGlobal,
  shipmentGlobalInfo,
  mapGlobalState,
} from '../Context/GlobalStateVar';
import Home from '../Screen/Home/Home';
import Socketio from 'socket.io-client';
import Echo from 'laravel-echo/dist/echo';
import {PERMISSIONS, check} from 'react-native-permissions';
import Notifications from '../Screen/Home/Account/Notifications/Notifications';
import {envVar} from '../../localEnv';
import SocketSerivce from '../socket/SocketService';
const Stack = createNativeStackNavigator();

const Route = () => {
  const dispatchAction = useDispatch();

  const [token, SetToken] = useState(null);
  const [locationPermissionOn, setLocationPermissionOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [connection, setConnection] = useState(false);
  const [confirmArrivalTime, setConfirmArrivalTime] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(false);

  useEffect(() => {
    // splashScreenSetup();
    checkUser();
    //SocketSerivce.initializeSocket(token);
  }, []);
  useEffect(() => {
    checkLocationPermission();
    checkEventListner();

    SplashScreen.hide();
  }, []);

  const splashScreenSetup = () => {
    if (Platform.OS == 'android') {
      SplashScreen.hide();
    }
  };
  // const socketSetup = () => {
  //   let echo = new Echo({
  //     broadcaster: 'socket.io',
  //     host: `https://truckingmstest.shifl.com:6002`,
  //     client: Socketio,
  //     auth: {
  //       headers: {
  //         Authorization: 'Bearer ' + token,
  //       },
  //     },
  //   });
  //   console.log('ECHO', echo.connector);
  //   echo.connect('connected', data => {
  //     console.log('data', data);
  //   });

  // };

  const checkEventListner = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setConnection(true);
      } else {
        setConnection(false);
      }
    });

    return () => {
      unsubscribe();
    };
  };

  const checkUser = async () => {
    const loggedUser = await AsyncStorage.getItem('loggedUser');
    if (loggedUser) {
      let user = JSON.parse(loggedUser);
      //console.log('Logged USer', loggedUser);
      dispatchAction(updateUser(user.user));

      SetToken(user.token);
    }
  };

  const userAuthInfo = useMemo(() => ({token, SetToken}), [token]);
  const connectionStatus = useMemo(
    () => ({connection, setConnection}),
    [connection],
  );
  const loc = useMemo(
    () => ({locationPermissionOn, setLocationPermissionOn}),
    [locationPermissionOn],
  );
  const confirmArrivalTimeData = useMemo(
    () => ({confirmArrivalTime, setConfirmArrivalTime}),
    [confirmArrivalTime],
  );
  const ArrivalTimeData = useMemo(
    () => ({arrivalTime, setArrivalTime}),
    [arrivalTime],
  );
  const localStateVariableToExport = {
    zoomLevel,
    setZoomLevel,
  };
  let valueToContext = {
    userAuthInfo,
    loc,
    shipmentGlobal,
    shipmentGlobalInfo,
    mapGlobalState,
    localStateVariableToExport,
    connectionStatus,
    confirmArrivalTimeData,
    ArrivalTimeData,
  };

  const checkLocationPermission = () => {
    if (Platform.OS === 'ios') {
      checkLocationPermissionIos();
      return;
    }
    if (Platform.Version < 29) {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        if (result === 'granted') {
          setLocationPermissionOn(true);
        }
      });
      return;
    }
    check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(result => {
      if (result === 'granted') {
        setLocationPermissionOn(true);
      }
    });
  };
  const checkLocationPermissionIos = () => {
    if (Platform.Version < 13) {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        if (result === 'granted') {
          setLocationPermissionOn(true);
        }
      });
      return;
    }
    check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
      if (result === 'granted') {
        setLocationPermissionOn(true);
      }
    });
  };

  const linking = {
    // prefixes: ['https://shifldriver.netlify.app/universal'],
    prefixes: ['shifldriver://app'],
    config: {
      screens: {
        initialRouteName: 'CheckInbox',
        CheckInbox: {
          path: 'forgotPassword/:backendToken/:userEmail',
        },
      },
    },
  };
  // https://shifldriver.netlify.app/
  // npx uri-scheme open shifldriver://app --android
  return (
    <Context.Provider value={valueToContext}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          {connection ? (
            <>
              {token == null ? (
                <Stack.Group>
                  {/* <Stack.Screen name="Pratice" component={Pratice} /> */}

                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{headerShown: false}}
                  />

                  <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen name="CheckInbox" component={CheckInbox} />
                </Stack.Group>
              ) : (
                <>
                  {locationPermissionOn ? (
                    <>
                      <Stack.Group>
                        {/* <Stack.Screen name="SubmitPOD" component={SubmitPOD} /> */}
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="Home"
                          component={Home}
                        />
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="ArrivedAtPickupp"
                          component={ArrivedAtPickupp}
                        />
                        <Stack.Screen
                          name="ActiveAssignmentView"
                          options={{headerShown: false}}
                          component={ActiveAssignmentView}
                        />

                        <Stack.Screen
                          name="AssignmentView"
                          component={AssignmentView}
                          options={{headerShown: false}}
                        />

                        <Stack.Screen name="ViewPod" component={ViewPod} />

                        <Stack.Screen
                          options={{headerShown: false}}
                          name="CompleteShipment"
                          component={CompleteShipment}
                        />
                        <Stack.Screen
                          name="DocumentView"
                          component={DocumentView}
                        />
                        <Stack.Screen
                          // options={{headerShown: false}}
                          name="PodSubmission"
                          component={PodSubmission}
                        />
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="ArrivedAtDelivery"
                          component={ArrivedAtDelivery}
                        />

                        <Stack.Screen
                          name="Dispatcher"
                          component={Dispatcher}
                        />

                        <Stack.Screen name="Profile" component={Profile} />

                        <Stack.Screen
                          options={{headerShown: false}}
                          name="SearchScreen"
                          component={SearchScreen}
                        />
                        <Stack.Screen
                          options={{headerShown: false}}
                          name="ArrivedNextDelivery"
                          component={ArrivedNextDelivery}
                        />
                        <Stack.Screen
                          name="DispatchRoute"
                          component={DispatchRoute}
                        />

                        <Stack.Screen
                          options={{headerShown: false}}
                          name="Map"
                          component={Map}
                        />
                        <Stack.Screen
                          name="AddDocument"
                          component={AddDocument}
                        />
                        <Stack.Screen name="UploadCDL" component={UploadCDL} />
                        <Stack.Screen name="TWICCard" component={TWICCard} />
                        <Stack.Screen
                          name="EditProfile"
                          component={EditProfile}
                        />
                        <Stack.Screen
                          name="ViewDriverDoc"
                          component={ViewDriverDoc}
                        />

                        <Stack.Screen
                          name="UploadMedicalCertif"
                          component={UploadMedicalCertif}
                        />

                        {/* <Stack.Screen
                          options={{headerShown: false}}
                          name="MapHeaderActive"
                          component={MapHeaderActive}
                        /> */}
                        <Stack.Screen
                          name="SignProofOfDelivery"
                          component={SignProofOfDelivery}
                        />
                        <Stack.Screen
                          name="Notifications"
                          component={Notifications}
                          options={{headerShown: false}}
                        />
                      </Stack.Group>
                    </>
                  ) : (
                    <>
                      <Stack.Screen
                        name="PermissionRequiredView"
                        component={PermissionRequiredView}
                      />
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <Stack.Screen name="ConnectionError" component={ConnectionError} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
};
export default Route;

// adb shell am start -W -a android.intent.action.VIEW -d "shifldriver://app/ss" com.shifl.shifldriverappproject
// npx uri-scheme open "shifldriver://app/ss" --ios
