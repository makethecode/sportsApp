package com.sportsapp;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.theweflex.react.WeChatPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.theweflex.react.WeChatPackage;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.qiniu.pili.droid.streaming.StreamingEnv;
import com.theweflex.react.WeChatPackage;

import cn.jpush.android.api.JPushInterface;
import cn.jpush.reactnativejpush.JPushPackage;
import com.imagepicker.ImagePickerPackage;

import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.beefe.picker.PickerViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.sportsapp.reactPackage.AnExampleReactPackage;
import org.lovebing.reactnative.baidumap.BaiduMapPackage;

import java.util.Arrays;
import java.util.List;
import com.theweflex.react.WeChatPackage;

public class MainApplication extends Application implements ReactApplication {
  private String img;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new WeChatPackage(),
            new RCTCameraPackage(),
            new WeChatPackage(),
            new JPushPackage(false,false),
            new ImagePickerPackage(),
            new RNSensitiveInfoPackage(),
            new PickerViewPackage(),
            new VectorIconsPackage(),
            new ReactVideoPackage(),
              new RNFetchBlobPackage(),
              new BaiduMapPackage(getApplicationContext()),
              new AnExampleReactPackage()

      );
    }

  };


  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener(){

  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    StreamingEnv.init(getApplicationContext());
  }

  public String  getImg(){
    return img;
  }

  public void setImg(String img){
    this.img=img;
  }

}
