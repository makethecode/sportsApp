import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    TextInput,
    BackAndroid,
    DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import GridView from 'react-native-super-grid'
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_CHECK} from 'react-native-toolbar-wrapper'
import Config from "../../../config";
import Proxy from "../../utils/Proxy";
import Ionicons from 'react-native-vector-icons/Ionicons'
import proxy from "../../utils/Proxy";

var {height, width,scale} = Dimensions.get('window');
var WeChat = require('react-native-wechat');

class ManagePage extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {

        // public static String TABNAME[]= {"活动","课程","比赛","群组","视频","教练","场地","反馈"};
        // public static String APPTABNAME[]= {"活动","课程","比赛","商城","视频","新闻","统计","试课"};
        // [{"isShow":true,"id":0,"name":"活动"},{"isShow":true,"id":1,"name":"课程"},{"isShow":true,"id":2,"name":"比赛"},
        // {"isShow":true,"id":3,"name":"群组"},{'"isShow"':true,'"id"':4,'"name"':"视频"},{'"isShow"':true,"id":5,"name":"教练"},{"isShow":true,"id":6,"name":"场地"},{"isShow":true,"id":7,"name":"反馈"}]

        super(props);
        this.state={
            // miniItemList:[
            //     {'name':'活动','id':0,'isShow':false},
            //     {'name':'课程','id':1,'isShow':false},
            //     {'name':'比赛','id':2,'isShow':false},
            //     {'name':'群组','id':3,'isShow':false},
            //     {'name':'视频','id':4,'isShow':false},
            //     {'name':'教练','id':5,'isShow':false},
            //     {'name':'场地','id':6,'isShow':false},
            //     {'name':'反馈','id':7,'isShow':false},],
            // appItemList:[
            //     {'name':'活动','id':0,'isShow':false},
            //     {'name':'课程','id':1,'isShow':false},
            //     {'name':'比赛','id':2,'isShow':false},
            //     {'name':'商城','id':3,'isShow':false},
            //     {'name':'视频','id':4,'isShow':false},
            //     {'name':'新闻','id':5,'isShow':false},
            //     {'name':'统计','id':6,'isShow':false},
            //     {'name':'试课','id':7,'isShow':false},],
            clubChooseIdx:0,
            clubTabList:[],
        };
    }

    render(){

        var clubTabList = this.state.clubTabList;
        var clubChooseIdx = this.state.clubChooseIdx;

        var miniItemList = [];
        var appItemList = [];
        if(clubTabList!=null && clubTabList.length>0){
            miniItemList = clubTabList[clubChooseIdx].miniItemList;
            appItemList = clubTabList[clubChooseIdx].appItemList;
        }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="管理" navigator={this.props.navigator}
                         actions={[{icon:ACTION_CHECK,show:OPTION_SHOW}]}
                         onPress={(i)=>{

                             Proxy.postes({
                                 url: Config.server + '/func/node/setClubTabList',
                                 headers: {
                                     'Content-Type': 'application/json',
                                 },
                                 body: {
                                     clubTabList:this.state.clubTabList
                                 }
                             }).then((json)=>{

                                if(json.re==1)Alert.alert('成功','设置完成')

                                 this.getClubTabList()

                             }).catch((e)=>{
                             })

                         }}>
                    <ScrollView>
                    <View style={{flex:1,backgroundColor:'#fff',flexDirection:'row'}}>

                        <View style={{flex:1,backgroundColor:'#eee',flexDirection:'column'}}>

                            {
                                this.state.clubChooseIdx==0?
                                <TouchableOpacity style={{
                                    backgroundColor:'#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 40,
                                    borderColor: '#ccc',
                                    borderWidth: 1,
                                    borderTopWidth: 0
                                }}
                                                  onPress={() => {
                                                      this.setState({clubChooseIdx: 0})
                                                  }}>
                                    <Text style={{fontSize: 14, color: 'red'}}>山体</Text>
                                </TouchableOpacity>:
                                <TouchableOpacity style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 40,
                                    borderColor: '#ccc',
                                    borderWidth: 1,
                                    borderTopWidth: 0
                                }}
                                                  onPress={() => {
                                                      this.setState({clubChooseIdx: 0})
                                                  }}>
                                    <Text style={{fontSize: 14, color: '#888'}}>山体</Text>
                                </TouchableOpacity>
                            }

                            {
                                this.state.clubChooseIdx==1?
                                <TouchableOpacity style={{
                                    backgroundColor:'#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 40,
                                    borderColor: '#ccc',
                                    borderWidth: 1,
                                    borderTopWidth: 0
                                }}
                                                  onPress={() => {
                                                      this.setState({clubChooseIdx:1})
                                                  }}>
                                    <Text style={{fontSize: 14, color: 'red'}}>联通</Text>
                                </TouchableOpacity>:
                                    <TouchableOpacity style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 40,
                                        borderColor: '#ccc',
                                        borderWidth: 1,
                                        borderTopWidth: 0
                                    }}
                                                      onPress={() => {
                                                          this.setState({clubChooseIdx: 1})
                                                      }}>
                                        <Text style={{fontSize: 14, color: '#888'}}>联通</Text>
                                    </TouchableOpacity>
                            }

                            {
                                this.state.clubChooseIdx==2?

                                    <TouchableOpacity style={{
                                        backgroundColor:'#fff',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 40,
                                        borderColor: '#ccc',
                                        borderWidth: 1,
                                        borderTopWidth: 0
                                    }}
                                                      onPress={() => {
                                                          this.setState({clubChooseIdx: 2})
                                                      }}>
                                        <Text style={{fontSize: 14, color: 'red'}}>迈可欣</Text>
                                    </TouchableOpacity>:
                                    <TouchableOpacity style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 40,
                                        borderColor: '#ccc',
                                        borderWidth: 1,
                                        borderTopWidth: 0
                                    }}
                                                      onPress={() => {
                                                          this.setState({clubChooseIdx:2})
                                                      }}>
                                        <Text style={{fontSize: 14, color: '#888'}}>迈可欣</Text>
                                    </TouchableOpacity>
                            }

                        </View>

                        <View style={{width:width*3/4,backgroundColor:'#fff',flexDirection:'column',alignItems:'flex-start',justifyContent:'flex-start',}}>

                            <View style={{height:1,width:width*3/4,backgroundColor:'#eee'}}/>
                            <View style={{height:40,width:width*3/4,backgroundColor:'#fff',justifyContent:'center',alignItems:'flex-start',paddingHorizontal:8}}>
                                <Text style={{fontSize:13,color:'#666'}}>用户端需显示功能</Text>
                            </View>
                            <View style={{height:1,width:width*3/4,backgroundColor:'#eee'}}/>

                        <View style={{flex:1,width:width*3/4,alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'row'}}>
                            <GridView
                                itemDimension={width/4-20}
                                items={miniItemList}
                                style={styles.gridView}
                                renderItem={this.renderMiniRow.bind(this)}
                            />
                        </View>

                            <View style={{height:1,width:width*3/4,backgroundColor:'#eee'}}/>
                            <View style={{height:40,width:width*3/4,backgroundColor:'#fff',justifyContent:'center',alignItems:'flex-start',paddingHorizontal:8}}>
                                <Text style={{fontSize:13,color:'#666'}}>教练端需显示功能</Text>
                            </View>
                            <View style={{height:1,width:width*3/4,backgroundColor:'#eee'}}/>

                            <View style={{flex:1,width:width*3/4,alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'row'}}>
                                <GridView
                                    itemDimension={width/4-20}
                                    items={appItemList}
                                    style={styles.gridView}
                                    renderItem={this.renderAppRow.bind(this)}
                                />
                            </View>

                        </View>

                    </View>
                    </ScrollView>
                </Toolbar>
            </View>
        );
    }

    renderMiniRow(rowData,rowId)
    {

        // {'name':'活动','id':0,'isShow':false},

        var img = '';
        var clubTabList = this.state.clubTabList;
        var clubChooseIdx = this.state.clubChooseIdx;

        switch(rowData.id){
            case 0:img = require('../../../img/mini_activity.png');break;//活动
            case 1:img = require('../../../img/mini_course.png');break;//课程
            case 2:img = require('../../../img/mini_competition.png');break;//比赛
            case 3:img = require('../../../img/mini_group.png');break;//群组
            case 4:img = require('../../../img/mini_video.png');break;//视频
            case 5:img = require('../../../img/mini_coach.png');break;//教练
            case 6:img = require('../../../img/mini_venue.png');break;//场地
            case 7:img = require('../../../img/mini_feedback.png');break;//反馈
        }

        return(
        <TouchableOpacity style={{flex:1,flexDirection:'column',borderWidth:1,borderColor:'#eee'}}
                          onPress={()=>{
                              rowData.isShow=!rowData.isShow;
                              clubTabList[clubChooseIdx].miniItemList[rowId]=rowData;
                              this.setState({clubTabList:clubTabList})
                          }}
        >

                {
                    rowData.isShow?
                        <View style={{flex:1}}><Ionicons name={'md-checkbox-outline'} size={15} color={'#999'}/></View>:
                        <View style={{flex:1}}><Ionicons name={'md-square-outline'} size={15} color={'#999'}/></View>
                }

            <View style={{flex:5,padding:5,justifyContent:'center',alignItems:'center'}}>
                <View style={{height:60,width:60,padding:10,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{height:45,width:45}}
                               source={img} resizeMode={'stretch'}/>
                </View>
            <Text style={{flex:2,marginTop:5,color:'#666',fontSize:13,textAlign:'center'}}>{rowData.name}</Text>
            </View>
        </TouchableOpacity>
        );
    }

    renderAppRow(rowData,rowId)
    {

        // {'name':'活动','id':0,'isShow':false},

        var img = '';
        var clubTabList = this.state.clubTabList;
        var clubChooseIdx = this.state.clubChooseIdx;

        switch(rowData.id){
            case 0:img = require('../../../img/mini_activity.png');break;//活动
            case 1:img = require('../../../img/mini_activity.png');break;//课程
            case 2:img = require('../../../img/mini_competition.png');break;//比赛
            case 3:img = require('../../../img/mini_mall.png');break;//商城
            case 4:img = require('../../../img/mini_video.png');break;//视频
            case 5:img = require('../../../img/mini_news.png');break;//新闻
            case 6:img = require('../../../img/mini_statistic.png');break;//统计
            case 7:img = require('../../../img/mini_trial.png');break;//试课
        }

        return(
            <TouchableOpacity style={{flex:1,flexDirection:'column',borderWidth:1,borderColor:'#eee'}}
                              onPress={()=>{
                                  rowData.isShow=!rowData.isShow;
                                  clubTabList[clubChooseIdx].appItemList[rowId]=rowData;
                                  this.setState({clubTabList:clubTabList})
                              }}
            >

                {
                    rowData.isShow?
                        <View style={{flex:1}}><Ionicons name={'md-checkbox-outline'} size={15} color={'#999'}/></View>:
                        <View style={{flex:1}}><Ionicons name={'md-square-outline'} size={15} color={'#999'}/></View>
                }

                <View style={{flex:5,padding:5,justifyContent:'center',alignItems:'center'}}>
                    <View style={{height:60,width:60,padding:10,justifyContent:'center',alignItems:'center'}}>
                        <Image style={{height:45,width:45}}
                               source={img} resizeMode={'stretch'}/>
                    </View>
                    <Text style={{flex:2,marginTop:5,color:'#666',fontSize:13,textAlign:'center'}}>{rowData.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    componentWillMount(){

        this.getClubTabList()

    }

    getClubTabList(){

        Proxy.postes({
            url: Config.server + '/func/node/getClubTabList',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
            }
        }).then((json)=>{

            var clubTabList = json.data;

            //初始
            var clubChooseIdx = 0;

            this.setState({clubTabList:clubTabList,clubChooseIdx:clubChooseIdx})

        }).catch((e)=>{
        })

    }


    componentWillUnmount(){
    }
}

const styles = StyleSheet.create({
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight:'bold'
    },
    itemCode: {
        fontSize: 12,
        color: '#fff',
    },
    itemPlayer: {
        fontSize: 13,
        color: '#fff',
    },
    itemContainer: {
        flex:1,
        justifyContent: 'flex-end',
    },
    gridView: {
        flex: 1
    },
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize:14
    },
    itemStyle:{
        height: 150,
        width:150,
        padding:5
    },
    cardItemTimeRemainTxt:{
        fontSize:13,
        color:'#666'
    }
});


const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo

    const props = {
        username:state.user.user.username,
        perName:personInfo.perName,
        personId:personInfo.personId,
        wechat:personInfo.wechat,
        perIdCard:personInfo.perIdCard,
    }
    return props
}



export default connect(mapStateToProps)(ManagePage);



