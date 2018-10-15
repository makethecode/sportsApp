package com.sportsapp.protogenesis;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
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
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.pili.pldroid.player.AVOptions;
import com.sportsapp.R;
import com.sportsapp.http.HttpUtilsHttpClient;
import com.sportsapp.news.NewsAdapter;
import com.sportsapp.news.NewsBean;
import com.sportsapp.news.NewsTestActivity;
import com.sportsapp.plsteam.HttpTestActivity;
import com.sportsapp.plsteam.PLVideoViewActivity;
import com.sportsapp.plsteam.SWCameraStreamingActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class Bridge extends ReactContextBaseJavaModule {

    static int invokeCount=0;
    private ReactContext reactContext;
    public List<NewsBean> newsList = new ArrayList();
    public WritableArray list = Arguments.createArray();
    WritableMap res = Arguments.createMap();

    public Bridge(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        //activity的react环境搭建，用来与js端交互
        PLVideoViewActivity.reactContext = reactContext;
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            //activity结束时向rn进行回调
                WritableMap writableMap = new WritableNativeMap();
                writableMap.putString("key", "123");
                sendTransMisson(reactContext, "closeLiveHome", writableMap);
        }
    };

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
    public void playVideo(String playUrl,Integer liveId,Integer personId){
        //内部访问数据库
        Intent intent=new Intent();
        intent.setClass(getCurrentActivity(), PLVideoViewActivity.class);
        //播放地址，默认播放source1的地址：rtmp://pili-live-rtmp.sportshot.cn/sportshot/source1
        intent.putExtra("videoPath", playUrl);
        intent.putExtra("liveId", liveId);
        intent.putExtra("personId", personId);

        getCurrentActivity().startActivity(intent);

        //测试访问服务端
//        Intent intent = new Intent();
//        intent.setClass(getCurrentActivity(), HttpTestActivity.class);
//
//        getCurrentActivity().startActivity(intent);

    }

    @ReactMethod
    public void getNews(){
//        //制作网易新闻activity
//        Intent intent = new Intent();
//        intent.setClass(getCurrentActivity(), NewsTestActivity.class);
//        getCurrentActivity().startActivity(intent);

        //获取网易新闻
        new Thread(new Runnable() {
            @Override
            public void run() {
                String url = "http://c.3g.163.com/nc/article/list/T1348649079062/0-10.html";
                Map<String, String> params = new HashMap<String, String>();
                //请求，返回json
                String result = HttpUtilsHttpClient.getRequest(url);
                Message msg = new Message();
                Bundle data = new Bundle();
                data.putString("result", result);
                msg.setData(data);
                hander.sendMessage(msg);
            }

            Handler hander = new Handler() {
                @Override
                public void handleMessage(Message msg) {

                    Bundle data = msg.getData();
                    String jsonStr = data.getString("result");//得到json返回的json数据(json格式)
                    String newsKey = "T1348649079062";   //体育类新闻编号

                    try {
                        JSONObject obj = new JSONObject(jsonStr);
                        JSONArray array = obj.getJSONArray(newsKey);

                        for (int i = 0; i < array.length(); i++) {
                            JSONObject json = (JSONObject) array.get(i);
                            String title = (String) json.get("title");
                            String imgsrc = (String) json.get("imgsrc");
                            String ptime = (String) json.get("ptime");
                            String docid = (String) json.get("docid");

                            WritableMap params = Arguments.createMap();
                            params.putString("title",title);
                            params.putString("imgsrc",imgsrc);
                            params.putString("ptime",ptime);
                            params.putString("docid",docid);

                            list.pushMap(params);
                        }

                        res.putArray("result",list);

                        sendTransMisson(reactContext,"news",res);

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            };
        }).start();
    }

}
