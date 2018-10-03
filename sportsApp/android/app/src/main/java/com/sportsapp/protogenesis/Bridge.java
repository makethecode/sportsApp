package com.sportsapp.protogenesis;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.pili.pldroid.player.AVOptions;
import com.sportsapp.R;
import com.sportsapp.plsteam.PLVideoViewActivity;
import com.sportsapp.plsteam.SWCameraStreamingActivity;

import java.text.SimpleDateFormat;


public class Bridge extends ReactContextBaseJavaModule {

    static int invokeCount=0;
    private ReactContext reactContext;

    public Bridge(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            //activity结束时向rn进行回调
                WritableMap writableMap = new WritableNativeMap();
                writableMap.putString("key", "123");
                sendTransMisson(reactContext, "EventName", writableMap);
        }
    };

        /**
         * @param reactContext
         * @param eventName    事件名
         * @param params       传参
         */
        public void sendTransMisson(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);

        }

    @Override
    public String getName() {
        return "Bridge";
    }

    @ReactMethod
    public static void newThread()
    {
        new Thread(new Runnable() {
            @Override
            public void run() {
                Log.v("bridge",invokeCount+++"");
            }
        }).start();
    }

    @ReactMethod
    public void invokeBufferingActivity()
    {
        String url = "http://192.168.0.199:3000/downloadBufferedMp4";
        String remoteUrl="http://139.129.96.231:3000/downloadBufferedMp4";
        Intent intent = new Intent();
        intent.setClass(getCurrentActivity(), BBVideoPlayer.class);
        intent.putExtra("url", remoteUrl);
        intent.putExtra("cache",
                Environment.getExternalStorageDirectory().getAbsolutePath()
                        + "/VideoCache/" + System.currentTimeMillis() + ".mp4");
        getCurrentActivity().startActivityForResult(intent,1);
    }

    @ReactMethod
    public void raisePLStream(String url,Promise promise)
    {
        //原生模块与rn的交互
//        WritableMap map = Arguments.createMap();
//        map.putString("name","chy");
//        map.putString("age","18");
//        promise.resolve(map);

//        WritableMap writableMap = new WritableNativeMap();
//        writableMap.putString("key", "123");
//        sendTransMisson(reactContext, "EventName", writableMap);

        reactContext.addActivityEventListener(mActivityEventListener);

        Intent intent=new Intent();
        intent.setClass(getCurrentActivity(), SWCameraStreamingActivity.class);
        intent.putExtra("url",url);
        getCurrentActivity().startActivityForResult(intent,1);

    }

    @ReactMethod
    public void playVideo(String url){

        Intent intent=new Intent();
        intent.setClass(getCurrentActivity(), PLVideoViewActivity.class);
        //播放地址，默认播放source1的地址：rtmp://pili-live-rtmp.sportshot.cn/sportshot/source1
        intent.putExtra("videoPath", url);

        //播放配置
        //软解、硬解、自动
        intent.putExtra("mediaCodec", AVOptions.MEDIA_CODEC_AUTO);
        //直播、点播
        intent.putExtra("liveStreaming", 1);
        //离线缓存（点播）
        intent.putExtra("cache", false);
        //循环播放（点播）
        intent.putExtra("loop", false);
        //视频数据回调
        intent.putExtra("video-data-callback", false);
        //音频数据回调
        intent.putExtra("audio-data-callback", false);
        //关闭日志
        intent.putExtra("disable-log", false);

        getCurrentActivity().startActivity(intent);

    }


}
