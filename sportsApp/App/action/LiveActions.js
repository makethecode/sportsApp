
import _ from 'lodash'
import Proxy from '../utils/Proxy'
import PreferenceStore from '../utils/PreferenceStore';
import Config from '../../config';
import {
    RTMP_UPDATE_URL
} from '../constants/LiveConstants';



let updateRtmpUrl = (payload) => {
    return {
        type: RTMP_UPDATE_URL,
        payload
    }
}

//获取直播推流
export let getRTMPPushUrl = () => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;

           // var {time,loginName,title,brief,longbrief}=payload
            Proxy.postes({
                url: Config.server + '/func/allow/testQn',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    time:120,
                    source:"source1",
                    // hubName:"sportshot",
                    // type:"RTMP",
                    // hubType:1,
                    // streamName:"test",
                    // title,
                    // brief,
                    // longbrief,

                }
            }).then((json) => {
                //dispatch(updateRtmpUrl({ url:json.data }));
                resolve(json)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}

//创建直播间
export let createLiveHome = (personId,title,brief,longbrief,rtmppushurl,rtmpplayurl,snapshot) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/func/allow/createLiveHome',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {

                    personId:personId,

                    time:120,
                    source:"source1",
                    hubName:"sportshot",
                    type:"RTMP",
                    hubType:1,
                    streamName:"test",

                    title:title,
                    brief:brief,
                    longbrief:longbrief,
                    rtmppushurl:rtmppushurl,
                    rtmpplayurl:rtmpplayurl,
                    snapshot:snapshot,
                }
            }).then((json) => {
               resolve(json)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}

//结束直播并关闭直播间
export let closeLiveHome = (id) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/func/allow/closeLiveHome',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    id:id
                }
            }).then((json) => {
                resolve(json.data)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}

//创建弹幕
export let adddanmaku = (liveId,text) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/func/allow/addDanMaKu',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    liveId:liveId,
                    text:text,
                }
            }).then((json) => {
                resolve(json.data)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}

