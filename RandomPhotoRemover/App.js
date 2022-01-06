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
  ActivityIndicator,
} from 'react-native';

import CameraRoll from "@react-native-community/cameraroll";


import { launchImageLibrary } from 'react-native-image-picker';
var RNFS = require('react-native-fs');



const App: () => Node = () => {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState('{"uri": "/assets/galeryImages.jpg","width":1000,"height":1000}');
  const defaultUri = "/assets/galeryImages.jpg";
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const displayRatio = windowWidth / windowHeight;

  const [images, setImages] = useState({});

  let styles = darkThemeStyles;
  if (colorScheme === 'light') {
    styles = lightThemeStyles;
  }

  getRandomImage = async () => {

    previousRandom = 0;
    let random = 0;

    while (random === previousRandom) {
      random = Math.floor(Math.random() * images.length)
    }

    let img = images[random];

    isPhotoInPortraitMode = true;



    let imageRatio = img.width / img.height




    if (imageRatio > displayRatio) {
      img.width = windowWidth;
      img.height = img.width / imageRatio;
    }
    else {
      img.height = windowHeight - 200;
      img.width = img.height * imageRatio;
    }


    setImg(img);

  }

  deleteImage = async () => {
    CameraRoll.deletePhotos([img.uri])
      .then((data) => {
        console.log('data', data);
        setImages(images.filter(s => s != img));
        console.log(images.length);
        getRandomImage();
      })
      .catch((error) => {
        console.log("rejected ", error.message);
      });
  }


  getAllPhotos = () => {
    CameraRoll.getPhotos({ first: 10000000000, assetType: 'Photos' })
      .then(({ edges }) => {
        setImages(edges.map((edge) => edge.node.image));
        getRandomImage();
        setLoading(false);
      })
  }


  useEffect(() => {
    getAllPhotos();
  }, []);



  return (
    <SafeAreaView style={{ flex: 1 }} >
      {loading ?
        <View style={[styles.container, { height: windowHeight / 2 }]}>
          <ActivityIndicator></ActivityIndicator>
          <Text style={styles.loadingText}>Your photos are getting ready!</Text>
        </View>
        :
        <View style={[styles.container, { height: windowHeight / 2 }]}>
          <Text style={styles.foundCount}>{images.length} photos found</Text>
          <Image
            style={{ width: img.width, height: img.height }}
            // style={{ width: (img.width / (img.height / windowHeight / 2)), height: windowHeight / 2 }}
            // style={{ width: '50%', height: (img.height / (img.width / windowWidth)) / 2 }}
            source={{ uri: img ? img.uri : defaultUri }}
          />
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button title="Delete" onPress={() => deleteImage()} />
            <Button title="Skip" onPress={() => getRandomImage()} />
          </View>

        </View>
      }
    </SafeAreaView>
  );
};





const darkThemeStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    flex: 1,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '50%',
    margin: 10,
  },
  loadingText: {
    color: 'white'
  },
  foundCount: {
    color: 'white'
  }
});

const lightThemeStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '50%',
    margin: 10,
  },
  loadingText: {
    color: 'black'
  },
  foundCount:{
    color: 'black'
  }
});





export default App;






