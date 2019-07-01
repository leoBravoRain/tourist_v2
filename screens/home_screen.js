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
  Picker,
  ProgressBarAndroid
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
// requestLocationPermission();

class HelloWorldApp extends Component {

  // hide nav bar
  static navigationOptions = {

    header: null,

  }

  //Constructor
  constructor(props) {

    super(props);

    // initial state
    this.state = {

      places: [],

      // initial place
      place: null,

      // Var for indicate if it gets places
      get_places: false,

    };
  
  }

  // Component will mount
  componentWillMount() {

    // get places from API
    const url_server = "http://touristapi.pythonanywhere.com/place/";
    fetch(url_server)
          .then((response) => response.json())
          .then((responseJson) => {

            // list of plcaes in JSON
            var places_from_server = responseJson;

            console.log(places_from_server);

            console.log(places_from_server[0].id);


            // Update places 
            this.setState({

              places: places_from_server,

              // initial place
              place: places_from_server[0].id,
              place_name: places_from_server[0].name,
              get_places: true,

            });


          })
          .catch((error) => {
            console.error(error);
          });  

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
          // 'Conección a internet',
          'Internet connection',
          // 'Para poder usar nuestra app, debes estar conectado a internet',
          'For use our app, you need an Internet connection',
          [
            // {text: 'Me conectaré'},
            {text: 'I will connect!'},
          ],
          { cancelable: false }
        )

      }

      // Implementation without GPS
    // push to next page
    if(connection_state){

      // Navitage to next page
      // this.props.navigation.push("Add_Place"); 
      this.props.navigation.push("Map", {place: this.state.place});  

    };
    
    });


    // // Get gps state
    // GPSState.getStatus().then((status)=>{

    //   // Initialize variable
    //   var gps_state = false;

    //   // If gps is activated
    //   if(status == 3 || status == 4){

    //     // Set state
    //     gps_state = true;

    //     // push to next page
    //     if(connection_state && gps_state){

    //       // Navitage to next page
    //       // this.props.navigation.push("Add_Place"); 
    //       this.props.navigation.push("Map", {place: this.state.place});  

    //     };

    //   }

    //   // If gps is not activated
    //   else{

    //     // Dialog for accesor to user location
    //     LocationServicesDialogBox.checkLocationServicesIsEnabled({

    //       message: "<h2>Tu ubicación</h2> Para poder mostrarte los mejores lugares, necesitamos saber tu ubicación actual.",
    //       ok: "Activar ubicación",
    //       cancel: "No permitir",
          
    //     });

    //   }
     
    // });

  }

  // Render method
  render() {

    const list_places_names = this.state.places.map((item) =>{

      return(item.name);

    })

    // console.log(list_places_names);

    return (

      <View style = {styles.container_flex}>

        <ImageBackground 
          // source={{uri: 'https://previews.123rf.com/images/stocking/stocking1209/stocking120900044/15271577-portrait-of-an-happy-worker-in-a-factory.jpg'}}
          source = {{uri: "https://wpblink.com/sites/default/files/wallpaper/man-made/70210/amsterdam-wallpapers-hd-70210-7107583.png"}}
          style={styles.image_background}
          resizeMode='cover' 
          >

          {
            // If it gets the places from server
            this.state.places.length > 0 && this.state.get_places && this.state.place

            ?

            <View style = {styles.container_flex}>

              <Text style = {{padding: 10, maxWidth: '90%', color: 'white', fontWeight: 'bold', fontSize: 55, textAlign: 'center'}}>

                What city do you want to explore?

              </Text>

              <Picker
                // style = {styles.buttonStyle}
                selectedValue={this.state.place}
                style={{height: 50, width: 100, color: 'white', backgroundColor: 'rgba(255,100,100,0.1)'  }}
                // itemStyle={{ backgroundColor: 'red', }}
                itemTextStyle={{ fontSize: 180, color: 'white' }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({place: itemValue, place_name: list_places_names[itemIndex],})
              }>

                {
                  this.state.places.map((item) =>{
                   return(
                   <Picker.Item  label={item.name} value={item.id} key={item.name}/>
                   );
                 })

                }
              </Picker>

              <Button

                raised

                title = {"Explore " + this.state.place_name}

                // onPress = {this.dangers_map.bind(this)}
                onPress = {()=> this.manage_click()}

                buttonStyle={styles.buttonStyle}

              />

            </View>

            :

              <ProgressBarAndroid />

          }

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