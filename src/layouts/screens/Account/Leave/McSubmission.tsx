import React, { useState } from 'react';
import { FC } from 'react';
import colors from '../../../style/Colors';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const { width } = Dimensions.get('window')

interface Props { }
const McSubmission: FC<Props> = ({ navigation }: any): JSX.Element => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageUris, setImageUris] = useState<string[]>([]);


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: 'Camera Permission',
                    message: 'App needs camera permission to capture photos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                });
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Camera permission granted');
                } else {
                    console.log('Camera permission denied');
                }
            } catch (error) {
                console.log('Error requesting camera permission:', error);
            }
        }
    };

    const openCamera = async () => {
        await requestCameraPermission();
        const options = {
            mediaType: 'photo',
        };

        launchCamera(options, (response: ImagePickerResponse) => {
            if (!response.didCancel && !response.error && !response.customButton) {
                const selectedImage = response.assets
                    ? response.assets.map((asset: { uri: any; }) => asset.uri)
                    : [response.uri];

                // Set the selected image URI to the state
                setImageUri(selectedImage[0]);
                toggleModal();
            } else {
                console.log('User cancelled or error:', response.error || response.customButton);
            }
        });
    };

    const openImageLibrary = () => {
        const options = {
            mediaType: 'photo',
            selection: 3,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (!response.didCancel && !response.error && !response.customButton) {
                const selectedImage = response.assets
                    ? response.assets.map((asset) => asset.uri)
                    : [response.uri];

                // Set the selected image URI to the state
                setImageUri(selectedImage[0]);
                setImageUris([...imageUris, ...selectedImage]);


                if (imageUris.length + selectedImage.length >= 3) {
                    setIsVisible(true);
                }

                toggleModal();
            } else {
                console.log('User cancelled or error:', response.error || response.customButton);
            }
        });
    };
    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.heading}>MC Submission</Text>
                <View style={styles.uploadMedia}>
                    <View style={styles.calendarView}>
                        <Text style={styles.dateText}>Date Range:</Text>
                        <Text style={styles.date}>1/11/2023 - 27/11/2023</Text>
                    </View>
                    <Text style={styles.uploadMediahead}>Upload Media</Text>
                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                            {imageUris.map((uri, index) => (
                                <Image key={index} source={{ uri: uri }} style={styles.image} />
                            ))}
                            <TouchableOpacity style={styles.uploadBtn} onPress={toggleModal} >
                                <Text style={styles.uploadBtnText}>+</Text>
                                <Text style={styles.uploadBtnText}>Upload</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* =================================================================================================== */}
                    <Modal isVisible={isModalVisible}>
                        <View style={styles.popUp}>
                            <View style={styles.crossBtn}>
                                <View><Text> </Text></View>
                                <TouchableOpacity onPress={toggleModal} >
                                    <Text style={{ color: 'grey', fontSize: width * 0.06, paddingBottom: 3 }}>X</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.optionBtns}>
                                <TouchableOpacity style={styles.optionS}
                                    onPress={openImageLibrary}
                                >
                                    <MaterialIcons name="insert-photo" size={width * 0.1} color={colors.brand_primary} />
                                    <Text style={styles.optionText}>Library</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionS}
                                    onPress={openCamera}
                                >
                                    <MaterialCommunityIcons name="camera" size={width * 0.1} color={colors.brand_primary} />
                                    <Text style={styles.optionText}>Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    {/* =================================================================================================== */}

                </View>
                <TouchableOpacity style={styles.StartTask}>
                    <Text style={styles.StartTaskText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default McSubmission;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.brand_secondary,

    },
    heading: {
        color: colors.black,
        alignSelf: 'center',
        marginVertical: 20,
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    uploadMedia: {
        backgroundColor: colors.white,
        padding: 15,
        // marginTop: 10,
    },
    uploadMediahead: {
        color: colors.black,
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        // marginTop: 30,
    },
    popUp: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.brand_primary,
        backgroundColor: 'white',
        width: width * 0.8,
        padding: 10,
        marginLeft: '5%'
    },
    crossBtn: {
        width: '90%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        marginLeft: '5%',
        marginBottom: 10,
    },
    optionBtns: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginBottom: 10,

    },
    optionS: {
        width: '30%',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.brand_primary,
        paddingTop: 7,
        paddingBottom: 7
    },
    optionText: {
        color: colors.brand_primary,
    },
    image: {
        height: width * 0.2,
        width: width * 0.2,
        marginRight: 10,
    },
    uploadBtn: {
        height: width * 0.2,
        width: width * 0.2,
        backgroundColor: '#E1E1E1',
        borderColor: colors.gray,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadBtnText: {
        color: colors.gray,
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },
    StartTask: {
        alignItems: 'center',
        backgroundColor: colors.brand_primary,
        alignSelf: 'center',
        borderRadius: 8,
        paddingHorizontal: 35,
        paddingVertical: 8,
        marginVertical: width * 0.12,
    },
    StartTaskText: {
        fontSize: 12,
        color: colors.white,
        marginTop: 5,
        fontFamily: 'Poppins-Medium',
        alignSelf: 'center',
    },
    calendarView: {
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom:10,
    },
    dateText:{
        fontSize:12,
        color:colors.black,
        fontFamily: 'Poppins-SemiBold',
        paddingTop:3,

    },
    date:{
        fontSize:12,
        color:colors.black,
        fontFamily: 'Poppins-Regular',
        borderWidth:1,
        borderColor:colors.lightGray,
        paddingHorizontal:10,
        paddingTop:5,


    },
});
