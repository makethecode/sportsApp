package com.sportsapp.plsteam;

import android.app.Activity;
import android.os.Bundle;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;
import com.sportsapp.R;
import com.sportsapp.http.HttpUtilsHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import android.os.Handler;

public class HttpTestActivity extends Activity{

    Button http_btn;

    //用来处理每3秒传来数据的Handler
    private Handler mHandler;
    private Timer timer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_http_test);

        http_btn = (Button)this.findViewById(R.id.http_btn);
        http_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                updateDamakuPerTimeTest();
            }
        });
    }

    void httpTest(){

        //测试安卓原生访问服务端
        new Thread(new Runnable() {
            @Override
            public void run() {
                String url= HttpUtilsHttpClient.BASE_URL+"/func/allow/httpTest";
                Map<String ,String > params = new HashMap<String, String>();
                params.put("name","Chenhaiyun");
                params.put("password","123");
                //请求，返回json
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
                    String key = data.getString("result");//得到json返回的json数据
                    Toast.makeText(HttpTestActivity.this,key,Toast.LENGTH_LONG).show();
                    try {
                        JSONObject json= new JSONObject(key);
                        String result = (String) json.get("result");

                        if ("success".equals(result)){
                            http_btn.setText("登录成功");
                            Toast.makeText(HttpTestActivity.this,"登录成功",Toast.LENGTH_LONG).show();
                        }else if("error".equals(result)){
                            http_btn.setText("登录失败");
                            Toast.makeText(HttpTestActivity.this,"登录失败",Toast.LENGTH_LONG).show();
                        }

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            };
        }).start();

    }

    void updateDamakuPerTimeTest(){

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

        //将更新的弹幕list形成新的弹幕发送出去

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
                    Toast.makeText(HttpTestActivity.this,key,Toast.LENGTH_LONG).show();
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
                        }
                    } catch (JSONException e) {
                        Log.e("err", "handleMessage: "+e.getMessage());
                    }
                }
            };
        }).start();

    }

    @Override
    protected void onDestroy() {
        //结束定时器
        timer.cancel();
        super.onDestroy();
    }
}
