import React, { Component } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  PermissionsAndroid,
  NetInfo,
  // Button,
  Picker
} from 'react-native';

import { Button } from 'react-native-elements';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { NavigationActions, withNavigation } from 'react-navigation';
import GPSState from 'react-native-gps-state';


// Permissions
async function requestLocationPermission() {

  try {

    // const granted = await PermissionsAndroid.request(
    const granted = await PermissionsAndroid.requestMultiple(

      [

        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        // {
        //   'title': 'Permiso para localización',
        //   'message': 'Para entregarte el mejor servicio, necesitas darnos el permiso para acceder a tu posición actual'
        // },

        PermissionsAndroid.PERMISSIONS.CAMERA,
        // {
        //   'title': 'Cool Photo App Camera Permission',
        //   'message': 'Cool Photo App needs access to your camera '
        // }

      ]

    )

  } catch (err) {
    console.warn(err)
  }
}

// ask for permissions
requestLocationPermission();

class HelloWorldApp extends Component {

  // hide nav bar
  static navigationOptions = {

    header: null,

  }

  //Constructor
  constructor(props) {

    super(props);
  
  }

  componentDidMount(){

    // url server
    const url_server = "https://tourist-api.herokuapp.com/location/?format=json";

    // connect to server for wake up server
    fetch(url_server, {

      method: 'GET',

    });

  }

  // Manage danger map
  dangers_map(){

    // Navitage to next page
    this.props.navigation.push("Map"); 

  }

  // manage click on button 
  manage_click(){

    console.log('manage click');

    // initialize network connection variable
    var connection_state = false;

    // Get network connection
    NetInfo.getConnectionInfo().then((connectionInfo) => {

      // get connection state
      connection_state = connectionInfo.type != "none" ? true : false;

      // If isn't connected to internet
      if(!connection_state){

        // Alert message for user
        Alert.alert(
          'Conección a internet',
          'Para poder usar nuestra app, debes estar conectado a internet',
          [
            {text: 'Me conectaré'},
          ],
          { cancelable: false }
        )

      }

    });

    // Get gps state
    GPSState.getStatus().then((status)=>{

      // Initialize variable
      var gps_state = false;

      // If gps is activated
      if(status == 3 || status == 4){

        // Set state
        gps_state = true;

        // push to next page
        if(connection_state && gps_state){

          // Navitage to next page
          // this.props.navigation.push("Add_Place"); 
          this.props.navigation.push("Map");  

        };

      }

      // If gps is not activated
      else{

        // Dialog for accesor to user location
        LocationServicesDialogBox.checkLocationServicesIsEnabled({

          message: "<h2>Tu ubicación</h2> Para poder mostrarte los mejores lugares, necesitamos saber tu ubicación actual.",
          ok: "Activar ubicación",
          cancel: "No permitir",
          
        });

      }
     
    });

  }

  // Render method
  render() {

    return (

      <View style = {styles.container_flex}>

        <ImageBackground 
          // source={{uri: 'https://previews.123rf.com/images/stocking/stocking1209/stocking120900044/15271577-portrait-of-an-happy-worker-in-a-factory.jpg'}}
          source = {{uri: "https://wpblink.com/sites/default/files/wallpaper/man-made/70210/amsterdam-wallpapers-hd-70210-7107583.png"}}
          style={styles.image_background}
          resizeMode='cover' 
          >

          <Button

            raised

            title = {"Explorar el mundo"}

            // onPress = {this.dangers_map.bind(this)}
            onPress = {()=> this.manage_click()}

            buttonStyle={styles.buttonStyle}

          />

        </ImageBackground>

      </View>

    );

  }

}

const styles = StyleSheet.create({

  image_background: {

    flex: 1,
    // remove width and height to override fixed static size
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center'

  },

  container_flex : {

    flex:1 ,
    justifyContent: 'center', 
    alignItems: 'center'
  },

  buttonStyle: {
    backgroundColor: "#3f5fe0",
    width: 300,
    height: 45,
    elevation: 10,
    // fontSize: 20,
    // borderColor: "transparent",
    // borderWidth: 0,
    borderRadius: 100,
    // margin: 2,
    // borderColor: "red",

  }

})

export default withNavigation(HelloWorldApp);