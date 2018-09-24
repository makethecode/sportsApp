import Config from '../../config';
import Proxy from '../utils/Proxy';

import {
    ENABLE_MY_GROUP_ONFRESH,
    DISABLE_MY_GROUP_ONFRESH,
    ENABLE_ALL_GROUP_ONFRESH,
    DISABLE_ALL_GROUP_ONFRESH,
    SET_MY_GROUP_LIST,
    SET_ALL_GROUP_LIST,
    SET_ACTIVITY_LIST,
    ENABLE_ACTIVITY_ONFRESH,
    DISABLE_ACTIVITY_ONFRESH,
    SET_MY_EVENTS,
    SET_MY_TAKEN_EVENTS,
    SET_VISIBLE_EVENTS,
    SET_FIELD_TIME,
    SET_MEMBER_LIST,
} from '../constants/ActivityConstants';

//发布群活动
export let releaseActivity=(event)=>{

    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();

            var personId = state.user.personInfo.personId;
            var personName = state.user.personInfo.perNum;
            var personMobilePhone = state.user.personInfo.mobilePhone;

            var params={
                name:event.eventName,
                idPlace:event.unitId,
                idCreator:personId,
                idGroup:parseInt(event.groupId),
                brief:event.eventBrief,
                cost:parseInt(event.cost),
                timeStart:event.time.startTime,
                timeEnd:event.time.endTime,
                maxnumber:parseInt(event.eventMaxMemNum),
                status:1,
                telnumCreator:personMobilePhone,
                isprivategroup:event.eventType=='组内'?1:0,
                nameCreator:personName,
                isOngoing:1,
            }

            Proxy.postes({
                url: Config.server + '/func/node/createActivity',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:params
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                alert("群活动填写不完整！");
                reject(e);
            })

        });
    }
}

//邀请群成员
export let addMemberList=(activityId,member)=>{

    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();

            var params={
                name:member.name,
                mobilePhone:member.mobilePhone,
                numMember:parseInt(member.numMember),
                activityId:parseInt(activityId),
            }

            Proxy.postes({
                url: Config.server + '/func/node/addMemberList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:params
            }).then((json)=>{
                //返回增加成员后的成员列表
                dispatch(setMemberList(json.data));
                resolve({re:1,data:json.data});
            }).catch((e)=>{
                reject(e);
            })

        });
    }
}

//设置全部活动列表
export let setActivityList=(activityList)=>{
    return {
        type:SET_ACTIVITY_LIST,
        activityList:activityList
    }
}

//设置全部成员列表
export let setMemberList=(memberList)=>{
    return {
        type:SET_MEMBER_LIST,
        memberList:memberList
    }
}

//设置可见活动列表
export let setVisibleEvents=(visibleEvents)=>{
    return {
        type:SET_VISIBLE_EVENTS,
        visibleEvents:visibleEvents
    }
}

//设置我发起的活动列表
export let setMyEvents=(myEvents)=>{
    return {
        type:SET_MY_EVENTS,
        myEvents:myEvents
    }
}

//设置我报名活动列表
export let setMyTakenEvents=(myTakenEvents)=>{
    return {
        type:SET_MY_TAKEN_EVENTS,
        myTakenEvents:myTakenEvents
    }
}

export let enableActivityOnFresh=()=>{
    return {
        type:ENABLE_ACTIVITY_ONFRESH,
    }
}

export let disableActivityOnFresh=()=>{
    return {
        type:DISABLE_ACTIVITY_ONFRESH,
    }
}

export let setFieldTime=(fieldtime)=>{
    return {
        type:SET_FIELD_TIME,
        fieldtime:fieldtime
    }
}

//获取场地时间状态列表
export let fetchVenueUnitTimeList=(unitId,placeYardStr)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var fieldtime = null;

            Proxy.postes({
                url: Config.server + '/func/allow/getAllVenueUnitTime',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    unitId:unitId,
                    placeYardStr:placeYardStr

                }
            }).then((json)=>{
                if (json.re == 1) {
                    fieldtime = json.data;
                    if (fieldtime !== undefined && fieldtime !== null &&fieldtime.length > 0) {
                        dispatch(setFieldTime(fieldtime));
                        //dispatch(disableMyGroupOnFresh());
                        //resolve({re:1,data:myGroupList});
                    }
                    resolve({re:1,data:json.data})
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:'目前未加入任何群组'});
                    }
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//获取全部的活动列表
export let fetchActivityList=()=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var userid = state.user.personInfo.personId;

            var activityList = null;
            var myEvents=[];//我发起的活动

            Proxy.postes({
               url: Config.server + '/func/node/fetchActivityList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {

                }
            }).then((json)=>{
                if (json.re == 1) {
                    activityList = json.data;

                    if (activityList!== undefined && activityList !== null &&activityList.length > 0) {

                        activityList.map((activity,i)=>{

                            if(activity.idcreator==userid){
                                myEvents.push(activity);
                            }
                        });
                    }
                    dispatch(setActivityList(activityList));
                    dispatch(setMyEvents(myEvents));
                    resolve({re:1,data:activityList})
                }else{

                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:'目前没有已创建的群活动'});
                    }
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//获取该活动的所有成员
export let fetchMemberListByActivityId=(activityId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var memberList=[];

            Proxy.postes({
                url: Config.server + '/func/node/fetchMemberListByActivityId',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    activityId:activityId
                }
            }).then((json)=>{
                if (json.re == 1) {
                    memberList = json.data;
                    dispatch(setMemberList(memberList));
                    resolve({re:1,data:memberList})
                }else{

                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1});
                    }
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//报名群活动
export let signUpActivity=(eventId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var username = state.user.personInfo.perNum;
            Proxy.postes({
                url: Config.server + '/func/node/signUpActivity',
                headers: {

                    'Content-Type': 'application/json',

                },
                body: {
                    eventId:parseInt(eventId),
                    userName:username
                }
            }).then((json)=>{
                if (json.re == 1) {
                    resolve({re:1,data:'报名成功'});
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:'报名不成功'});
                    }
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}


export let signUpFieldTimeActivity=(event,select,startTime,endTime)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/allow/eventSignUp',
                headers: {

                    'Content-Type': 'application/json',

                },
                body: {
                    id:event.eventId,
                    isChooseYardTime:event.isChooseYardTime,
                    unitId:event.eventPlaceId,
                    placeYardStr:select,
                    startTime:startTime,
                    endTime:endTime
                }
            }).then((json)=>{
                if (json.re == 1) {
                    resolve({re:1,data:'报名成功'});
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:'报名不成功'});
                    }
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//撤销群活动
export let deleteActivity=(idActivity)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/node/deleteActivity',
                headers: {

                    'Content-Type': 'application/json',
                },
                body: {

                    idActivity:parseInt(idActivity)

                }
            }).then((json)=>{
                if (json.re == 1) {
                    resolve({re:1,data:' 撤销成功'});
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }
                    resolve({re:-1,data:'撤销不成功'});
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//退出群活动
export let exitActivity=(eventId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/exitActivity',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    eventId:parseInt(eventId),
                    userName:state.user.personInfo.perNum
                }
            }).then((json)=>{
                if (json.re == 1) {
                    resolve({re:1,data:'退出成功'});
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:'退出不成功'});
                    }

                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//退出群活动
export let exitFieldTimeActivity=(eventId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/allow/deleteMyEvents',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    eventId:eventId+""
                }
            }).then((json)=>{
                if (json.re == 1) {
                    resolve({re:1,data:'退出成功'});
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:'退出不成功'});
                    }

                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//用用户名搜索成员
export let searchMember=(searchInfo)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/searchOnePerson',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    searchInfo:searchInfo

                }
            }).then((json)=>{
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })


        });
    }
}

//创建群组
export let createGroup=(info)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/createGroup',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {

                        groupName:info.group.groupName,
                        groupBrief:info.group.groupBrief,
                        memberList:info.memberList,
                        groupMaxMemNum:parseInt(info.group.groupMaxMemNum),


                }
            }).then((json)=>{
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })


        });
    }
}

//设置我的组列表
export let setMyGroupList=(myGroupList)=>{
    return {
        type:SET_MY_GROUP_LIST,
        myGroupList:myGroupList
    }
}

//设置全部组列表
export let setAllGroupList=(allGroupList)=>{
    return {
        type:SET_ALL_GROUP_LIST,
        allGroupList:allGroupList
    }
}

export let enableMyGroupOnFresh=()=>{
    return {
        type:ENABLE_MY_GROUP_ONFRESH,
    }
}

export let disableMyGroupOnFresh=()=>{
    return {
        type:DISABLE_MY_GROUP_ONFRESH,
    }
}

export let enableAllGroupOnFresh=()=>{
    return {
        type:ENABLE_ALL_GROUP_ONFRESH,
    }
}

export let disableAllGroupOnFresh=()=>{
    return {
        type:DISABLE_ALL_GROUP_ONFRESH,
    }
}

//获取我的群组列表
export let fetchMyGroupList=()=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var myGroupList = null;

            Proxy.postes({
                url: Config.server + '/func/allow/getMyGroups',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {

                }
            }).then((json)=>{
                if (json.re == 1) {
                    myGroupList = json.data;

                    if (myGroupList !== undefined && myGroupList !== null &&myGroupList.length > 0) {
                        dispatch(setMyGroupList(myGroupList));
                        dispatch(disableMyGroupOnFresh());
                        resolve({re:1,data:myGroupList});
                    }
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:'目前未加入任何群组'});
                    }
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//获取全部的群组列表
export let fetchAllGroupList=()=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var allGroupList = null;

            Proxy.postes({
                url: Config.server + '/func//allow/getGroups',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {

                }
            }).then((json)=>{
                if (json.re == 1) {
                    allGroupList = json.data;
                    //
                    // if (allGroupList!== undefined && allGroupList !== null &&allGroupList.length > 0) {
                    //
                    //     var groupList = [];
                    //     allGroupList.map((group)=>{
                    //         var flag = 0;
                    //         group.memberList.map((member)=>{
                    //             if(member.personId==state.user.personInfo.personId)
                    //                 flag++;
                    //         });
                    //         if(flag==0){
                    //             groupList.push(group);
                    //         }
                    //     })
                        dispatch(setAllGroupList(allGroupList));
                        dispatch(disableAllGroupOnFresh());
                        resolve({re:1});
                    //}
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:'目前没有已创建的群组'});
                    }
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}


//加入群组
export let joinGroup=(groupId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/joinGroup',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {

                        groupId:parseInt(groupId)

                }
            }).then((json)=>{
                if (json.re == 1) {
                    resolve({re:1,data:null});
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:' 加入不成功'});
                    }
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//删除群组
export let deleteGroup=(groupId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/deleteGroup',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    groupId:parseInt(groupId)
                }
            }).then((json)=>{
                if (json.re == 1) {
                    resolve({re:1,data:'删除成功'});
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:'删除不成功'});
                    }
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//退出群组
export let exitGroup=(group)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/exitGroup',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    groupId:parseInt(group.groupId)
                }
            }).then((json)=>{
                if (json.re == 1) {
                    resolve({re:1,data:'退出成功'});
                }else{
                    if(json.re==-100){
                        resolve(json);
                    }else{
                        resolve({re:-1,data:'退出不成功'});
                    }
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//获取群活动成员
export let fetchEventMemberList=(eventId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/fetchEventMemberList',
                headers: {

                    'Content-Type': 'application/json',
                },
                body: {
                    eventId:parseInt(eventId)
                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}

//获取群组成员
export let fetchGroupMemberList=(group)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/fetchGroupMemberList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    groupId:parseInt(group.groupId)

                }
            }).then((json)=>{
                resolve(json)
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        });
    }
}