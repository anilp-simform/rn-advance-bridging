/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Slider from '@react-native-community/slider';
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const Button = ({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [brightness, setBrightness] = useState(0.5);
  const backgroundStyle = {
    flexGrow: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.CustomModule);
    let eventListener = eventEmitter.addListener(
      'onLightSensorChanged',
      event => {
        console.log('onLightSensorChanged', event); // "someValue"
      },
    );
    let eventListener1 = eventEmitter.addListener(
      'onAccSensorChanged',
      event => {
        console.log('onAccSensorChanged', event); // "someValue"
      },
    );

    // Removes the listener once unmounted
    return () => {
      eventListener1.remove();
      eventListener.remove();
    };
  }, []);
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            flex: 1,
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Android Features">
            <View style={{gap: 10}}>
              <Button
                onPress={async () => {
                  const brightness =
                    await NativeModules.CustomModule.getSystemBrightnessLevel();
                  console.log({brightness});
                }}
                title="Fetch System Brightness"
              />

              <Button
                onPress={() => {
                  NativeModules.CustomModule.initLightSensor();
                }}
                title="Init Light Sensor"
              />
            </View>
          </Section>

          <Section title="iOS Features">
            <ReloadInstructions />
          </Section>
          <Section title="Common">
            <View style={{gap: 10}}>
              
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <Slider
                  style={{width: 200, height: 40}}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#00000060"
                  maximumTrackTintColor="#000000"
                  onValueChange={setBrightness}
                  value={brightness}
                />
                <Text>{brightness.toFixed(2)}</Text>
              </View>
              <Button
                onPress={async () => {
                  const brightness =
                    await NativeModules.CustomModule.getBrightnessLevel();
                  console.log({brightness});
                }}
                title="Fetch Brightness"
              />
              <Button
                onPress={async () => {
                  NativeModules.CustomModule.setBrightnessLevel(brightness);
                }}
                title="Set Brightness"
              />

              <Button
                onPress={() => {
                  NativeModules.CustomModule.initAccSensor();
                }}
                title="Init Acc Sensor"
              />
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    height: 45,
    borderWidth: 1,
    borderColor: 'blue',
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
});

export default App;
