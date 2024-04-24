//
//  CustomModule.m
//  RNBridging
//
//  Created by Anil Prajapati on 10/04/24.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"
@interface RCT_EXTERN_MODULE(CustomModule, RCTEventEmitter)

RCT_EXTERN_METHOD(getBrightnessLevel: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
RCT_EXTERN_METHOD(initAccSensor)
RCT_EXTERN_METHOD(supportedEvents)
RCT_EXTERN_METHOD(setBrightnessLevel:(CGFloat) value)
@end
