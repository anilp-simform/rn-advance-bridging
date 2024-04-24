package com.rnbridging

import android.content.Context.SENSOR_SERVICE
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.provider.Settings
import android.widget.Toast
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CustomModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    private lateinit var sm: SensorManager
    private var brightnessSensor: Sensor? = null
    private var accSensor: Sensor? = null
    private var lastValues: ArrayList<Float> = ArrayList()
    private var lastLightValue: Float = 0f
    override fun getName(): String {
        return "CustomModule"
    }

    @ReactMethod
    fun setBrightnessLevel(brightnessLevel: Float) {
        val activity = currentActivity ?: return
        activity.runOnUiThread {
            val lp = activity.window.attributes
            lp.screenBrightness = brightnessLevel
            activity.window.attributes = lp
        }
    }

    @ReactMethod
    fun getBrightnessLevel(promise: Promise) {
        val lp = currentActivity!!.window.attributes
        promise.resolve(lp.screenBrightness)
    }

    @ReactMethod
    fun getSystemBrightnessLevel(promise: Promise) {
        val brightness = Settings.System.getString(currentActivity!!.contentResolver, "screen_brightness")
        promise.resolve(brightness.toInt() / 255f)
    }

    var sel: SensorEventListener = object : SensorEventListener {
        override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
        override fun onSensorChanged(event: SensorEvent) {
            if (event.sensor?.type == Sensor.TYPE_LIGHT) {
                val light = event.values[0]
                if(lastLightValue!=light) {
                    lastLightValue=light
                    reactContext?.getJSModule(ReactContext.RCTDeviceEventEmitter::class.java)?.emit("onLightSensorChanged", light)
                }

            } else if (event.sensor?.type == Sensor.TYPE_ACCELEROMETER) {
                val values: FloatArray = event.values
                val valueX = values[0]
                val valueY = values[1]
                val valueZ = values[2]
                if(lastValues.size==0){
                    lastValues.add(0f)
                    lastValues.add(0f)
                    lastValues.add(0f)
                }
                if(valueX!=0f && valueY!=0f && valueZ!=0f &&
                        (
                                lastValues[0]!=valueX ||
                                lastValues[1]!=valueY ||
                                lastValues[2]!=valueZ
                                )
                        ){
                    lastValues[0]=valueX
                    lastValues[1]=valueY
                    lastValues[2]=valueZ
                val params = Arguments.createMap().apply {
                    putString("x", values[0].toString())
                    putString("y", values[1].toString())
                    putString("z", values[2].toString())
                }
                reactContext?.getJSModule(ReactContext.RCTDeviceEventEmitter::class.java)?.emit("onAccSensorChanged", params)
            }
            }
        }
        }
        @ReactMethod
        fun initAccSensor() {
            val activity = currentActivity ?: return
            /* Get a SensorManager instance */
            sm = activity.getSystemService(SENSOR_SERVICE) as SensorManager
            val list: List<Sensor> = sm.getSensorList(Sensor.TYPE_ACCELEROMETER)
            if (list.isNotEmpty()) {
                accSensor= list[0]
                sm.registerListener(sel, list[0], SensorManager.SENSOR_DELAY_NORMAL)
            } else {
                Toast.makeText(activity, "Error: No Accelerometer.", Toast.LENGTH_LONG).show()
            }

        }

        @ReactMethod
        fun initLightSensor() {
            val activity = currentActivity ?: return
            sm = activity.getSystemService(SENSOR_SERVICE) as SensorManager
            val listLightSensor: List<Sensor> = sm.getSensorList(Sensor.TYPE_LIGHT)

            if (listLightSensor.isNotEmpty()) {
                brightnessSensor=listLightSensor[0]
                sm.registerListener(sel, listLightSensor[0], SensorManager.SENSOR_DELAY_NORMAL)
            } else {
                Toast.makeText(activity, "Error: No Light Sensor.", Toast.LENGTH_LONG).show()
            }
        }
}