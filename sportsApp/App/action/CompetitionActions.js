
import Config from '../../config'
import Proxy from '../utils/Proxy'

import {
    DISABLE_COMPETITION_ONFRESH,
    ENABLE_COMPETITION_ONFRESH,
    SET_COMPETITION_LIST,
    SET_COMPETITION_ITEM_LIST,
    ENABLE_COMPETITION_ITEM_ONFRESH,
    DISABLE_COMPETITION_ITEM_ONFRESH,
} from '../constants/CompetitionConstants'


//拉取能报名比赛
export let fetchGames=()=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;
            Proxy.postes({
                url: Config.server + '/func/competition/getCanJoinBadmintonCompetitionInfoList',
                headers: {

                    'Content-Type': 'application/json',
                },
                body: {

                }
            }).then((json)=>{
                if(json.re==1){
                    var competitionList = json.data;
                    dispatch(setCompetitionList(competitionList));
                }
                resolve({re:1,data:competitionList})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

export let signUpCompetition=(competitionItem,personIdA,personIdB,teamName,remark)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            //var projectType=competitionItem.projectType;
            var projectId=competitionItem.projectId;
            var state=getState();
            var sessionId = state.user.sessionId;
            Proxy.postes({
                url: Config.server + '/func/competition/createCompetitionTeam',
                headers: {

                    'Content-Type': 'application/json',
                    'Cookie':sessionId,
                },
                body: {
                    projectId:projectId,
                    personIdA:personIdA,
                    personIdB:personIdB,
                    teamName:teamName,
                    remark:remark
                }
            }).then((json)=>{
                if(json.re==1){
                    resolve({re:1});
                }
                else if(json.re==-1){
                    resolve({re:-1})
                }
                else{
                    resolve({re:2})
                }


            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

export let cancelCompetition=(competitionItem)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var projectType=competitionItem.projectType;
            var projectId=competitionItem.projectId;
            var state=getState();
            var sessionId = state.user.sessionId;
            Proxy.postes({
                url: Config.server + '/func/competition/cancelCompetitionTeam',
                headers: {

                    'Content-Type': 'application/json',
                    'Cookie':sessionId,
                },
                body: {
                    projectId:projectId
                }
            }).then((json)=>{
                if(json.re==1){

                    resolve({re:1})
                }


            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}


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

export let setCompetitionList=(competitionList)=>{
    return {
        type:SET_COMPETITION_LIST,
        competitionList:competitionList
    }
}

export let setCompetitionItemList=(competitionItemList)=>{
    return {
        type:SET_COMPETITION_ITEM_LIST,
        competitionItemList:competitionItemList
    }
}
/*export let onGameUpdate=(competitions)=>{
 return (dispatch,getState)=>{
 dispatch({
 type:ON_GAME_UPDATE,
 payload:{
 competitions
 }
 })
 }
 }*/


export let enableCompetitionOnFresh=()=>{
    return {
        type:ENABLE_COMPETITION_ONFRESH,
    }
}
export let disableCompetitionOnFresh=()=>{
    return {
        type:DISABLE_COMPETITION_ONFRESH,
    }
}

export let enableCompetitionItemOnFresh=()=>{
    return {
        type:ENABLE_COMPETITION_ITEM_ONFRESH,
    }
}
export let disableCompetitionItemOnFresh=()=>{
    return {
        type:DISABLE_COMPETITION_ITEM_ONFRESH,
    }
}

export let addPersonsToCompetitionTeam=(rowData,personNameStr)=> {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            var state = getState();
            var projectId = rowData.projectId;

            Proxy.postes({
                url: Config.server + '/func/competition/addPersonsToCompetitionTeam',
                headers: {

                    'Content-Type': 'application/json',

                },
                body: {
                    projectId:projectId,
                    personNameStr: personNameStr,

                }
            }).then((json) => {
                if (json.re == 1) {
                    resolve({re: 1});
                }
                else {
                    if (json.re == -100) {
                        resolve({re:-100});
                    } else {
                        resolve({re: -1});
                    }
                }
            }).catch((e) => {
                alert(e);
                reject(e);
            })

        });
    }
}


export let fetchGamesItem=(competitionId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var allCompetitionItemList = null;

            Proxy.postes({
                url: Config.server + '/func/competition/getBadmintonCompetitionProjectList',
                headers: {

                    'Content-Type': 'application/json',

                },
                body: {
                    competitionId:competitionId
                }
            }).then((json)=>{
                if (json.re == 1) {
                    allCompetitionItemList = json.data;
                    if (allCompetitionItemList!== undefined&&allCompetitionItemList && allCompetitionItemList !== null &&allCompetitionItemList.length > 0) {
                        dispatch(setCompetitionItemList(allCompetitionItemList));
                        dispatch(disableCompetitionItemOnFresh());
                        resolve({re:1});
                    }
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

//获取比赛
export let fetchCompetitions=()=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;
            Proxy.postes({
                url: Config.server + '/func/competition/fetchCompetitions',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                }
            }).then((json)=>{
                if(json.re==1){
                    var competitionList = json.data;
                    dispatch(setCompetitionList(competitionList));
                }
                resolve({re:1,data:competitionList})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//发布比赛
export let AddCompetition=(competition)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;
            Proxy.postes({
                url: Config.server + '/func/competition/addCompetition',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    //competition:{name:null,brief:null,host:null,unitName:null,startTime:null,endTime:null},
                    name:competition.name,
                    brief:competition.brief,
                    host:competition.host,
                    unitName:competition.unitName,
                    startTime:competition.startTime,
                    endTime:competition.endTime,
                    type:competition.typeIdx,
                }
            }).then((json)=>{
                if(json.re==1){
                    resolve({re:1})
                }else{
                    resolve({re:-1})
                }

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//获取项目
export let fetchProjects=(competitionId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/competition/fetchProjects',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    competitionId:competitionId
                }
            }).then((json)=>{
                if(json.re==1){
                    var projects = json.data;
                }
                resolve({re:1,data:projects})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//获取赛季比赛
export let fetchGamesList=(projectId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/competition/fetchGamesList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    projectId:projectId
                }
            }).then((json)=>{
                if(json.re==1){
                    var gamesList = json.data;
                }
                resolve({re:1,data:gamesList})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//获取某项目的参与队伍
export let fetchTeamList=(projectId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/competition/fetchTeamList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    projectId:projectId
                }
            }).then((json)=>{
                if(json.re==1){
                    var teamList = json.data;
                }
                resolve({re:1,data:teamList})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//获取队伍队员
export let fetchTeamPersonList=(teamId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/competition/fetchTeamPersonList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    teamId:teamId
                }
            }).then((json)=>{
                if(json.re==1){
                    var teamPersonList = json.data;
                }
                resolve({re:1,data:teamPersonList})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//获取所有比赛（前五）
export let fetchAllGamesList=()=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/competition/fetchAllGamesList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                }
            }).then((json)=>{
                if(json.re==1){
                    var games = json.data;
                }
                resolve({re:1,data:games})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}