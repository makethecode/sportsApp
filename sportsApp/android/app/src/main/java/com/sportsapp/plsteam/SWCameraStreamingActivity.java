package com.sportsapp.plsteam;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.hardware.Camera;
import android.opengl.GLSurfaceView;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.qiniu.pili.droid.streaming.AVCodecType;
import com.qiniu.pili.droid.streaming.CameraStreamingSetting;
import com.qiniu.pili.droid.streaming.MediaStreamingManager;
import com.qiniu.pili.droid.streaming.StreamingProfile;
import com.qiniu.pili.droid.streaming.StreamingState;
import com.qiniu.pili.droid.streaming.StreamingStateChangedListener;
import com.qiniu.pili.droid.streaming.widget.AspectFrameLayout;
import com.sportsapp.R;
import com.sportsapp.protogenesis.Bridge;


import org.json.JSONObject;


public class SWCameraStreamingActivity extends Activity implements  StreamingStateChangedListener {


    private JSONObject mJSONObject;
    private MediaStreamingManager mMediaStreamingManager;
    private StreamingProfile mProfile;
    private ImageView playBtn;
    private String url;
    private AspectFrameLayout afl;
    private GLSurfaceView glSurfaceView;
    private AlertDialog alertDialog;

    private Boolean isPlay = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_swcamera_streaming);

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

        playBtn = (ImageView) findViewById(R.id.playBtn);
        playBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if(isPlay){
                    //终止直播
                    mMediaStreamingManager.stopStreaming();
                    glSurfaceView.onPause();
                    alertDialog.show();

                }
                else{
                }
            }
        });

        url= getIntent().getStringExtra("url");
        if(url==null||url.equals(""))
            url="rtmp://pili-publish.sportshot.cn/sportshot/danding?e=1509554673&token=2M63A85U1GpU37_hxw6zmCYt7ia0YPIEpOjLeJt5:RA--7XUPfBd72U3FDyipLfYRquw=";

        afl = (AspectFrameLayout) findViewById(R.id.cameraPreview_afl);
        // Decide FULL screen or real size
        afl.setShowMode(AspectFrameLayout.SHOW_MODE.REAL);
        glSurfaceView = (GLSurfaceView) findViewById(R.id.cameraPreview_surfaceView);
        //String streamJsonStrFromServer = getIntent().getStringExtra("stream_json_str");

        try {
            //mJSONObject = new JSONObject(streamJsonStrFromServer);

            //StreamingProfile.Stream stream = new StreamingProfile.Stream(mJSONObject);

            mProfile = new StreamingProfile();
            mProfile.setVideoQuality(StreamingProfile.VIDEO_QUALITY_HIGH1)
                    .setAudioQuality(StreamingProfile.AUDIO_QUALITY_MEDIUM1)
                    .setEncodingSizeLevel(StreamingProfile.VIDEO_ENCODING_HEIGHT_480)
                    .setEncoderRCMode(StreamingProfile.EncoderRCModes.QUALITY_PRIORITY)
                    .setPublishUrl(url);
            //.setStream(stream);  // You can invoke this before startStreaming, but not in initialization phase.

            CameraStreamingSetting setting = new CameraStreamingSetting();
            setting.setCameraId(Camera.CameraInfo.CAMERA_FACING_BACK)
                    .setContinuousFocusModeEnabled(true)
                    .setCameraPrvSizeLevel(CameraStreamingSetting.PREVIEW_SIZE_LEVEL.MEDIUM)
                    .setCameraPrvSizeRatio(CameraStreamingSetting.PREVIEW_SIZE_RATIO.RATIO_4_3);

            mMediaStreamingManager = new MediaStreamingManager(this, afl, glSurfaceView, AVCodecType.SW_VIDEO_WITH_SW_AUDIO_CODEC);  // soft codec
            mMediaStreamingManager.prepare(setting, mProfile);
            mMediaStreamingManager.setStreamingStateListener(this);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    protected void onResume() {
        super.onResume();
        if(mMediaStreamingManager!=null)
        mMediaStreamingManager.resume();
    }
    @Override
    protected void onPause() {
        super.onPause();
        // You must invoke pause here.
        if(mMediaStreamingManager!=null)
        mMediaStreamingManager.pause();
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
