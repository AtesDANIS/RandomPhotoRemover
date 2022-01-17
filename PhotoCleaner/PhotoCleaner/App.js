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
  Pressable,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import CameraRoll, { deletePhotos, getPhotos } from "@react-native-community/cameraroll";

import RNShake from 'react-native-shake';

import { launchImageLibrary } from 'react-native-image-picker';


const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "Photo Cleaner External Storage Permission",
        message:
          "Photo Cleaner needs access to external storage " +
          "so you can clean them too.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the external storage");
      getAllPhotos();
    } else {
      console.log("External storage permission denied");
    }
  } catch (err) {
    console.warn(err);
  }

};






const App: () => Node = () => {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [randomLoading, setRandomLoading] = useState(false);
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

    setRandomLoading(true)
    // previousRandom = 0;
    let random = 0;

    // while (random === previousRandom) {
    random = Math.floor(Math.random() * images.length)
    // }

    // console.log(random);
    let img = images[random];


    if (Platform.OS === 'android') {
      await Image.getSize(img.uri, (width, height) => {
        img.width = width;
        img.height = height;
      });

    }




    let imageRatio = img.width / img.height

    if (imageRatio > displayRatio) {
      img.width = windowWidth * 90 / 100;
      img.height = img.width / imageRatio;
    }
    else {
      img.height = windowHeight * 88 / 100;
      img.width = img.height * imageRatio;
    }

    setImg(img);
    setRandomLoading(false);

  }

  getRandomImageAndroidExtended = (width, height) => {
    // console.log(width, height);
    // setAndroidImageHeight(height);
    // setAndroidImageWidth(width);
    return [width, height];
  }

  deleteImage = async () => {

    if (images.length > 0) {

      if (Platform.OS === "android") {
        Alert.alert(
          "Confirm",
          "Are you sure want to delete this photo?",
          [
            { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
            { text: "OK", onPress: () => doDelete() }
          ]
        );
      }
      else {
        //ios
        doDelete();
      }

    }
  }

  doDelete = () => {
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

    let getCount = 100000000
    // debugger;

    if (__DEV__) {
      getCount = 10
    }

    CameraRoll.getPhotos({ first: getCount, assetType: 'Photos' })
      .then(({ edges }) => {
        // debugger;
        // if (__DEV__) {
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        //   edges = edges.concat(edges);
        // }

        // debugger;

        setImages(edges.map((edge) => edge.node.image));
        getRandomImage();
        setLoading(false);
      })
  }


  useEffect(() => {
    // debugger;
    if (Platform.OS === 'android') {
      requestCameraPermission();
    }
    else {
      getAllPhotos();
    }


    const subscription = RNShake.addListener(() => {
      deleteImage();
    })

    return () => {
      subscription.remove()
    }


  }, []);



  return (
    <SafeAreaView style={{ flex: 1 }} >
      {loading ?
        <View style={[styles.container, { height: windowHeight / 2 }]}>
          <ActivityIndicator></ActivityIndicator>
          <Text style={styles.loadingText}></Text>
          <Text style={styles.loadingText}>Files are getting ready! It can take a while</Text>
          <Text style={styles.loadingText}>When it loaded you can tap to change photo</Text>
          <Text style={styles.loadingText}>{"<<"}Shake the device to delete photo on the screen{">>"}</Text>
        </View>
        :
        <View style={[styles.container, { height: windowHeight / 2 }]} >

          <Pressable style={{ flex: 50 }} onPress={() => getRandomImage()} >
            <View style={{
              alignSelf: 'center', top: 0, left: 0, position: 'absolute', zIndex: 99,
              borderTopLeftRadius: 5, borderBottomRightRadius: 5, borderTopWidth: 1, borderLeftWidth: 1, borderColor: '#383838',
              backgroundColor: 'white', opacity: 1
            }}>
              <Image source={require('./assets/PhotoCleaner.png')} style={{ width: 80, height: 35, }}></Image>
            </View>
            {randomLoading ?
              <View style={[styles.container, { height: windowHeight / 2 }]}>
                <ActivityIndicator></ActivityIndicator>
                <Text style={styles.loadingText}>Your photos are getting ready!</Text>
              </View>
              :
              <Image
                style={{
                  width: img.width, height: img.height, borderRadius: 5, borderWidth: 1, borderColor: '#383838'
                }}
                source={{ uri: img ? img.uri : defaultUri }}
              />
            }
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.shake2Delete}>{images.length} photos found. Tap to change or shake to delete this photo. It will ask permission</Text>
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
    marginTop: 5,
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
    fontSize: 10,
    color: 'white',
  },
  shake2Delete: {
    color: 'white',
    fontSize: 7
  },
  shake2DeleteDescription: {
    color: 'white',
    fontSize: 9,
    alignSelf: 'center'
  }
});

const lightThemeStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    width: '100%',
    marginTop: 5,

  },
  image: {
    width: '100%',
    height: '50%',
    margin: 10,
  },
  loadingText: {
    color: 'black'
  },
  foundCount: {
    fontSize: 10,
    color: 'black',
  },
  shake2Delete: {
    color: 'black',
    fontSize: 7,
  },
  shake2DeleteDescription: {
    color: 'black',
    fontSize: 9,
    alignSelf: 'center'
  }
});





export default App;