
import _ from 'lodash'
var bluebird = require('bluebird');
import Config from '../../config';
import Proxy from '../utils/Proxy'


import {
    UPDATE_MAP_CENTER,
    ON_VENUE_INFO,
} from '../constants/MapConstants';

import {
    Geolocation
} from 'react-native-baidu-map';

export let updateMapCenter=(center)=>{
    return {
        type:UPDATE_MAP_CENTER,
        payload:{
            center
        }
    }
}

export let getVenueInfo=(payload)=>{
    return {
        type:ON_VENUE_INFO,
        payload:payload
    }
}

export let geocode=(city,address)=>{
    return new Promise((resolve, reject) => {

        Geolocation.geocode(city,address).then((json)=>{
            resolve(json)
        })

    })
}

//本地关键字搜索
export  let localSearch=(center,keyword)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var _center=_.cloneDeep(center);
            _center.latitude=''+_center.latitude;
            _center.longitude=''+_center.longitude;
            Geolocation.localSearchByKeyword(keyword,{lat:_center.latitude,lng:_center.longitude}).then((json)=>{
                if(json.re==1)
                {
                    var statistics={
                        target:json.data.length,
                        count:0,
                        results:[]
                    };
                    var poi2=json.data[4]



                    bluebird.reduce(json.data, ( total,poi,i) => {

                        return geocode(poi.city,poi.address).then(res=>{
                            poi.longitude=res.longitude
                            poi.latitude=res.latitude
                            return i++;
                        });
                    }, 0).then(res => {
                        resolve({
                            re:1,
                            data:json.data
                        })
                    });



                }else{
                    resolve(json);
                }
            }).catch((e)=>{
                reject(e)
            })
        });
    }
}

//获取维护的场馆数据
export let fetchMaintainedVenue=(unitId)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/getMaintainedVenue',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    unitId:unitId
                }
            }).then((json)=>{
                if(json.re==1){
                    dispatch(getVenueInfo({data: json.data}));
                }

                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//获取场馆总收益(课程)
export let fetchVenueCourseProfitByUnitId=(unitId)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/fetchVenueCourseProfitByUnitId',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    unitId:unitId
                }
            }).then((json)=>{
                if(json.re==1){
                }
                //resolve用来返回参数
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//获取场馆总收益(活动)
export let fetchVenueEventProfitByUnitId=(unitId)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/fetchVenueEventProfitByUnitId',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    unitId:unitId
                }
            }).then((json)=>{
                if(json.re==1){
                }
                //resolve用来返回参数
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}


//根据所属俱乐部获取场馆
export let fetchVenueByClub=(clubId)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/getVenueByClub',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    clubId:clubId
                }
            }).then((json)=>{
                if(json.re==1){}

                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}


//添加场馆
export let addVenue=(venue)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/addVenueUnit',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    venue:venue
                }
            }).then((json)=>{
                if(json.re==1){}

                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}
