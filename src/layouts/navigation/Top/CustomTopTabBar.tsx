import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../../style/Colors';
import Entypo from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get('window');

const CustomTopTabBar = ({ state, descriptors, navigation, date, toggleModal }: any) => {

    return (
        <View style={styles.container}>
            {state.routes.map((route:
                {
                    key: string | number;
                    name: any;
                },
                index: React.Key | null | undefined
            ) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel || options.title || route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.6}
                        onPress={onPress}
                        style={[styles.tabButton, isFocused && styles.tabButtonActive]}
                    >
                        {/* <Entypo name="dot-single" color={'#E89D2C'} size={23} /> */}
                        <Text style={[styles.tabText, isFocused && styles.tabTextActive]}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

export default CustomTopTabBar

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // backgroundColor: '#F6FAFF',
        backgroundColor: colors.white,
        elevation:1,
        borderRadius: 8,


    },
    tabButton: {
        backgroundColor: '#F6FAFF',
        borderColor: colors.gray,
        width: width * 0.44,
        paddingVertical: 6,
        flexDirection: 'row',
        // alignSelf:'center'
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,

    },
    tabButtonActive: {
        borderBottomWidth: 0,
        borderBottomColor: 'red',
        backgroundColor: colors.green_box,
        borderRadius: 8,
        elevation:8
    },
    tabText: {
        alignSelf: 'center',
        color: colors.gray,
    },
    tabTextActive: {
        color: colors.white,
        fontWeight: '700',
    },
    
});