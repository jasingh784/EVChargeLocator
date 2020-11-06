import React from 'react'
import { StyleSheet, Text, View, Image, Button, ImageBackground} from 'react-native';


function HomeScreen({ navigation }) {
    return (
        <ImageBackground source={require('../assets/car.jpg')} style={{width: '100%', height: '100%'}}>
            <Button 
                title='Find Locations'
                onPress={() => navigation.navigate('Detail')}
            />
        </ImageBackground>
    )
}

export default HomeScreen
