import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native';
import * as Location from 'expo-location'
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking'
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps'




function AddressView(props) {

    const mapURL = `http://maps.google.com/maps?saddr=${props.userLocation.latitude},${props.userLocation.longitude}&daddr=${props.data.AddressInfo.Latitude},${props.data.AddressInfo.Longitude}`
    //const mapURL = `geo:${props.data.AddressInfo.Latitude},${props.data.AddressInfo.Longitude}`
    _launchMap = () => {
        (async () => {
            const supported = await Linking.canOpenURL(mapURL);

            if(supported) {
                await Linking.openURL(mapURL);
            } else {
                Alert.alert('Dont know how to open this URL')
            }
        })()
    }

    return (
        <Pressable onPress={() => _launchMap()}>
        <View style={styles.addressView} key={props.data.key}>
            <Text>{props.data.AddressInfo.Title}</Text>
            <Text>{props.data.AddressInfo.AddressLine1}</Text>
            <Text>{props.data.AddressInfo.Town}, {props.data.AddressInfo.StateOrProvince} {props.data.AddressInfo.Postcode}</Text>
        </View>
        </Pressable>
    ) 
}


function DetailScreen() {

    const [errorMsg, setErrorMsg] = useState(null);
    // const [latitude, setLatitude] = useState(null);
    // const [longitude, setLongitude] = useState(null);
    const [evLocationData, setEVLocationData] = useState(null);
    const [userLocation, setUserLocation] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [chargeLocation, setChargeLocation] = useState({"AddressInfo": {
        "Title": "This is the title",
    }})

    _getPermissionAsync = async() => {
        let { status } = await Location.requestPermissionsAsync();
            if( status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            }
    }

    _getUserLocationAsync = async() => {
        let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
        // setLatitude(location.coords.latitude);
        // setLongitude(location.coords.longitude);
        setUserLocation({
            ...userLocation,
            ...location.coords
        })
    }

    _getChargingLocationsAsync = async() => {
        const res = await fetch(`https://api.openchargemap.io/v3/poi/?output=json&countrycode=US&maxresults=10&includecomments=true&longitude=${userLocation.longitude}&latitude=${userLocation.latitude}`)
        const data = await res.json();
        setEVLocationData(data);
        console.log(evLocationData)

    }
    useEffect(() => {
        
        (async () => {
            console.log('runnig useEffect')
            
            _getPermissionAsync()

            _getUserLocationAsync()
            
            _getChargingLocationsAsync();
            
        })();
    
    }, []);

    _handleMarkerPress = (data) => {
        setChargeLocation({
            ...data
        })
    }

    return (
        <View style={styles.mainView}>
            {evLocationData != null && (
            <MapView style={{flex: 5}}
                initialRegion={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }} >
                    
                <Marker 
                    coordinate={userLocation}
                    title="You"
                    pinColor="blue"
                />
                {evLocationData.map((data, index) => (
                    <Marker 
                        key={index}
                        coordinate={{latitude: data.AddressInfo.Latitude,
                                    longitude: data.AddressInfo.Longitude}}
                        title={data.AddressInfo.Title}
                        onPress={() => _handleMarkerPress(data)}
                    />
                    
                ))}
            </MapView> 
            
            )}
            <View style={{flex: 2, justifyContent: "center", alignItems: "center"}}>
                <AddressView data = {chargeLocation} userLocation={userLocation} />
            </View>
            {/* <Text>Charge Locations Near You</Text>
            <ScrollView>
                
                {isLoaded && evLocationData.map((data, index) => 
                    <AddressView data = {data} key = {index} userLocation={userLocation}/>
                )}
                <StatusBar style="auto" />
            </ScrollView> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    addressView: {
        margin: 5,
    },
    mainView: {
        flex: 1,
    }
});

export default DetailScreen
