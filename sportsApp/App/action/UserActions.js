import Config from '../../config'
import Proxy from '../utils/Proxy'
import PreferenceStore from '../utils/PreferenceStore';
import {
    Platform
} from 'react-native'
import {
    UPDATE_CERTIFICATE,
    UPDATE_PERSON_INFO,
    UPDATE_TRAINER_INFO,
    UPDATE_PERSON_INFO_AUXILIARY,
    UPDATE_USERTYPE,

    ACCESS_TOKEN_ACK,
    SESSION_ID,
    ON_USER_NAME_UPDATE,
    ON_MOBILE_PHONE_UPDATE,
    ON_SELF_LEVEL_UPDATE,
    ON_SPORT_LEVEL_UPDATE,
    ON_PER_NAME_UPDATE,
    ON_WECHAT_UPDATE,
    ON_GENDER_CODE_UPDATE,
    ON_PER_BIRTHDAY_UPDATE,
    ON_PER_ID_CARD_UPDATE,
    ON_RELATIVE_PERSON_UPDATE,
    ON_UNIVERSITY_UPDATE,
    ON_COACHPHTOTO0_UPDATE,
    ON_COACHPHTOTO1_UPDATE,
    ON_COACHPHTOTO2_UPDATE,
    ON_COACHPHTOTO3_UPDATE,
    ON_COACHLEVEL_UPDATE,
    ON_HEIGHTWEIGHT_UPDATE,
    ON_WORKCITY_UPDATE,
    ON_COACHBRIEF_UPDATE,
    UPDATE_PORTRAIT,
    GET_CLUB_INFO,
    SET_WECHAT_INFO,
} from '../constants/UserConstants'

export let updateCertificate=(payload)=>{
    return {
        type:UPDATE_CERTIFICATE,
        payload:payload
    }
}

export let updateTrainerInfo=(payload)=>{
    return {
        type:UPDATE_TRAINER_INFO,
        payload:payload
    }
}

export let updatePersonInfo=(payload)=>{
    return {
        type:UPDATE_PERSON_INFO,
        payload:payload
    }
}

export let getClubInfo=(payload)=>{
    return {
        type:GET_CLUB_INFO,
        payload:payload
    }
}

export let updatePersonInfoAuxiliary=(payload)=>{
    return {
        type:UPDATE_PERSON_INFO_AUXILIARY,
        payload:payload
    }
}

export let updateUserType=(usertype)=>{
    return {
        type:UPDATE_USERTYPE,
        payload:{
            usertype
        }
    }
}

export let getAccessToken = (auth)=>{
    return {
        type: ACCESS_TOKEN_ACK,
        auth:auth,
    };
}

//自身水平更改
export let updateSelfLevel=(selfLevel)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateSelfLevel',
                headers: {

                    'Content-Type': 'application/json',
                },
                body: {

                    selfLevel:selfLevel

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

//运动水平更改
export let updateSportLevel=(sportLevel)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {
            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/node/updateSportLevel',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    sportLevel: sportLevel
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

//用户名更改
export let updateUsername=(username)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/node/updateUsername',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {

                        username:username

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

export let onMobilePhoneUpdate=(mobilePhone)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_MOBILE_PHONE_UPDATE,
            payload: {
                mobilePhone
            }
        })
    }
}

export let onUsernameUpdate=(username)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_USER_NAME_UPDATE,
                payload: {
                    username
                }
        })
    }
}

export let onSelfLevelUpdate=(selfLevel)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:ON_SELF_LEVEL_UPDATE,
            payload: {
                selfLevel
            }
        })
    }
}

export let onSportLevelUpdate=(sportLevel)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:ON_SPORT_LEVEL_UPDATE,
            payload: {
                sportLevel
            }
        })
    }
}
export let onUniversityUpdate=(university)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:ON_UNIVERSITY_UPDATE,
            payload: {
                university
            }
        })
    }
}
export let onCoachPhoto0Update=(coachphoto)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:ON_COACHPHTOTO0_UPDATE,
            payload: {
                coachphoto
            }
        })
    }
}

export let onCoachPhoto1Update=(coachphoto)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:ON_COACHPHTOTO1_UPDATE,
            payload: {
                coachphoto
            }
        })
    }
}

export let onCoachPhoto2Update=(coachphoto)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:ON_COACHPHTOTO2_UPDATE,
            payload: {
                coachphoto
            }
        })
    }
}


export let onCoachLevelUpdate=(coachlevel)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:ON_COACHLEVEL_UPDATE,
            payload: {
                coachlevel
            }
        })
    }
}
//手机号更改
export let updateMobilePhone=(mobilePhone)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/node/updateMobilePhone',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    mobilePhone:mobilePhone
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

//手机验证
export let verifyMobilePhone=(mobilePhone)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var accessToken = state.user.accessToken;
            var sessionId = state.user.sessionId;

            Proxy.postes({
                url: Config.server + '/func/node/securityCode',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie':sessionId,
                },
                body: {
                    phoneNum:mobilePhone
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

//真实姓名更改
export let updatePerName=(perName)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updatePerName',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                        perName:perName
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
//毕业院校修改
export let updateUniversity=(university)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateUniversity',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    university:university
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

export let updateCoachPhoto0=(coachphoto)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateCoachPhoto0',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    coachphoto:coachphoto
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

export let updateCoachPhoto1=(coachphoto)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateCoachPhoto1',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    coachphoto:coachphoto
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

export let updateCoachPhoto2=(coachphoto)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateCoachPhoto2',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    coachphoto:coachphoto
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

export let updateCoachPhoto3=(coachphoto)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateCoachPhoto3',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    coachphoto:coachphoto
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

export let updateCoachLevel=(coachlevel)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateCoachLevel',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    coachlevel:coachlevel
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

export let updateCoachBrief=(coachbrief)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateCoachBrief',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    coachbrief:coachbrief
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

export let updateMajor=(major)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateMajor',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    major:major
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

export let updateWorkCity=(workcity)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateWorkCity',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    workcity:workcity
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

export let updateHeightWeight=(heightweight)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateHeightWeight',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    heightweight:heightweight
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

//微信号更改
export let updateWeChat=(wechat)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateWeChat',
                headers: {

                    'Content-Type': 'application/json',
                },
                body: {

                        wechat:wechat

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

//性别更改
export let updateGenderCode=(genderCode)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updateGenderCode',
                headers: {

                    'Content-Type': 'application/json',
                },
                body: {

                    genderCode:genderCode

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


//年龄更改
export let updatePerBirthday=(perBirthday)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve ,reject)=>{
            var state =getState();
            Proxy.postes({
                url:Config.server + '/func/node/updatePerBirthday',
                headers:{
                    'Content-Type':'application/json'
                },
                body:{
                    perBirthday:perBirthday
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
//身份证证件号更改
export let updatePerIdCard=(perIdCard)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/updatePerIdCard',
                headers: {

                    'Content-Type': 'application/json',

                },
                body: {
                        perIdCard:perIdCard
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

export let onPerNameUpdate=(perName)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_PER_NAME_UPDATE,
            payload: {
                perName
            }
        })
    }
}


export let onCoachBriefUpdate=(coachbrief)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_COACHBRIEF_UPDATE,
            payload: {
                coachbrief
            }
        })
    }
}
export let onMajorUpdate=(major)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_UNIVERSITY_UPDATE,
            payload: {
                major
            }
        })
    }
}

export let onWorkCityUpdate=(workcity)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_WORKCITY_UPDATE,
            payload: {
                workcity
            }
        })
    }
}
export let onHeightWeightUpdate=(heightweight)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_HEIGHTWEIGHT_UPDATE,
            payload: {
                heightweight
            }
        })
    }
}

//微信
export let onWeChatUpdate=(wechat)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_WECHAT_UPDATE,
            payload: {
                wechat
            }
        })
    }
}



//性别
export let onGenderCodeUpdate=(genderCode)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_GENDER_CODE_UPDATE,
            payload: {
                genderCode
            }
        })
    }
}

//年龄
export let onPerBirthdayUpdate=(perBirthday)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_PER_BIRTHDAY_UPDATE,
            payload: {
                perBirthday
            }
        })
    }
}


export let onPerIdCardUpdate=(perIdCard)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_PER_ID_CARD_UPDATE,
            payload: {
                perIdCard
            }
        })
    }
}

//同步用户关联人
export let onRelativePersonsUpdate=(persons)=>{
    return (dispatch,getState)=>{

        dispatch({
            type:ON_RELATIVE_PERSON_UPDATE,
            payload: {
                persons
            }
        })
    }
}
//存储unionid
export let storeUnionid=(unionid)=>{
    return (dispatch)=>{

        dispatch({
            type:GET_UNIONID_INFO,
            payload: {
                unionid
            }
        })
    }
}

//存储wechat
export let setWechatInfo=(wechat)=>{
    return (dispatch)=>{

        dispatch({
            type:SET_WECHAT_INFO,
            payload: {
                wechat
            }
        })
    }
}

//新增用户关联人
export let addRelativePerson=(payload)=> {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/relative/addRelative',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: {
                    userName:payload.username,
                    genderCode:payload.genderCode.toString(),
                    perName:payload.perName,
                    perBirthday:payload.perBirthday,

                    //payload:payload
                }
            }).then((json)=>{
                if(json.re==1){
                    resolve(json)
                }else{
                    if(json.re==2){
                        resolve(json)
                    }
                }

            }).catch((e)=>{
                alert(e);
                      reject(e);
            })
        })
    }
}

//用户注册
export let registerUser=(info,wechatinfo)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var {userType,username,password,mobilePhone,name,sexType,sexTypeCode,birthday,idCard,address,QQ,email,wechat,clubType,clubId,
            sportLevel,coachLevel,venue,heightweight,workcity,graduate}=info;
            var {openid,nickname,sex,province,city,country,headimgurl,unionid} = wechatinfo;

            Proxy.postes({
                url: Config.server + '/func/register/userRegister',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    userName: username,
                    password:password,
                    phoneNum:mobilePhone,
                    name:name,
                    sexType:sexTypeCode.toString(),
                    birthday:birthday,
                    idCard:idCard,
                    address:address,
                    QQ:QQ,
                    email:email,
                    wechat:wechat,
                    //教练信息
                    clubType:clubType,
                    clubId:clubId,
                    sportLevel:sportLevel,
                    coachLevel:coachLevel,
                    venue:venue,
                    heightweight:heightweight,
                    workcity:workcity,
                    graduate:graduate,
                    //微信信息
                    openid:openid,
                    nickname:nickname,
                    sex:sex,
                    province:province,
                    city:city,
                    country:country,
                    headimgurl:headimgurl,
                    unionid:unionid
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


//添加教练
export let addCoach=(info)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var {name,genderCode,birthday,mobilePhone,
                sportLevel,coachLevel,heightweight,workcity,graduate,
                password,idCard,address,QQ,email,wechat,clubType,clubId,venue}=info;
            if(genderCode = '男'){
                genderCode = 1
            }else if(genderCode = '女'){
                genderCode = 2
            }else{
                genderCode = null
            }
            var {openid,nickname,sex,province,city,country,headimgurl,unionid} = {};

            Proxy.postes({
                url: Config.server + '/func/register/addCoach',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    userName: name,
                    password:password,
                    phoneNum:mobilePhone,
                    name:name,
                    genderCode:genderCode.toString(),
                    birthday:birthday,
                    idCard:idCard,
                    address:address,
                    QQ:QQ,
                    email:email,
                    wechat:wechat,
                    //教练信息
                    clubType:clubType,
                    clubId:clubId,
                    sportLevel:sportLevel,
                    coachLevel:coachLevel,
                    venue:venue,
                    heightweight:heightweight,
                    workcity:workcity,
                    graduate:graduate,
                    //微信信息
                    openid:openid,
                    nickname:nickname,
                    sex:sex,
                    province:province,
                    city:city,
                    country:country,
                    headimgurl:headimgurl,
                    unionid:unionid
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

export let wechatregisterUser=(unionid,nickname)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            //dispatch(storeUnionid(unionid));
            //var {userType,username,password,genderCode,mobilePhone,nickName}=payload;
            Proxy.postes({
                url: Config.server + '/func/register/wechatuserRegister',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    nickName: nickname,
                    password:"9527",
                    phoneNum:' ',
                    Trainer:1,
                    unionid:unionid,
                    LoginType:1
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

export let ForgetPwd=(username)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/loginForgetPwd',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    username:username
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

export let wechatGetOpenid=(url)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            //var {userType,username,password,genderCode,mobilePhone,nickName}=payload;
            Proxy.postes({
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
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


export let wechatGetCode=(url)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            //var {userType,username,password,genderCode,mobilePhone,nickName}=payload;
            Proxy.postes({
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
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

export let wechatGetUserInfo=(url)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            //var {userType,username,password,genderCode,mobilePhone,nickName}=payload;
            Proxy.postes({
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
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

export let doLogin=function(username,password){

    return dispatch=> {
        return new Promise((resolve, reject) => {
            var versionName = '1';

            Proxy.postes({
                url: Config.server + '/func/auth/webLogin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    loginName: username,
                    password: password,
                    loginType:1,
                    parameter:{appVersion:versionName,appDeviceType:Platform.OS}
                }
            }).then((json)=>{

                if(json.errorMessageList!==null&&json.errorMessageList!==undefined&&json.errorMessageList.length>0){
                    resolve({re:-1,data:json.errorMessageList[1]});

                }else{
                    //TODO:make a dispatch

                    PreferenceStore.put('username', username);
                    PreferenceStore.put('password', password);

                    Proxy.postes({
                        url:Config.server + '/func/node/getUserTypeByPersonId',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {}
                    }).then((json)=> {

                                 //获得用户身份
                                 //教练/俱乐部管理员与微信号绑定
                                 //userType='M'超级管理员（属于教练(信息无用)不属于任何俱乐部）与微信号不绑定
                                 var userType = json.data.perTypeCode;

                                //教练与俱乐部管理员,获取教练信息；超级管理员，无用的教练信息
                                return Proxy.postes({
                                    url: Config.server + '/func/node/fetchBadmintonTrainerInfo',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: {
                                    }
                                }).then((json)=>{
                                    //存入props.user.trainer中
                                    if(json.re==1)
                                    dispatch(updateTrainerInfo({data:json.data}))

                                    Proxy.postes({
                                        url: Config.server + '/func/node/getPersonInfoByPersonId',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: {

                                        }
                                    }).then((json) => {
                                        if(json.re==-100){
                                            resolve(json);
                                        }
                                        else{
                                            if (json.re == 1)
                                                dispatch(updatePersonInfo({data: json.data}));

                                            Proxy.postes({
                                                url: Config.server + '/func/node/getPersonInfoAuxiliaryByPersonId',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: {

                                                }
                                            }).then((json)=>{
                                                if(json.re==-100){
                                                    resolve(json);
                                                }
                                                else{
                                                    if(json.re==1)
                                                        dispatch(updatePersonInfoAuxiliary({data: json.data}));

                                                    dispatch(getAccessToken(true));
                                                    resolve(json)
                                                }
                                            }).catch((err)=> {

                                                reject(err)
                                            });

                                        }
                                    }).catch((err)=> {
                                        dispatch(getAccessToken(false));
                                        //dispatch(setSessionId(sessionId));
                                        reject(err)
                                    })

                                })

                    }).catch((err)=> {
                        dispatch(getAccessToken(false));
                        //dispatch(setSessionId(sessionId));
                        reject(err)
                    })
                }
            }).catch((err)=> {
                dispatch(getAccessToken(false));
                //dispatch(setSessionId(sessionId));
                reject(err)
            })
        })
    }
}

export let doLogout=function(username){

    return dispatch=> {

        return new Promise((resolve, reject) => {
            var versionName = '1';

            Proxy.postes({
                url: Config.server + '/func/auth/webLogout',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                }
            }).then((json)=>{

                if(json.errorMessageList!==null&&json.errorMessageList!==undefined&&json.errorMessageList.length>0){
                    resolve({re:-1,data:json.errorMessageList[1]});

                }else{
                    //TODO:make a dispatch

                    PreferenceStore.delete('username');
                    PreferenceStore.delete('password');
                    dispatch(getAccessToken(false));

                    resolve(json)
                }

            }).catch((err)=> {
                dispatch(getAccessToken(false));
                //dispatch(setSessionId(sessionId));
                reject(err)
            })
        })
    }
}

//上传身份证
export let uploadPersonIdCard=(path,personId)=> {
    //var personId = personId.toString();
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var data = new FormData();
            data.append('file', {uri: path, name: 'portrait.jpg', type: 'multipart/form-data'});
            //限定为jpg后缀

            Proxy.post({
                url:Config.server+'/uploadPersonIdCard?personId='+personId.toString(),
                headers: {
                    'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type':'multipart/form-data',
                },
                body: data,
            },(json)=> {
               resolve(json)

            }, (err) =>{
                reject(err)
            });


        })
    }
}

export let updatePortrait=(payload)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:UPDATE_PORTRAIT,
            payload: {
                payload
            }
        })
    }
}

//测试下载头像
export let downloadPortrait=()=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {
            var state=getState();

            var accessToken=state.user.accessToken;
            var portrait='';

            //检查头像是否存在
            Proxy.post({

                url:Config.server+'/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request:'checkPortrait',
                }
            },(json)=> {
                for(var field in json) {
                    console.log('field=' + field + '\r\n' + json[field]);
                }
                if(json.re==1)
                {
                    var portrait=json.data;

                    var url =  Config.server+ '/svr/request?request=downloadPortrait&filePath='+portrait;
                    var dirs = RNFetchBlob.fs.dirs

                    RNFetchBlob.fs.exists(dirs.DocumentDir + '/portrait.png')
                        .then((exist) => {
                            console.log(`file ${exist ? '' : 'not'} exists`);
                            if(exist==true){
                                RNFetchBlob.fs.unlink(dirs.DocumentDir + '/portrait.png').then(() => {
                                    RNFetchBlob
                                        .config({
                                            fileCache : true,
                                            appendExt : 'png',
                                            path : dirs.DocumentDir + '/portrait.png'
                                        })
                                        .fetch('POST',url, {
                                                Authorization : 'Bearer '+accessToken,
                                                "Content-Type":"application/json"
                                            },

                                        ).then((res)=>{
                                        //alert('portrait filePath='+res.path());
                                        resolve({re:1,data:'file://' + res.path()});
                                    });
                                })

                            }else{

                                RNFetchBlob
                                    .config({
                                        fileCache : true,
                                        appendExt : 'png',
                                        path : dirs.DocumentDir + '/portrait.png'
                                    })
                                    .fetch('POST',url, {
                                            Authorization : 'Bearer '+accessToken,
                                            "Content-Type":"application/json"
                                        },
                                    ).then((res)=>{
                                    //alert('portrait filePath='+res.path());
                                    resolve({re:1,data:'file://' + res.path()});
                                });
                            }


                        })
                        .catch(() => {console.log('判断文件是否存在出错');})


                }
                else{
                    resolve({re:2,data:''});
                }

            }, (err) =>{
                Alert.alert(
                    'error',
                    err
                );
            });

        });
    }
}
//微信统一下单
export let wechatPay=(pay,activityId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/node/addPaymentInfo',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    pay:pay,
                    activityId:parseInt(activityId)
                }
            }).then((json)=>{
                if(json.re==1){

                    var total_fee = pay.payment*100;
                    var nonce_str = Math.random().toString(36).substr(2, 15);
                    var out_trade_no = json.data;

                    Proxy.postes({
                        url: Config.server + '/func/node/wechatPay',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {
                            info:{
                                nonce_str:nonce_str,//随机字符串
                                out_trade_no:out_trade_no,
                                total_fee:total_fee,
                                attach:'山东体育热科技有限公司',
                                body:'群活动费用',
                                product_id:activityId+'',
                            }

                        }
                    }).then((json)=>{
                        resolve(json.data)

                    }).catch((e)=>{
                        alert(e);
                        reject(e);
                    })

                }
                else{
                    console.log('添加支付订单信息不完整');

                }


            }).catch((e)=>{
                alert(e);
                reject(e);
            })


        })
    }
}

//课程支付
export let wechatPay2=(pay,courseId,isChild)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/node/addPaymentInfo2',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    pay:pay,
                    courseId:parseInt(courseId),
                    isChild:parseInt(isChild),
                }
            }).then((json)=>{
                if(json.re==1){

                    var total_fee = pay.payment*100;
                    var nonce_str = Math.random().toString(36).substr(2, 15);
                    var out_trade_no = json.data;

                    Proxy.postes({
                        url: Config.server + '/func/node/wechatPay',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {
                            info:{
                                nonce_str:nonce_str,//随机字符串
                                out_trade_no:out_trade_no,
                                total_fee:total_fee,
                                attach:'山东体育热科技有限公司',
                                body:'课程费用',
                                product_id:courseId+'',
                            }
                        }
                    }).then((json)=>{
                        resolve(json)
                    }).catch((e)=>{
                        alert(e);
                        reject(e);
                    })
                }
                else{
                    alert('课程人数已满')
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })


        })
    }
}

//获取所有俱乐部
export let fetchClubList=()=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/getAllClub',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                }
            }).then((json)=>{
                if(json.re==1)
                {
                }

                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })
        })
    }
}

//获取我的俱乐部
export let fetchMyClub=(clubId)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/getMyClub',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    clubId:clubId
                }
            }).then((json)=>{
                dispatch(getClubInfo({data: json.data}));
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })
        })
    }
}

//商品支付
export let wechatGoodsPay=(pay,goods)=> {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            var state = getState();

            Proxy.postes({
                url: Config.server + '/func/node/addGoodsPaymentInfo',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    pay: pay,
                    goods: goods,
                }
            }).then((json) => {
                if (json.re == 1) {

                    var total_fee = pay.payment * 100;
                    var nonce_str = Math.random().toString(36).substr(2, 15);
                    var out_trade_no = json.data.outTradeNo;
                    var id = json.data.clubId;

                    Proxy.postes({
                        url: Config.server + '/func/node/wechatPay',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {
                            info: {
                                nonce_str: nonce_str,//随机字符串
                                out_trade_no: out_trade_no,
                                total_fee: total_fee,
                                attach: '山东体育热科技有限公司',
                                body: '商品购买',
                                product_id: id + '',
                            }

                        }
                    }).then((json) => {
                        resolve(json.data)

                    }).catch((e) => {
                        alert(e);
                        reject(e);
                    })

                }
                else {
                    console.log('添加支付订单信息不完整');

                }


            }).catch((e) => {
                alert(e);
                reject(e);
            })


        })
    }
}

    //商品支付成功
    export let goodsPaySuccess=(goods)=> {
        return (dispatch, getState) => {
            return new Promise((resolve, reject) => {
                var state = getState();

                Proxy.postes({
                    url: Config.server + '/func/node/goodsPaySuccess',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        goods: goods,
                    }
                }).then((json) => {
                }).catch((e) => {
                    alert(e);
                    reject(e);
                })


            })
        }
    }

        //获得用户今日截至目前的预约报名人数
        export let fetchTodayUserStatus=(currentDate)=>{
            return (dispatch,getState)=> {
                return new Promise((resolve, reject) => {

                    var state=getState();
                    Proxy.postes({
                        url: Config.server + '/func/node/fetchTodayUserStatus',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {
                            currentDate:currentDate
                        }
                    }).then((json)=>{
                        if(json.re==1)
                        {
                            resolve(json)
                        }
                    }).catch((e)=>{
                        alert(e);
                        reject(e);
                    })
                })
            }
        }

        //获得用户今日参与活动和课程的情况
        export let fetchTodayCourseAndActivity=(currentDate)=>{
            return (dispatch,getState)=> {
                return new Promise((resolve, reject) => {

                    var state=getState();
                    Proxy.postes({
                        url: Config.server + '/func/node/fetchTodayCourseAndActivity',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {
                            currentDate:currentDate
                        }
                    }).then((json)=>{
                        if(json.re==1)
                        {
                            //{detailEndTime=2018-09-06 23:59:59, name=周末班, startTime=10, detailStartTime=2018-09-06 10:23:13, endTime=23, type=course}
                            resolve(json)
                        }
                    }).catch((e)=>{
                        alert(e);
                        reject(e);
                    })
                })
            }
        }

        //获取今日截至目前的收益情况
        export let fetchNowPayments=()=>{
            return (dispatch,getState)=> {
                return new Promise((resolve, reject) => {

                    var state=getState();
                    Proxy.postes({
                        url: Config.server + '/func/node/fetchNowPayments',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {
                        }
                    }).then((json)=>{
                        if(json.re==1)
                        {
                            //{time:8,type:'activity',detailTime:'08:23:49',payment:15}
                            resolve(json)
                        }
                    }).catch((e)=>{
                        alert(e);
                        reject(e);
                    })
                })
            }
        }

//获取具体某一天的收益情况
export let fetchDetailPayments=(currentDate)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/fetchDetailPayments',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    currentDate:currentDate
                }
            }).then((json)=>{
                if(json.re==1)
                {
                    //{time:8,type:'activity',detailTime:'08:23:49',payment:15}
                    resolve(json)
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })
        })
    }
}
//获得课程成员的信息\群活动成员的信息
export let fetchMemberInformation=(personId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/node/getMemberInformation',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    personId:personId
                }
            }).then((json)=>{
                if(json.re==1)
                {
                    var member=json.data;
                    resolve({re:1,data:member})
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}
//修改个人信息
export let modifyUser=(member)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();

            Proxy.postes({
                url: Config.server + '/func/node/modifyUser',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    member:member
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

//上传照片
export let uploadImage=(params)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            let formData = new FormData();

            //限定为jpg后缀
            let file = {uri: params.path, type: 'multipart/form-data', name: 'img.jpg'};

            formData.append('images ', file);

            //限定为jpg后缀
            Proxy.post({
                url:Config.server+'/func/node/uploadImg?personId='+params.userId+'&idx='+params.idx+'',
                headers: {
                    'Content-Type':'multipart/form-data',
                },
                body: formData,
            }).then((json)=> {
                resolve(json)

            }).catch((err) =>{
                //reject(err)
            })
        })

    }
}

//上传照片
export let uploadGoodsImage=(params)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            let formData = new FormData();

            //限定为jpg后缀
            let file = {uri: params.path, type: 'multipart/form-data', name: 'img.jpg'};

            formData.append('images ', file);

            //限定为jpg后缀
            Proxy.post({
                url:Config.server+'/func/node/uploadGoodsImg?currentPhotoUrl='+params.currentPhotoUrl+'&oldPhotoUrl='+params.oldPhotoUrl+'&productId='+params.productId+'',
                headers: {
                    'Content-Type':'multipart/form-data',
                },
                body: formData,
            }).then((json)=> {
                resolve(json)

            }).catch((err) =>{
                //reject(err)
                alert(err)
            })
        })

    }
}

//上传头像
export let uploadPortrait=(portrait,personId)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {
            var state=getState();
            //  var accessToken=state.user.accessToken;

            // Create the form data object
            var data = new FormData();
            data.append('images ', {uri: portrait, name: 'portrait.jpg', type: 'multipart/form-data'});


            //限定为jpg后缀
            Proxy.post({
                url:Config.server+'/func/node/uploadCoachHead?personId='+personId.toString(),
                headers: {
                    'Content-Type':'multipart/form-data',
                },
                body: data,
            },(json)=> {
                resolve(json)

            }, (err) =>{
                //reject(err)
            });
        });
    }
}

//获取具体某一天的商品收益情况
export let fetchGoodsProfitByDate=(currentDate)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {

            var state=getState();
            Proxy.postes({
                url: Config.server + '/func/node/fetchGoodsProfitByDate',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    currentDate:currentDate
                }
            }).then((json)=>{
                if(json.re==1)
                {
                    //{time:8,type:'activity',detailTime:'08:23:49',payment:15}
                    resolve(json)
                }
            }).catch((e)=>{
                alert(e);
                reject(e);
            })
        })
    }
}
