//
//  RNEventEmitter.swift
//  RNBridging
//
//  Created by Anil Prajapati on 19/04/24.
//

import Foundation

@objc(RNEventEmitter)
 open class RNEventEmitter: RCTEventEmitter {

    public static var emitter: RCTEventEmitter!

    override init() {
    super.init()
    RNEventEmitter.emitter = self
  }

   open override func supportedEvents() -> [String] {
     ["onLightSensorChanged", "onAccSensorChanged"]      // etc.
   }
}
