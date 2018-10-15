package com.sportsapp.news;

/**
 * Created by danding on 2018/10/12.
 */

public class NewsBean {
    public String imgsrc;
    public String title;
    public String ptime;
    public String docid;

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public String getImgsrc() {
        return imgsrc;
    }

    public String getPtime() {
        return ptime;
    }

    public void setImgsrc(String imgsrc) {
        this.imgsrc = imgsrc;
    }

    public void setPtime(String ptime) {
        this.ptime = ptime;
    }

    public String getDocid() {
        return docid;
    }

    public void setDocid(String docid) {
        this.docid = docid;
    }
}
