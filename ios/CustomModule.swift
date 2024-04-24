//
//  CustomModule.swift
//  RNBridging
//
//  Created by Anil Prajapati on 10/04/24.
//

import Foundation
import CoreMotion

@objc(CustomModule)
class CustomModule: RCTEventEmitter {
  @objc override static func requiresMainQueueSetup() -> Bool { return true }
  
  open override func supportedEvents() -> [String] {
    ["onLightSensorChanged", "onAccSensorChanged"]
  }
  
  @objc
  public func increment() {
  
  }
    
  @objc(setBrightnessLevel:)
  public func setBrightnessLevel(_ value: CGFloat) {
    print("setBrightnessLevel",value)
    DispatchQueue.main.async {
      UIScreen.main.brightness = CGFloat(value)
    }
  }
  
  @objc
  public func getBrightnessLevel(
    _ resolve: RCTPromiseResolveBlock,
      rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
      resolve(UIScreen.main.brightness)
    
  }

  @objc
  public func initAccSensor() {
    DispatchQueue.main.async {
      // Create a CMMotionManager instance
      let manager = CMMotionManager()
      manager.startAccelerometerUpdates()
      if(manager.isAccelerometerAvailable){
        // Read the most recent accelerometer value
        let initX = manager.accelerometerData?.acceleration.x
        let inity = manager.accelerometerData?.acceleration.y
        let initz = manager.accelerometerData?.acceleration.z
        print(initX,inity,initz)
        // How frequently to read accelerometer updates, in seconds
        manager.accelerometerUpdateInterval = 0.5
        print("isAccelerometerAvailable")
        // Start accelerometer updates on a specific thread
//        manager.startAccelerometerUpdates(to: .main) { (data, error) in
//          // Handle acceleration update
//          print(data as Any)
//          self.sendEvent(withName: "onAccSensorChanged", body:data);
//        }
        manager.startAccelerometerUpdates(to: OperationQueue()) { data, error in
                    print("Test startAccelerometerUpdates") // no print
          print(data as Any)
                }
      }else {
        print("isAccelerometer NOt Active")
      }
      
      if (manager.isDeviceMotionAvailable) {
        print("isDeviceMotionAvailable")
        manager.deviceMotionUpdateInterval = 0.01
//        manager.showsDeviceMovementDisplay = true
        
        manager.startDeviceMotionUpdates(to: OperationQueue.current!) { deviceManager, error in
                    print("Test startDeviceMotionUpdates") // no print
                }
//        manager.startDeviceMotionUpdates(using: .xMagneticNorthZVertical,
//                                         to: .main, withHandler: { (data, error) in
//          // Make sure the data is valid before accessing it.
//          if let validData = data {
//            // Get the attitude relative to the magnetic north reference frame.
//            let roll = validData.attitude.roll
//            let pitch = validData.attitude.pitch
//            let yaw = validData.attitude.yaw
//            
//            print(validData as Any)
//            // Use the motion data in your app.
//          }
//        })
              }else{
          print("isDeviceMotion not Available")
        }
    }
  }
}
