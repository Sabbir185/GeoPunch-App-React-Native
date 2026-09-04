# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# React Native SVG
-keep class com.horcrux.svg.** { *; }

# React Native Maps
-keep class com.rnmaps.** { *; }

# React Native WebView
-keep class com.reactnativecommunity.webview.** { *; }

# React Native Async Storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Expo modules
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**
