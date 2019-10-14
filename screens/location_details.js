import React, { Component } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  // Button,
  Linking,
  ImageBackground,
  FlatList,
  ScrollView,
  ProgressBarAndroid
} from 'react-native';

import { 
  Badge,
  Button,
  Icon
} from 'react-native-elements';

import { WebView } from "react-native-webview";

// Index for video
var index = 0;

// Home screen
export default class Location_Details extends Component {


  // Options for header bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Discovering a place",
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

  constructor(props) {

    super(props);

    this.state = {

      // video: videos_list[index],
      index: index,
      get_videos: false,

    };

    // This binding is necessary to make `this` work in the callback
    this.next_video = this.next_video.bind(this);
    this.add_video = this.add_video.bind(this);
    this.back_video = this.back_video.bind(this);

  }

  // Component will mount
  componentWillMount(){

    // Fetch data from server
    fetch('https://touristapi.pythonanywhere.com/videos_location/' + this.props.navigation.state.params.marker.id + '/')
          .then((response) => response.json())
          .then((responseJson) => {

            const videos_list = responseJson;

            // console.log(videos_list);

            // Alert.alert(String(videos_list[0].link));

            this.setState({

              // Get list of json objects
              // Reverse for get the last video uploaded 
              // videos_list: videos_list.reverse(),
              videos_list: videos_list,
              // get_markers: true,
              video: videos_list[index],
              // videos_list_length : videos_list.lenght
              get_videos: true,

            });

            // Alert.alert('get videos variable: ' + String(this.state.get_videos));

          })
          .catch((error) => {
            Alert.alert('Error');
            console.error(String(error));
            Alert.alert('get videos variable: ' + String(this.state.get_videos));
          }); 

  }


  //manage click
  next_video(){

    // Update index
    new_index = this.state.index + 1;


    // if video_index is less than max lenght
    if((new_index + 1) > this.state.videos_list.length){

      // restart index
      new_index = 0;

    }

    // Update info
    this.setState({ 

      index: new_index,
      video: this.state.videos_list[new_index]

    })

  }

  // back video
  back_video(){

    // Update index
    new_index = this.state.index - 1;

    // if video_index is less than 0
    if((new_index ) < 0 ){

      // restart index
      new_index = this.state.videos_list.length - 1;

    }

    // Update info
    this.setState({ 

      index: new_index,
      video: this.state.videos_list[new_index]

    })

  }

  // add video
  add_video(){

    // Alert message for user
    Alert.alert(
      // '¡Pronto!',
      'Soon!',
      // 'Pronto podrás subir tus propios videos a la plataforma',
      'Soon you can upload your videos to the platform',
      [
        // {text: '¡Estaré atento!'},
        {text: 'I will be careful'}
      ],
      { cancelable: false }
    )
    // Next page
    // this.props.navigation.push("Add_Video", {marker: this.props.navigation.state.params.marker});

  }

  // react to video
  react_to_video(){

    // Alert message for user
    Alert.alert(
      // '¡Pronto!',
      'Soon!',
      // 'Pronto podrás reaccionar a los videos!',
      'Soon you can react to the videos!',
      [
        // {text: '¡Estaré atento!'},
        {text: 'I will be careful!'}
      ],
      { cancelable: false }
    )
   
  }


  // Render method
  render() {

    return (

      <View style={styles.container}>

        <Text style = {{fontSize: 40, top: 20, textAlign: 'center', fontWeight: 'normal'}}>

          {this.props.navigation.state.params.marker.name}

        </Text>

        { this.state.get_videos ? 

          <WebView

            javaScriptEnabled={true}
            domStorageEnabled={true}

            source={{ uri: this.state.video.link }}

            style={styles.video}
          />

          :

          <ProgressBarAndroid />

        }

        <View style = {{margin: 10, flex: 1, justifyContent: 'center',alignItems: 'center'}}>

          <View style={{flex: 1, flexDirection: 'row', margin: 10}}>
             
             <Icon
                name="heart"
                size={35}
                color="#3f5fe0"
                type = "font-awesome"
                // iconStyle = {{margin: 0, }}

                iconStyle={{ margin: 10 }}
                onPress={() => this.react_to_video()}
              />
            
              <Icon
                name="comments"
                size={35}
                color="#3f5fe0"
                // color='#fff'
                type = "font-awesome"
                iconStyle = {{margin: 10}}
                onPress={() => this.react_to_video()}
              />
            
          </View>

          <Button

            title="Next video"

            onPress = {this.next_video}

            buttonStyle={styles.buttonStyle}

            icon={
              <Icon
                name="arrow-right"
                size={20}
                color="white"
                type = "font-awesome"
                iconStyle = {{margin: 20}}
              />
            }

            iconRight
            // buttonStyle = {{

            //   backgroundColor: "#3f5fe0",
            //   width: 300,
            //   height: 45,
            //   borderColor: "transparent",
            //   borderWidth: 0,
            //   margin: 30,
            //   borderRadius: 100

            // }}
          
          />

          <Button

            // raised

            title="Last video"

            onPress = {this.back_video}

            buttonStyle={styles.buttonStyle}

            icon={
              <Icon
                name="arrow-left"
                size={20}
                color="white"
                type = "font-awesome"
                iconStyle = {{margin: 20}}
              />
            }
            // buttonStyle = {{

            //   backgroundColor: "#3f5fe0",
            //   width: 300,
            //   height: 45,
            //   borderColor: "transparent",
            //   borderWidth: 0,
            //   margin: 30,
            //   borderRadius: 100

            // }}
          />

          <Button

            // raised

            // title="Subir mi propio video"
            title = 'Upload my video'

            onPress = {this.add_video}

            buttonStyle={styles.buttonStyle}

            icon={
              <Icon
                name="camera"
                size={20}
                color="white"
                type = "font-awesome"
                iconStyle = {{margin: 10}}
              />
            }

            iconRight
            // buttonStyle = {{

            //   backgroundColor: "#3f5fe0",
            //   width: 300,
            //   height: 45,
            //   borderColor: "transparent",
            //   borderWidth: 0,
            //   margin: 30,
            //   borderRadius: 100

            // }}
          />
        </View>

      </View>

    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  video: {
    marginTop: 50,
    maxHeight: 220,
    width: 320,
    flex: 1
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
    margin: 10,
    // borderColor: "red",

  },

});