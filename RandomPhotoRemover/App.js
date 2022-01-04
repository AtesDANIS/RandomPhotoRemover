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
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState('{"uri": "/assets/galeryImages.jpg"}');
  const defaultUri = "/assets/galeryImages.jpg";
  // const windowWidth = useWindowDimensions().width;
  // const windowHeight = useWindowDimensions().height;

  const [images, setImages] = useState({});
  const [totalPics, setTotalPics] = useState(0);






  getRandomImage = async () => {
    let random = Math.floor(Math.random() * images.length)
    setImg(images[random]);
    console.log("collectionsize", images.length);
    console.log("random", random);
    console.log(images[random]);
  }

  getAllPhotos = async () => {

    // const albums = await CameraRoll.getAlbums({ assetType: 'Photos', albumType: 'All' });
    // let count = albums.reduce((total, current) => total + current.count, 0);
    // setTotalPics(count);

    const fetchParams = {
      first: 10000000,
      assetType: 'Photos',
    }

    CameraRoll.getPhotos(fetchParams)
      .then(data => {
        const assets = data.edges
        setImages(assets.map((asset) => asset.node.image))
        setLoading(false);
      })
      .catch(err => console.log)
  }






  // useEffect(() => {
  //   // getAllPhotos();
  //   console.log("totalPics  ", totalPics);
  // }, [totalPics]);


  useLayoutEffect(() => {
    getAllPhotos();
  });




  return (
    <SafeAreaView >
      {loading ?
        <View>
          <ActivityIndicator></ActivityIndicator>
          <Text>Your images are getting ready!</Text>
        </View>
        :
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={{ uri: img ? img.uri : defaultUri}}
          />
          <Button title="Get Random Image from CameraRoll" onPress={() => getRandomImage()} />
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: '100%',
    height: '75%',
    margin: 10,
  }
});

export default App;
