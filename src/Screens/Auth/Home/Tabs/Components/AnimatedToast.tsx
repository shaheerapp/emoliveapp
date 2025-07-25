import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../../../../styles/colors';


const AnimatedToast = ({ message, type }: { message: string, type: 'success' | 'error' }) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Start the entry animations
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 40,
                duration: 500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // After showing for 1 second, start fade out over 2 seconds
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 2000,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 20, // Slide up slightly while fading
                        duration: 2000,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                ]).start();
            }, 1000);
        });
    }, []);

    return (
        <Animated.View style={[
            styles.toastContainer,
            {
                transform: [{ translateY: slideAnim }],
                backgroundColor: colors.white,
                borderLeftWidth: 4,
                borderLeftColor: type === 'success' ? colors.green : colors.accent,
                opacity: opacityAnim, // Add opacity animation
            },
        ]}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Animated.View style={styles.iconContainer}>
                    <Icon
                        name={type === 'success' ? 'thumbs-up' : 'thumbs-down'}
                        size={24}
                        color={type === 'success' ? colors.green : colors.accent}
                        style={styles.iconStyle}
                    />
                </Animated.View>
            </Animated.View>
            <Text style={[styles.toastText, { color: type === 'success' ? colors.green : colors.accent, marginLeft: 8 }]}>
                {message}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 0,
        left: 30,
        right: 30,
        padding: 10,
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    toastText: {
        fontSize: 12,
        flex: 1,
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 16,
        backgroundColor: colors.offwhite,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.offwhite,
    },
    iconStyle: {
        // Additional icon styling if needed
    },
});

export default AnimatedToast;
