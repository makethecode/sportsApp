package com.sportsapp.news;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.sportsapp.R;
import com.sportsapp.http.HttpUtilsHttpClient;
import com.sportsapp.plsteam.HttpTestActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by danding on 2018/10/12.
 */

public class NewsAdapter extends BaseAdapter {

    List<NewsBean> list;
    Context context;
    NewsBean newsBean;
    Bitmap bitmap;

    ImageView item_img_icon;
    TextView item_tv_time;
    TextView item_tv_title;

    public NewsAdapter(List list, Context context) {
        this.list = list;
        this.context = context;
    }

    @Override
    public int getCount() {
        return list.size();
    }

    @Override
    public Object getItem(int position) {
        return list.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        //模板
        View view = null;
        if(convertView != null){
            view = convertView;
        }else {
            view = View.inflate(context, R.layout.item_news_layout, null);
        }

        item_img_icon = (ImageView) view.findViewById(R.id.item_img_icon);
        item_tv_time = (TextView) view.findViewById(R.id.item_tv_time);
        item_tv_title = (TextView) view.findViewById(R.id.item_tv_title);

        newsBean = list.get(position);

        //不能在主线程里加载网络图片，否则会报android.os.NetworkOnMainThreadException
        //测试安卓原生访问服务端
        new Thread(new Runnable() {
            @Override
            public void run() {
                String url= newsBean.imgsrc;
                //请求，返回json
                Map<String ,String > params = new HashMap<String, String>();
                byte[] get_data = HttpUtilsHttpClient.getImageBitmap(url);
                Message msg = new Message();
                Bundle data=new Bundle();
                data.putByteArray("result",get_data);
                msg.setData(data);
                hander.sendMessage(msg);
            }

            Handler hander = new Handler(){
                @Override
                public void handleMessage(Message msg) {

                    Bundle data = msg.getData();
                    byte[] get_data = data.getByteArray("result");
                    bitmap = BitmapFactory.decodeByteArray(get_data, 0,
                            get_data.length);

                    item_img_icon.setImageBitmap(bitmap);//设置imageView的图片
                    item_tv_title.setText(newsBean.title);
                    item_tv_time.setText(newsBean.ptime);

                }
            };
        }).start();

        return view;
    }
}
