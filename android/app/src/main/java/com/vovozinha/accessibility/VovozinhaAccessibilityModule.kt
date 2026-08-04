package com.vovozinha.accessibility

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class VovozinhaAccessibilityModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "VovozinhaAccessibility"

    private fun service() = VovozinhaAccessibilityService.instance

    @ReactMethod
    fun clickByText(texts: ReadableArray, promise: Promise) {
        val list = (0 until texts.size()).map { texts.getString(it) ?: "" }
        val result = service()?.clickByText(list) ?: false
        promise.resolve(result)
    }

    @ReactMethod
    fun clickClose(promise: Promise) {
        promise.resolve(service()?.clickClose() ?: false)
    }

    @ReactMethod
    fun scroll(direction: String, promise: Promise) {
        service()?.scroll(direction)
        promise.resolve(true)
    }

    @ReactMethod
    fun pressBack(promise: Promise) {
        service()?.pressBack()
        promise.resolve(true)
    }

    @ReactMethod
    fun pressHome(promise: Promise) {
        service()?.pressHome()
        promise.resolve(true)
    }

    @ReactMethod
    fun clickPlayPause(promise: Promise) {
        promise.resolve(service()?.clickPlayPause() ?: false)
    }

    @ReactMethod
    fun seekBackward(promise: Promise) {
        promise.resolve(service()?.seekBackward() ?: false)
    }

    @ReactMethod
    fun seekForward(promise: Promise) {
        promise.resolve(service()?.seekForward() ?: false)
    }

    @ReactMethod
    fun getVideoTitles(promise: Promise) {
        val titles = service()?.getVideoTitles() ?: emptyList()
        val arr = Arguments.createArray()
        titles.forEach { arr.pushString(it) }
        promise.resolve(arr)
    }

    @ReactMethod
    fun clickVideoByIndex(index: Int, promise: Promise) {
        promise.resolve(service()?.clickVideoByIndex(index) ?: false)
    }
}
