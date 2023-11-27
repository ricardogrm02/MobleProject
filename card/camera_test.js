/* 

# README FIRST

`npm install react-native-vision-camera`
`npx pod-install`

Go [here](https://react-native-vision-camera.com/docs/guides/) and
update the manifests.

The result of a camera shot is a file on the phone. You get the
dimensions and the file path. It is NOT auto-sving it to the gallery
or photo roll -- that's different APIs.

*(Note also that this shows how to display an image file -- could
  be one that you uploaded or retrieved from an API)*

# ***IMPORTANT***

There is no camera on the iOS simulator, so you must use a real device
for testing.

----
*/

import React from 'react';
import {useState, useRef} from 'react';
import {Text, SafeAreaView, StyleSheet, Button, Image} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Camera, useCameraDevice} from 'react-native-vision-camera';

const App = () => {
  const [perm, setPerm] = useState(false);
  const [initialized, setinitialized] = useState(false);
  const [photo, setPhoto] = useState(null);

  const device = useCameraDevice('back');

  const camera = useRef(null);

  if (!initialized) {
    Camera.requestCameraPermission()
      .then(granted => setPerm(granted))
      .catch(e => console.warn(`could not perm: ${e}`));
  }
  if (!perm) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>No permissions</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!device) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>No cam yet</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  const takePhoto = () => {
    if (!initialized) {
      console.log("can't click yet");
      return;
    }

    console.log('click');

    camera.current
      .takePhoto()
      .then(img => {
        // result of a snap is a object that has the file path in it.

        //console.log(JSON.stringify(img, null, 2));
        const asPath = `file://${img.path}`;
        setPhoto(asPath);
      })
      .catch(e => console.warn(`could not takePhoto: ${e}`));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Camera
          ref={camera}
          style={styles.cameraViewfinder}
          device={device}
          isActive={true}
          photo={true}
          onInitialized={() => setinitialized(true)}
        />
        <Button onPress={takePhoto} style={styles.info} title={'Take Photo'} />
        {photo? (
          <Image style={styles.photo} source={{uri: photo}} />
        ) : (
          <Text style={styles.info}>No Photo Yet</Text>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
  cameraViewfinder: {
    flex: 0,
    width: 300,
    height: 300,
  },
  photo: {
    flex: 0,
    width: 300,
    height: 300,
    borderColor: 'green',
    borderWidth: 3,
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black',
    backgroundColor: 'white',
    fontSize: 18,
  },
  info: {
    flex: 0,
    width: 300,
    height: 300,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black',
    backgroundColor: '#cccccc',
    fontSize: 18,
  },
});

export default App;