import React, { useRef, useEffect, useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    View,
} from 'react-native';
import WebView from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../styles/colors';
import appStyles from '../../../styles/styles';
import KeepAwake from 'react-native-keep-awake';


interface Props {
    navigation: any;
    route: any;
}

const WebViewGame: React.FC<Props> = ({ navigation, route }) => {
    const { url, user, code, roomId } = route.params;
    const [loading, setLoading] = useState(true);
    const webViewRef = useRef<any>(null);
    const [showWebView, setShowWebView] = useState(true);

    useEffect(() => {
        if (showWebView) {
            KeepAwake.activate();
        }

        return () => {
            KeepAwake.deactivate();
        };
    }, [showWebView]);


    const triggerWalletUpdate = () => {
        const walletUpdatePayload = {
            UserId: user?.id || 'guest_001',
        };

        const jsCode = `window.walletUpdate && window.walletUpdate(${JSON.stringify(walletUpdatePayload)});`;
        webViewRef.current?.injectJavaScript(jsCode);
        console.log('Sent walletUpdate to WebView:', walletUpdatePayload);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            triggerWalletUpdate();
        });

        return unsubscribe;
    }, [navigation]);


    const handlemessage = (event: any) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            const jsCallback = message.jsCallback;

            console.log('Received jsCallback:', jsCallback);

            if (jsCallback.includes('getConfig')) {
                const configData = {
                    appChannel: 'emolive', // your actual channel from BAISHUN
                    appId: 2537349530,            // your actual appId
                    userId: user?.id || 'guest_001',
                    code: code, // should be fetched before
                    roomId: roomId ? roomId : 'room123',
                    gameMode: '3',
                    language: 'en',
                    gameConfig: {
                        sceneMode: 0,
                        currencyIcon: require('../../../assets/svg/diamond.svg'),
                    },
                    gsp: 101,
                };

                console.log('callback: ', configData);

                const jsCode = `window.${jsCallback}(${JSON.stringify(configData)});`;
                webViewRef.current?.injectJavaScript(jsCode);
            }

            else if (jsCallback.includes('destroy')) {
                console.log('Game requested to close.');
                setShowWebView(false);
                navigation.goBack();
            }

            else if (jsCallback.includes('gameRecharge')) {
                console.log('Game requested recharge/top-up.');
                navigation.navigate('Coin');
            }

            else if (jsCallback.includes('gameLoaded')) {
                console.log('Game fully loaded.');
                setLoading(false);
            }

        } catch (e) {
            console.error('Failed to handle game message:', e);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ width: '38%' }} />
                <View style={styles.headerRight}>
                    <Text style={styles.heading}>Play Game</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="close" size={24} color={colors.complimentary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* WebView */}
            {showWebView && (
                <WebView
                    ref={webViewRef}
                    source={{ uri: url }}
                    javaScriptEnabled={true}
                    onMessage={handlemessage}
                    webviewDebuggingEnabled={true}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => {
                        // Don't hide loading yet; wait for gameLoaded event
                        console.log('WebView load finished (not game)');
                    }}
                    onError={(e) => {
                        setLoading(false);
                        console.error('WebView error:', e.nativeEvent);
                    }}
                    onHttpError={({ nativeEvent }) => {
                        console.error('HTTP error:', nativeEvent);
                    }}
                    style={{ flex: 1 }}
                />
            )}

            {/* Loader Overlay */}
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.complimentary} />
                    <Text style={styles.loaderText}>Loading game...</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default WebViewGame;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark_gradient,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '99%',
        marginTop: Platform.OS === 'ios' ? 20 : 15,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerRight: {
        width: '62%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heading: {
        ...appStyles.headline,
        color: colors.complimentary,
        textAlign: 'center',
    },
    loaderContainer: {
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
        transform: [{ translateY: -20 }],
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 10,
        color: colors.complimentary,
        fontSize: 16,
    },
});
