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
  ScrollView,
  Picker,
   // AppRegistry,
  PixelRatio,
  TouchableOpacity,
  TextInput,
  Vibration,
  ProgressBarAndroid
} from 'react-native';

import { Button, Icon } from 'react-native-elements';
import { NavigationActions, withNavigation } from 'react-navigation';
import MapView from 'react-native-maps'

// Main class
class Main_Map extends Component {

  //Constructor
  constructor(props) {

    super(props);

    this.state = {

      initialPosition: null,

      places_markers: null,

      // Var for indicate if it gets markers
      get_markers: false,

    };

    //Add function for use in this component
    this.get_current_position = this.get_current_position.bind(this);

  }

  // Options for header bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Exploring the city",
      // headerTitleStyle: {
      //     textAlign: 'center',
      //     backgroundColor: 'red',
      //     // flexGrow:1,
      //     alignSelf:'center',
      // },

      headerRight: (
        <Icon
          // raised

          name='map'
          // underlayColor={'#2089dc'} 
          // style = {{backgroundColor: 'red'}}
          // reverseColor = '#3f5fe0'
          type='font-awesome'  
          onPress={() => navigation.navigate('Map')}
          color='white'
          // iconStyle = {'marginRight': 0}
          iconStyle={{ margin: 15 }}
          // style: { marginRight: 0 } 
        />
      ),
      headerLeft: (
        <Icon
          // raised 
          name='home'
          // type='font-awesome'  
          onPress={() => navigation.navigate('Home')}
          color='white'
          iconStyle={{ margin: 15 }}
        />
      ),

      headerStyle: {
        backgroundColor: "#3f5fe0",
        // fontWeight: 20,
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  componentWillMount() {
    // get markers for map

    const url_server = "https://touristapi.pythonanywhere.com/location/" + this.props.navigation.state.params.place + '/';

    fetch(url_server)
          .then((response) => response.json())
          .then((responseJson) => {

            // places with activated dangers
            var places_markers_from_server = responseJson;

            var first_place = places_markers_from_server[0];

            console.log(first_place);

            // Update places markers (dangers)
            this.setState({

              places_markers: places_markers_from_server,

              get_markers: true,

              initialPosition: {
                latitude: parseFloat(first_place.latitude), 
                longitude: parseFloat(first_place.longitude) 
              },

            });

            // Get current position and analize risk
            // this.get_current_position();

          })
          .catch((error) => {
            console.error(error);
          });  

  }

  // Function for get current position and analize risk
  get_current_position(){

    // Get current position (it changes). Use navigator.geolocation.watchPosition
    navigator.geolocation.getCurrentPosition(

        (position) => {

            // Get user position
            // Position has altitude!!! Maybe we can add altitude to location on map for distinguis between floors in a factory
            this.setState({ initialPosition: {latitude: position.coords.latitude, longitude: position.coords.longitude }})

        },
        (error) => console.log(new Date(), error),
        // {enableHighAccuracy: true, timeout: 100000}
        // If gps is not working, so uncomment next line
        // {timeout: 10000, enableHighAccuracy: true}
    ); 

  }


  // Render method
  render() {

    return (

        <View style = {styles.container_flex}>

          {
            // It must to separate alert of gps turned off and other conditions
            this.state.initialPosition != null && this.state.places_markers != null && this.state.get_markers != null

            ?

            <MapView

              // showsUserLocation
              // followsUserLocation
              // showsMyLocationButton

              initialRegion={{
                latitude: this.state.initialPosition.latitude,
                longitude: this.state.initialPosition.longitude,
                latitudeDelta: 0.0922,
                // latitudeDelta: 0.005,
                longitudeDelta: 0.0421,
                // longitudeDelta: 0.005,
              }}

              mapType = "satellite"
              region = { this.state.initial_region }
              style = {{width: '100%', height: '100%'}}

            >

              { 

                this.state.places_markers.map( (marker, index) => (

                  <MapView.Marker

                    key = {index}

                    coordinate = {{latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude) }}

                    onPress = {() => this.props.navigation.push("Location_Details", {marker: marker})}

                    pinColor = '#B39130'

                  >

                    

                  </MapView.Marker>

                ))

              }

            </MapView>

          :

            <ProgressBarAndroid />

          }

         

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
    width: 30,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    // borderRadius: 5
    elevation: 1,
  },

  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },

})

export default withNavigation(Main_Map);