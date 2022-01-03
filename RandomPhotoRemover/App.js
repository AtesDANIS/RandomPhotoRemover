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
} from 'react-native';


import { launchImageLibrary } from 'react-native-image-picker';








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

  function getPhoto() {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        // user cancel image selection
      } else if (response.error) {
        // error
      } else {
        console.log(response);
        setImageRatio(response.assets[0].width / response.assets[0].height )
        setFileUri(response.assets[0].uri);
      }
    });
  }

  // useEffect(() => {
  //   getPhoto();
  // }, []);

  return (
    <SafeAreaView >
      <View style={{ marginTop:50 }}>
        <Button title='Fetch another' onPress={() => getPhoto()} ></Button>
        <View style={{alignItems:'center'}}>
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
