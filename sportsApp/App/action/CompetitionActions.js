
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
export let fetchAllGameList=(projectId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/competition/fetchAllGameList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    projectId:projectId
                }
            }).then((json)=>{
                if(json.re==1){
                    var game = json.data;
                }
                resolve({re:1,data:game})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//创建项目
export let createProject=(project,competitionId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            //{'id':1,'name':'男双','num':'20170101','maxNum':6,'nowNum':3,'personNum':7,'gamesNum':10,'typeStr':'男单',typeIdx:1},

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/competition/createProject',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    name:project.name,
                    maxNum:parseInt(project.maxNum),
                    nowNum:parseInt(project.nowNum),
                    personNum:parseInt(project.personNum),
                    gamesNum:parseInt(project.gamesNum),
                    type:parseInt(project.typeIdx),
                    competitionId:parseInt(competitionId)
                }
            }).then((json)=>{
                if(json.re==1){
                    resolve({re:1})
                }
                else{
                    resolve({re:-1})
                }

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//获取比赛
export let fetchGameList=(projectId,gamesId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/competition/fetchGameList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    projectId:projectId,
                    gamesId:gamesId,
                }
            }).then((json)=>{
                if(json.re==1){
                    var game = json.data;
                }
                resolve({re:1,data:game})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//获取排名
export let fetchRankList=(projectId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/competition/fetchRankList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    projectId:projectId,
                }
            }).then((json)=>{
                if(json.re==1){
                    var rank = json.data;
                }
                resolve({re:1,data:rank})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//获取分组
export let fetchGroupList=(projectId,gameClass)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/competition/fetchGroupList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    projectId:projectId,
                    gameClass:gameClass,
                }
            }).then((json)=>{
                if(json.re==1){
                    var group = json.data;
                    resolve({re:1,data:group})
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

//创建分组
export let createGroupList=(projectId,gameClass)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/competition/createGroupList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    projectId:projectId,
                    gameClass:gameClass,
                }
            }).then((json)=>{
                if(json.re==1){
                    var group = json.data;
                    resolve({re:1,data:group})
                }
                if(json.re==-1){
                    resolve(json)
                }

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//编辑队伍信息
export let updateTeamGroupList=(teamGroup)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/competition/updateTeamGroupList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    teamGroupId:parseInt(teamGroup.id),
                    winCount:parseInt(teamGroup.winCount),
                    lostCount:parseInt(teamGroup.lostCount),
                    rank:parseInt(teamGroup.rank),
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

//增加组列表
export let addGroupList=(team,projectId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
            // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
            // lostCount=0}

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/competition/addGroupList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    teamName:team.team,
                    gameClass:team.gameClass,
                    groupId:team.groupId,
                    winCount:team.winCount,
                    lostCount:team.lostCount,
                    rank:team.rank,
                    teamId:team.teamId,
                    projectId:projectId,
                }
            }).then((json)=>{
                resolve({re:1})
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//删除组列表
export let deleteGroupList=(team)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var username = state.user.user.username;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/competition/deleteGroupList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    id:team.id
                }
            }).then((json)=>{
                resolve({re:1})
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//清空所有分组
export let deleteAllGroupList=(projectId,gameClass)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/competition/deleteAllGroupList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    projectId:projectId,
                    gameClass:gameClass,
                }
            }).then((json)=>{
                resolve({re:1})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//修改所有分组排名
export let updateAllGroupList=(list)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/competition/updateAllGroupList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    list:list
                }
            }).then((json)=>{
                if(json.re==1){
                    resolve({re:1})
                }
                else{
                    resolve({re:-1})
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//完成一局比赛
export let CompleteMatch=(match,recordA,recordB,game)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/competition/CompleteMatch',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    matchId : parseInt(match.id),
                    endTime : match.endTime,
                    score1: parseInt(match.score1),
                    score2: parseInt(match.score2),
                    recordAId:parseInt(recordA.id),
                    recordBId:parseInt(recordB.id),
                    gameId:parseInt(game.id),
                    AlostCount1:parseInt(recordA.lostCount1),
                    AlostCount2:parseInt(recordA.lostCount2),
                    AlostCount3:parseInt(recordA.lostCount3),
                    AlostCount4:parseInt(recordA.lostCount4),
                    AlostCount5:parseInt(recordA.lostCount5),
                    AlostCount6:parseInt(recordA.lostCount6),
                    AlostCount7:parseInt(recordA.lostCount7),
                    AscoreCount1:parseInt(recordA.scoreCount1),
                    AscoreCount2:parseInt(recordA.scoreCount2),
                    AscoreCount3:parseInt(recordA.scoreCount3),
                    AscoreCount4:parseInt(recordA.scoreCount4),
                    AscoreCount5:parseInt(recordA.scoreCount5),
                    BlostCount1:parseInt(recordB.lostCount1),
                    BlostCount2:parseInt(recordB.lostCount2),
                    BlostCount3:parseInt(recordB.lostCount3),
                    BlostCount4:parseInt(recordB.lostCount4),
                    BlostCount5:parseInt(recordB.lostCount5),
                    BlostCount6:parseInt(recordB.lostCount6),
                    BlostCount7:parseInt(recordB.lostCount7),
                    BscoreCount1:parseInt(recordB.scoreCount1),
                    BscoreCount2:parseInt(recordB.scoreCount2),
                    BscoreCount3:parseInt(recordB.scoreCount3),
                    BscoreCount4:parseInt(recordB.scoreCount4),
                    BscoreCount5:parseInt(recordB.scoreCount5),

                }
            }).then((json)=>{

                if(json.re==1)
                resolve({re:1})
                else resolve({re:-1})

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//创建比赛
export let createCompetitonGame=(projectId,gamesId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/competition/createAllCompetitonGames',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    // team1Id:parseInt(team1Id),
                    // team2Id:parseInt(team2Id),
                    // gameClass: parseInt(game.gameClassId),
                    // group: parseInt(game.groupId)-1,
                    // field: game.field,
                    // referee: game.referee,
                    projectId:parseInt(projectId),
                    gamesId:parseInt(gamesId),
                }
            }).then((json)=>{
                if(json.re==1)
                resolve({re:1})
                else resolve({re:-1})


            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

//创建比赛
export let getMatchAndRecordInOneGame=(gameId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/competition/getMatchAndRecordInOneGame',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    gameId:gameId
                }
            }).then((json)=>{
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}