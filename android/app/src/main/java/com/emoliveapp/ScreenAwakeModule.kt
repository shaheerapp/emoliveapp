package com.meow

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.view.WindowManager

class ScreenAwakeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
   
    override fun getName(): String = "ScreenAwake"

    @ReactMethod
    fun keepAwake(enabled: Boolean) {
        currentActivity?.runOnUiThread {
            val window = currentActivity?.window
            if (enabled) {
                window?.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            } else {
                window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            }
        }
    }
    
    @ReactMethod
    fun testString(): String {
        return "Hello world native module"

    }

}