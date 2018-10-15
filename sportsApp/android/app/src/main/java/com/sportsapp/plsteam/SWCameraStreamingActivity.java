package com.sportsapp.plsteam;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.hardware.Camera;
import android.opengl.GLSurfaceView;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.qiniu.pili.droid.streaming.AVCodecType;
import com.qiniu.pili.droid.streaming.CameraStreamingSetting;
import com.qiniu.pili.droid.streaming.MediaStreamingManager;
import com.qiniu.pili.droid.streaming.StreamingProfile;
import com.qiniu.pili.droid.streaming.StreamingState;
import com.qiniu.pili.droid.streaming.StreamingStateChangedListener;
import com.qiniu.pili.droid.streaming.widget.AspectFrameLayout;
import com.sportsapp.R;
import com.sportsapp.http.HttpUtilsHttpClient;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import master.flame.danmaku.controller.DrawHandler;
import master.flame.danmaku.controller.IDanmakuView;
import master.flame.danmaku.danmaku.loader.ILoader;
import master.flame.danmaku.danmaku.loader.IllegalDataException;
import master.flame.danmaku.danmaku.loader.android.DanmakuLoaderFactory;
import master.flame.danmaku.danmaku.model.BaseDanmaku;
import master.flame.danmaku.danmaku.model.DanmakuTimer;
import master.flame.danmaku.danmaku.model.IDisplayer;
import master.flame.danmaku.danmaku.model.android.DanmakuContext;
import master.flame.danmaku.danmaku.model.android.Danmakus;
import master.flame.danmaku.danmaku.parser.BaseDanmakuParser;
import master.flame.danmaku.danmaku.parser.IDataSource;


public class SWCameraStreamingActivity extends Activity implements  StreamingStateChangedListener {

    private static final String TAG = SWCameraStreamingActivity.class.getSimpleName();

    //主播UI
    private JSONObject mJSONObject;
    private MediaStreamingManager mMediaStreamingManager;
    private StreamingProfile mProfile;
    private ImageView playBtn;
    private String url;
    private AspectFrameLayout afl;
    private GLSurfaceView glSurfaceView;
    private AlertDialog alertDialog;

    private Boolean isPlay = true;

    //弹幕UI
    private static final int MAX_COUNT = 30;
    protected DanmakuContext mDanmakuContext = null;
    protected IDanmakuView mDanmakuView ;
    protected BaseDanmakuParser mParser = null;

    //用来处理每3秒传来数据的Handler
    private Handler mHandler;
    private Timer timer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        setContentView(R.layout.activity_swcamera_streaming);

        //获取直播配置的值
        url= getIntent().getStringExtra("url");
        if(url==null||url.equals(""))
            finish();

        //初始化主播界面
        playBtn = (ImageView) findViewById(R.id.playBtn);
        afl = (AspectFrameLayout) findViewById(R.id.cameraPreview_afl);
        glSurfaceView = (GLSurfaceView) findViewById(R.id.cameraPreview_surfaceView);
        initStreamView();

        //初始化弹幕界面（弹幕删除发送弹幕功能）
        mDanmakuView = (IDanmakuView) findViewById(R.id.danmaku_view_stream);
        initDanmakuView();

        //每隔3秒访问danmaku数据库，显示3秒前到目前为止的弹幕
        updateDamakuPerTime();
    }

    public void initStreamView(){
        alertDialog = new AlertDialog.Builder(this)
                .setTitle("直播已结束")
                .setMessage("是否退出直播")
                .setPositiveButton("确定", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //setResult(1);
                        //调用Bridge中onActivityResult（）
                        SWCameraStreamingActivity.this.finish();
                    }
                })

                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                    }
                }) .create();

        playBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if(isPlay){
                    //终止直播
                    mMediaStreamingManager.stopStreaming();
                    glSurfaceView.onPause();
                    alertDialog.show();
                }
            }
        });

        afl.setShowMode(AspectFrameLayout.SHOW_MODE.REAL);
        try {

            mProfile = new StreamingProfile();
            mProfile.setVideoQuality(StreamingProfile.VIDEO_QUALITY_HIGH1)
                    .setAudioQuality(StreamingProfile.AUDIO_QUALITY_MEDIUM1)
                    .setEncodingSizeLevel(StreamingProfile.VIDEO_ENCODING_HEIGHT_480)
                    .setEncoderRCMode(StreamingProfile.EncoderRCModes.QUALITY_PRIORITY)
                    .setPublishUrl(url);

            //摄像头参数配置
            CameraStreamingSetting setting = new CameraStreamingSetting();
            setting.setCameraId(Camera.CameraInfo.CAMERA_FACING_BACK)
                    .setContinuousFocusModeEnabled(true)
                    .setCameraPrvSizeLevel(CameraStreamingSetting.PREVIEW_SIZE_LEVEL.LARGE)
                    .setCameraPrvSizeRatio(CameraStreamingSetting.PREVIEW_SIZE_RATIO.RATIO_16_9);

            mMediaStreamingManager = new MediaStreamingManager(this, afl, glSurfaceView, AVCodecType.SW_VIDEO_WITH_SW_AUDIO_CODEC);  // soft codec
            mMediaStreamingManager.prepare(setting, mProfile);
            mMediaStreamingManager.setStreamingStateListener(this);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void initDanmakuView(){

            mDanmakuContext = DanmakuContext.create();
            HashMap<Integer, Integer> maxLine = new HashMap<>();
            maxLine.put(BaseDanmaku.TYPE_SCROLL_RL, 3);// 滚动弹幕最大显示3行
            // 设置是否禁止重叠
            HashMap<Integer, Boolean> overlappingEnablePair = new HashMap<Integer, Boolean>();
            overlappingEnablePair.put(BaseDanmaku.TYPE_SCROLL_RL, true);
            overlappingEnablePair.put(BaseDanmaku.TYPE_FIX_TOP, true);
            mDanmakuContext.setDanmakuStyle(IDisplayer.DANMAKU_STYLE_STROKEN, 3)//设置描边样式
                    .setDuplicateMergingEnabled(false)//是否启用合并重复弹幕
                    .setScrollSpeedFactor(1.2f) //设置弹幕滚动速度系数,只对滚动弹幕有效
                    .setScaleTextSize(1.2f)//设置字体缩放
                    .setMaximumLines(maxLine)//设置最大显示行数
                    .preventOverlapping(overlappingEnablePair);//设置防弹幕重叠
            if (mDanmakuView != null) {
                mDanmakuView.setCallback(new DrawHandler.Callback() {
                    @Override
                    public void prepared() {
                        //开始播放弹幕
                        mDanmakuView.start();
                    }

                    @Override
                    public void updateTimer(DanmakuTimer timer) {

                    }

                    @Override
                    public void danmakuShown(BaseDanmaku danmaku) {

                    }

                    @Override
                    public void drawingFinished() {

                    }
                });

                mParser = createParser(null);
                mDanmakuView.showFPS(false);//显示fps
                mDanmakuView.enableDanmakuDrawingCache(true);//显示弹幕绘制缓冲
                mDanmakuView.prepare(mParser, mDanmakuContext);
            }
    }

    public void updateDamakuPerTime(){

        //使用handler处理接收到的消息
        mHandler = new Handler(){
            @Override
            public void handleMessage(Message msg) {
                if(msg.what == 0){
                    /**
                     * 在这里写我们需要一直重复执行的代码
                     **/
                    getDanmaku();
//                    Log.e(TAG, "handleMessage: 3秒一次");
                }
            }
        };

        //每隔3秒访问弹幕数据库，返回更新的弹幕list（返回更新的弹幕List=3秒之内的弹幕）
        timer=new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                // (1) 使用handler发送消息
                Message message=new Message();
                message.what=0;
                mHandler.sendMessage(message);
            }
        },0,3000);

    }

    void getDanmaku(){

        //测试安卓原生访问服务端
        new Thread(new Runnable() {
            @Override
            public void run() {
                String url= HttpUtilsHttpClient.BASE_URL+"/func/allow/getNewDanmaku";
                //请求，返回json
                Map<String ,String > params = new HashMap<String, String>();
                params.put("name","Chenhaiyun");
                params.put("password","123");
                String result = HttpUtilsHttpClient.postRequest(url, params);
                Message msg = new Message();
                Bundle data=new Bundle();
                data.putString("result",result);
                msg.setData(data);
                hander.sendMessage(msg);
            }

            Handler hander = new Handler(){
                @Override
                public void handleMessage(Message msg) {

                    Bundle data = msg.getData();
                    String key = data.getString("result");//得到json返回的json数据(json格式)
//                    Toast.makeText(PLVideoViewActivity.this,key,Toast.LENGTH_LONG).show();
                    try {
                        JSONObject js= new JSONObject(key);
                        JSONArray array = js.getJSONArray("result");
                        for (int i = 0; i < array.length(); i++) {
                            JSONObject json = array.getJSONObject(i);
                            int id = json.getInt("id");
                            String text = json.getString("text");
                            String createTime = json.getString("createTime");
                            int liveId = json.getInt("liveId");
                            int personId = json.getInt("personId");

                            addDanmaku(true,text,false);
                        }

                    } catch (JSONException e) {
                        Log.e("err", "handleMessage: "+e.getMessage());
                    }
                }
            };
        }).start();

    }

    //创建解析器对象，解析输入流
    private BaseDanmakuParser createParser(InputStream stream) {

        if (stream == null) {
            return new BaseDanmakuParser() {

                @Override
                protected Danmakus parse() {
                    return new Danmakus();
                }
            };
        }

        //DanmakuLoaderFactory.create(DanmakuLoaderFactory.TAG_BILI) xml解析
        //DanmakuLoaderFactory.create(DanmakuLoaderFactory.TAG_ACFUN) json文件格式解析

        ILoader loader = DanmakuLoaderFactory.create(DanmakuLoaderFactory.TAG_BILI);

        try {
            loader.load(stream);
        } catch (IllegalDataException e) {
            e.printStackTrace();
        }
        BaseDanmakuParser parser = new BiliDanmukuParser();
        IDataSource<?> dataSource = loader.getDataSource();
        parser.load(dataSource);
        return parser;

    }

    /**
     * 添加弹幕
     */
    public void addDanmaku(boolean islive, String msg, boolean isUs) {
        BaseDanmaku danmaku = mDanmakuContext.mDanmakuFactory.createDanmaku(BaseDanmaku.TYPE_SCROLL_RL);
        if (danmaku == null || mDanmakuView == null) {
            return;
        }
        danmaku.text = msg;//弹幕内容
        danmaku.padding = 5;
        danmaku.priority = 1;//0 表示可能会被各种过滤器过滤并隐藏显示 1 表示一定会显示, 一般用于本机发送的弹幕
        danmaku.isLive = islive; //是否是直播弹幕
        danmaku.setTime(mDanmakuView.getCurrentTime() + 1200); //显示时间
        danmaku.textSize = 18f * (mParser.getDisplayer().getDensity() - 0.6f); //字体大小
        danmaku.textColor = Color.WHITE;
        danmaku.textShadowColor = Color.parseColor("#333333");// 阴影颜色，可防止白色字体在白色背景下不可见
        if (isUs)
            danmaku.borderColor = Color.YELLOW; //对于自己发送的弹幕可以加框显示,0表示无边框
        mDanmakuView.addDanmaku(danmaku);

    }

    @Override
    protected void onResume() {
        super.onResume();
        if(mMediaStreamingManager!=null)
        mMediaStreamingManager.resume();

        if (mDanmakuView != null && mDanmakuView.isPrepared() && mDanmakuView.isPaused()) {
            mDanmakuView.resume();
        }
    }
    @Override
    protected void onPause() {
        super.onPause();
        // You must invoke pause here.
        if(mMediaStreamingManager!=null)
        mMediaStreamingManager.pause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mDanmakuView != null) {
            // 释放资源
            mDanmakuView.release();
            mDanmakuView = null;
        }
        timer.cancel();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        if (mDanmakuView != null) {
            // 释放资源
            mDanmakuView.release();
            mDanmakuView = null;
        }
    }

    @Override
    public void onStateChanged(StreamingState streamingState, Object extra) {
        switch (streamingState) {
            case PREPARING:
                break;
            case READY:
                // start streaming when READY
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        if (mMediaStreamingManager != null) {
                            mMediaStreamingManager.startStreaming();
                        }
                    }
                }).start();
                break;
            case CONNECTING:
                break;
            case STREAMING:
                // The av packet had been sent.
                break;
            case SHUTDOWN:
                // The streaming had been finished.
                break;
            case IOERROR:
                // Network connect error.
                break;
            case OPEN_CAMERA_FAIL:
                // Failed to open camera.
                break;
            case DISCONNECTED:
                // The socket is broken while streaming
                break;
        }
    }

}
