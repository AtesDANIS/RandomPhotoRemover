/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useLayoutEffect } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Image,
  useWindowDimensions,
  Alert,
} from 'react-native';


import { launchImageLibrary } from 'react-native-image-picker';
var RNFS = require('react-native-fs');








const App: () => Node = () => {
  const [fileUri, setFileUri] = useState('/assets/galeryImages.jpg');
  const [imageRatio, setImageRatio] = useState(1);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  function renderFileUri() {
    // console.log(fileUri)
    return <Image
      source={{ uri: fileUri }}
      style={{
        width: '90%',
        height: windowWidth / imageRatio * 90 / 100
      }}
    // style={styles.images}
    />
  }

  function deleteFile() {
    Alert.alert(
      "Your image will be deleted!",
      "Are you sure?",
      [
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          style: "destructive",
          text: "Delete",
          onPress: () => {
            let fileUriBackup = fileUri;

            RNFS.exists(fileUriBackup)
              .then((result) => {
                console.log("file exists: ", result);

                // console.log("once ",fileUriBackup);
                // setFileUri("/assets/galeryImages.jpg");
                // console.log("sonra ",fileUriBackup);

                RNFS.unlink(fileUriBackup).then(() => {

                  console.log('FILE DELETED');

                  RNFS.exists(fileUriBackup)
                    .then((result) => {
                      console.log("double checked: ", result);
                    });

                }).catch((err) => {
                  console.log(err.message);
                });
              })
          }

        }
      ]
    )
  }


  function getPhoto() {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        // user cancel image selection
      } else if (response.error) {
        // error
      } else {
        console.log(response);
        setImageRatio(response.assets[0].width / response.assets[0].height)
        setFileUri(response.assets[0].uri);
      }
    });
  }

  // useEffect(() => {
  //   getPhoto();
  // }, []);

  return (
    <SafeAreaView >
      <View style={{ marginTop: 50 }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between'
        }}>
          <Button title='Fetch another' onPress={() => getPhoto()} ></Button>
          <Button title='Delete' onPress={() => deleteFile()} ></Button>
        </View>
        <View style={{ alignItems: 'center' }}>
          {renderFileUri()}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  images: {
    width: '100%',
    height: '100%'
    // height: useWindowDimensions().width,
    // resizeMode: 'cover',
  },

});

export default App;
