import 'react-native';

export interface CustomModuleInterface {
  setBrightnessLevel: (brightnessLevel: number) => void;
  initAccSensor: () => void;
  initLightSensor: () => void;
  getBrightnessLevel: () => Promise<number>;
  getSystemBrightnessLevel: () => Promise<number>;
}

// and extend them!
declare module 'react-native' {
  interface NativeModulesStatic {
    CustomModule: CustomModuleInterface;
  }
}
