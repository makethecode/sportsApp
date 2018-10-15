package com.sportsapp.http;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.HttpParams;
import org.apache.http.util.EntityUtils;

/**
 * Created by chenhaiyun on 2018/10/10.
 */

public class HttpUtilsHttpClient {
    //1.创建HttpClient对象
    public static HttpClient httpClient = getThreadSafeClient();//获得httpclient线程安全。
    public static DefaultHttpClient getThreadSafeClient() {
    //Android异常： java.lang.IllegalStateException
//  原因：
//  1.单线程一次执行一个请求可以正常执行，如果使用多线程，同时执行多个请求时就会出现连接超时
//  2.HttpConnection没有连接池的概念，多少次请求就会建立多少个IO，在访问量巨大的情况下服务器的IO可能会耗尽
//  3.通常是因为HttpClient访问单一实例的不同的线程或未关闭InputStream的httpresponse
//  解决方案：获得httpclient线程安全

        DefaultHttpClient client = new DefaultHttpClient();
        ClientConnectionManager mgr = client.getConnectionManager();
        HttpParams params = client.getParams();
        client = new DefaultHttpClient(new ThreadSafeClientConnManager(params,
                mgr.getSchemeRegistry()), params);
        return client;
    }


    public static String BASE_URL= "http://192.168.1.138:8080/badmintonhot";

    /**
     * GET方式
     * @param url
     * @return
     */
    public static String getRequest(String url){
        String result  = "";

        //2.创建HttpGet对象
        HttpGet httpGet= new HttpGet(url);
        try {
            //3.发送Get请求
            HttpResponse response = httpClient.execute(httpGet);
            if (response.getStatusLine().getStatusCode() == 200){
                //4.获取服务器返回的数据
                HttpEntity entity = response.getEntity();
                result  = EntityUtils.toString(entity);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return result ;
    }

    //http发送post请求
    public static String postRequest(String url,Map<String,String> params){
        String result = "";

        HttpPost httpPost = new HttpPost(url);

        List<NameValuePair> parameters = new ArrayList<>();
        for (Map.Entry<String,String>  entry: params.entrySet()) {
            NameValuePair pair = new BasicNameValuePair(entry.getKey(),entry.getValue());
            parameters.add(pair);
        }
        try {
            httpPost.setEntity(new UrlEncodedFormEntity(parameters,"UTF-8"));

            httpClient.getParams().setParameter("http.protocol.content-charset", "UTF-8");
            HttpResponse response = httpClient.execute(httpPost);
            if (response.getStatusLine().getStatusCode() == 200){
                //4.获取服务器返回的数据
                HttpEntity entity = response.getEntity();
                result = EntityUtils.toString(entity);
            }
        }catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    //http获取网络图片
    public static byte[] getImageBitmap(String url) {
        HttpGet httpget = new HttpGet(url);
        try {
            HttpResponse resp = httpClient.execute(httpget);
            // 判断是否正确执行
            if (HttpStatus.SC_OK == resp.getStatusLine().getStatusCode()) {
                // 将返回内容转换为bitmap
                HttpEntity entity = resp.getEntity();
                byte[] data = EntityUtils.toByteArray(entity);

                return data;
            }

        } catch (Exception e) {
        }

        return null;
    }

}
