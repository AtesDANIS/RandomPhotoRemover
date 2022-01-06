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

var hasNextPage = true;



const App: () => Node = () => {
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState('{"uri": "/assets/galeryImages.jpg","width":1000,"height":1000}');
  const defaultUri = "/assets/galeryImages.jpg";
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const displayRatio = windowWidth / windowHeight;

  const [images, setImages] = useState([]);
  const [totalPics, setTotalPics] = useState(0);






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
        // alert(error.message);
      })

      ;

  }





  getAllPhotos = () => {

    let fetchParams = {
      first: 10000000000,
      assetType: 'Photos',
    }

    if (images.length > 0) {
      // first: 100000000,
      fetchParams.after = images[images.length - 1].uri
    }



    CameraRoll.getPhotos(fetchParams)
      .then(({ edges, page_info }) => {
        debugger;
        // hasNextPage = page_info.has_next_page;

        let response = [];
        response = edges.map((edge) => edge.node.image)

        if (images.length > 0) {
          setImages(images.concat(response));
        }
        else {
          setImages(response);
          getRandomImage();
          setLoading(false);
        }

      })


  }




  useEffect(() => {

    if (hasNextPage) {
      getAllPhotos();
    }


  }, [images]);






  return (
    <SafeAreaView style={{ flex: 1 }} >
      {loading ?
        <View style={[styles.container, { height: windowHeight / 2 }]}>
          <ActivityIndicator></ActivityIndicator>
          <Text style={{ color: 'white' }}>Your images are getting ready!</Text>
        </View>
        :
        <View style={[styles.container, { height: windowHeight / 2 }]}>
          <Text style={{ color: 'white' }}>{images.length} photos found</Text>
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

const styles = StyleSheet.create({
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
  }
});

export default App;







// useLayoutEffect(() => {
//   getAllPhotos();
// });

// getAllPhotos = () => {

//   let fetchParams = {
//     first: 2,
//     assetType: 'Photos',
//   }
//   debugger;
//   if (images.length > 0) {
//     fetchParams.after = images[images.length - 1].uri
//   }

//   CameraRoll.getPhotos(fetchParams)
//     .then(data => {
//       const assets = data.edges;
//       debugger;

//       console.log("response : ", assets.length);
//       console.log("total: ", images.length);


//       if (assets.length > 0) {

//         if (images.length > 0) {
//           setImages(...images, assets.map((asset) => asset.node.image));
//         }
//         else {
//           setImages(assets.map((asset) => asset.node.image));
//         }

//         getAllPhotos();
//       }

//       // getRandomImage();
//       setLoading(false);
//     })
//     .catch(err => console.log)
// }










// if (img.width > img.height) {
    //   isPhotoInPortraitMode = false;
    // }


    // console.log("isPhotoInPortraitMode",isPhotoInPortraitMode);

    // if (isPhotoInPortraitMode) {
    //   console.log("img.width", img.width);
    //   console.log("img.height", img.height);
    //   console.log("windowWidth", windowWidth);
    //   console.log("windowHeight", windowHeight);


    //   // console.log(img.width / (img.height / windowHeight / 2));

    //   // console.log(img.width / (img.height / windowHeight / 2));
    //   img.width = img.width / (img.height / windowHeight / 2);
    //   img.height = windowHeight / 2;
    // }
    // else {
    //   // img.width = windowWidth / 5;
    //   // img.height = img.height / (img.width / windowWidth / 5);
    // }

    
    // if (imageRatio > 1) {
    //   console.log("viewscene");
    //   img.width = windowWidth / 1.5;
    //   img.height = img.width / imageRatio;
    // }
    // else {
    //   console.log("portrait");
    //   img.height = windowHeight / 1.5;
    //   img.width = img.height * imageRatio;
    // }