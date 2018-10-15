package com.sportsapp.news;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.ListView;
import android.widget.Toast;

import com.sportsapp.R;
import com.sportsapp.http.HttpUtilsHttpClient;
import com.sportsapp.plsteam.HttpTestActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NewsTestActivity extends Activity{

    ListView listView;
    Context mContext;
    List<NewsBean> newsList = new ArrayList<>();
    NewsAdapter newsAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = this;
        setContentView(R.layout.activity_news_test);
        listView = (ListView)findViewById(R.id.news_list);

        //从网易新闻接口获取新闻数据，封装到List<NewsBean>
        getNewsList();
    }

    public void getNewsList() {
        //安卓访问服务端获取新闻Json
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

                            NewsBean newsBean = new NewsBean();
                            newsBean.setImgsrc(imgsrc);
                            newsBean.setPtime(ptime);
                            newsBean.setTitle(title);
                            newsBean.setDocid(docid);

                            newsList.add(newsBean);
                        }

                        //创建adapter并封装List
                        newsAdapter = new NewsAdapter(newsList,mContext);

                        //将adapter给listView
                        listView.setAdapter(newsAdapter);

                    } catch (JSONException e) {
                        e.printStackTrace();
                        Log.e("chy2",e.getMessage());
                    }
                }
            };
        }).start();


    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
