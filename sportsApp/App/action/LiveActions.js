
import _ from 'lodash'
import Proxy from '../utils/Proxy'
import PreferenceStore from '../utils/PreferenceStore';
import Config from '../../config';
import {
    RTMP_UPDATE_URL,
    PLAYING_URLS
} from '../constants/LiveConstants';



let updateRtmpUrl = (payload) => {
    return {
        type: RTMP_UPDATE_URL,
        payload
    }
}

export  let updatePlayingUrls = (payload) => {
    return {
        type: PLAYING_URLS,
        payload
    }
}
//获取直播推流
export let getRTMPPushUrl = (personId) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            var state = getState();
            var accessToken = state.user.accessToken;

           // var {time,loginName,title,brief,longbrief}=payload
            Proxy.postes({
                url: Config.server + '/func/allow/getRTMPUrl',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    personId:personId,
                    time:120,
                    hubName:"sportshot",
                    type:"RTMP",
                    hubType:1,
                    streamName:"test",
                    title:"reTest的直播间",
                    brief:"单纯测试",
                    longbrief:"单纯测试1111",

                }
            }).then((json) => {
                dispatch(updateRtmpUrl({ url:json.data }));
                resolve({re:1,json:json.data})
            }).catch((e) => {
                reject(e)
            })
        })
    }
}
//获取直播播流
export let getRTMPPlayUrl = (personId) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {


            Proxy.postes({
                url: Config.server + '/func/allow/getRTMPUrl',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    personId:personId,
                    time:120,
                    hubName:"sportshot",
                    type:"RTMP",
                    hubType:1,
                    streamName:"test",
                    title:"reTest的直播间",
                    brief:"单纯测试",
                    longbrief:"单纯测试1111",

                }
            }).then((json) => {
                dispatch(updateRtmpUrl({ url:json.data }));
                resolve({re:1,json:json.data})
            }).catch((e) => {
                reject(e)
            })
        })
    }
}