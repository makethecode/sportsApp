
import React, {Component} from 'react';
import {
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
    Modal,
    Alert,
    DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
import TeamListModal from './TeamListModal'
import {fetchTeamList,fetchGroupList,CompleteMatch,getMatchAndRecordInOneGame} from '../../action/CompetitionActions'

var {height, width} = Dimensions.get('window');

class CompetitionRecord extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    _handlePress(index) {

        if(index!==0){
//            var matchNoStr = this.state.matchNoButtons[index];
//            var matchNoId = index;

            var match;
            var recordA;
            var recordB;

            for(var i=0;i<this.state.matchList.length;i++){if(this.state.matchList[i].matchNoId==index)match=this.state.matchList[i]}
            for(var i=0;i<this.state.recordAList.length;i++){if(this.state.recordAList[i].matchNoId==index)recordA=this.state.recordAList[i]}
            for(var i=0;i<this.state.recordBList.length;i++){if(this.state.recordBList[i].matchNoId==index)recordB=this.state.recordBList[i]}

            this.setState({match:match,recordA:recordA,recordB:recordB});

        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    constructor(props) {
        super(props);
        this.state = {

            isStart:false,
            hour:0,
            minutes:0,
            seconds:0,
            matchNoButtons:['取消','第一局','第二局','第三局'],

            //传值
            projectId:this.props.projectId,
            projectName:this.props.projectName,
            projectType:this.props.projectType,
            gamesId:this.props.gamesId,
            game:this.props.game,

            //该场比赛对应的对局以及记录
            matchList:[],
            recordAList:[],
            recordBList:[],

            match: {
                id:0,
                score1: 0,
                score2: 0,
                gameClass: 1,
                group: null,
                matchNoStr: '第一局',
                matchNoId: 1,
                startTime: '',
                endTime: '',
                state:0,
            },

            recordA:{
                id:0,
                matchId:null,
                teamId:null,
                matchNoStr:null,
                matchNoId:null,
                lostCount1:0,
                lostCount2:0,
                lostCount3:0,
                lostCount4:0,
                lostCount5:0,
                lostCount6:0,
                lostCount7:0,
                scoreCount1:0,
                scoreCount2:0,
                scoreCount3:0,
                scoreCount4:0,
                scoreCount5:0,
            },

            recordB:{
                id:0,
                matchId:null,
                teamId:null,
                matchNoStr:null,
                matchNoId:null,
                lostCount1:0,
                lostCount2:0,
                lostCount3:0,
                lostCount4:0,
                lostCount5:0,
                lostCount6:0,
                lostCount7:0,
                scoreCount1:0,
                scoreCount2:0,
                scoreCount3:0,
                scoreCount4:0,
                scoreCount5:0,
            },
        };
        this._timer=null;
    }

    render(){

        // {'id':33,'teamAName':'开心队','teamBName':'不开心队','scoreA':0,'scoreB':10,'startTime':'2018-12-10 08:00','endTime':'2018-12-11 10:00',state:0,
        //     'teamAimgList':['https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0'],
        //     'teamBimgList':['https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132'],
        //     'gameClass':1,'isSingle':1,'gameType':1,'teamA':{},'teamB':{},

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        return (
            <View style={styles.container}>

                <Toolbar width={width} title="比分记录" actions={[]} navigator={this.props.navigator}>

                <ScrollView style={{backgroundColor:'#66CDAA'}}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:1}}>

                        {/*对局情况UI*/}
                        {
                            this.state.match.state?
                            <View style={{
                                width: width,
                                height: 120,
                                padding: 6,
                                marginTop: 10,
                                paddingHorizontal: 12,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                    <TouchableOpacity style={{width:100,height:30,borderColor:'#fff',borderWidth:1,justifyContent:'center',alignItems:'center',textAlign:'center'}}
                                    onPress={()=>{this.show('actionSheet');}}>
                                        <Text style={{color:'#fff',fontSize:20}}>{this.state.match.matchNoStr}</Text>
                                        <ActionSheet
                                            ref={(p) => {
                                                this.actionSheet =p;
                                            }}
                                            title="请选择局数"
                                            options={this.state.matchNoButtons}
                                            cancelButtonIndex={CANCEL_INDEX}
                                            destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                            onPress={
                                                (data)=>{ this._handlePress(data); }
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:1,justifyContent:'center',alignItems:'center',textAlign:'center'}}><Text style={{ fontSize: 20, color: '#fff'}}>比赛已结束</Text></View>
                                <View style={{flex:1,justifyContent:'center',alignItems:'center',textAlign:'center'}}><Text style={{fontSize: 20, color: '#fff'}}>{this.state.hour}:{this.state.minutes}:{this.state.seconds}</Text></View>
                            </View>
                                :
                                <View style={{
                                    width: width,
                                    height: 120,
                                    padding: 6,
                                    marginTop: 10,
                                    paddingHorizontal: 12,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <TouchableOpacity style={{width:100,height:30,borderColor:'#fff',borderWidth:1,justifyContent:'center',alignItems:'center',textAlign:'center'}}
                                                          onPress={()=>{this.show('actionSheet');}}>
                                            <Text style={{color:'#fff',fontSize:20}}>{this.state.match.matchNoStr}</Text>
                                            <ActionSheet
                                                ref={(p) => {
                                                    this.actionSheet =p;
                                                }}
                                                title="请选择局数"
                                                options={this.state.matchNoButtons}
                                                cancelButtonIndex={CANCEL_INDEX}
                                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                                onPress={
                                                    (data)=>{ this._handlePress(data); }
                                                }
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex:1,justifyContent:'center',alignItems:'center',textAlign:'center'}}><Text style={{ fontSize: 20, color: '#fff'}}>比赛未结束</Text></View>
                                    <View style={{flex:1,justifyContent:'center',alignItems:'center',textAlign:'center'}}><Text style={{fontSize: 20, color: '#fff'}}>{this.state.hour}:{this.state.minutes}:{this.state.seconds}</Text></View>
                                </View>
                        }

                        {/*队伍UI*/}
                        <View style={{width:width,height:80,padding:6, paddingHorizontal: 12,flexDirection:'row'}}>

                            {/*队伍1*/}
                            <View style={{flex:4,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                {
                                    this.state.game.isSingle == '1' ?
                                     <View>
                                        <Image style={{height: 45, width: 45, borderRadius: 23}}
                                              source={{uri: this.state.game.teamAimgList[0]}}/>
                                        </View>
                                         :
                                     <View style={{flexDirection: 'row'}}>
                                         <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                       source={{uri: this.state.game.teamAimgList[0]}}/>
                                          <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                       source={{uri: this.state.game.teamAimgList[1]}}/>
                                          </View>
                                }

                                <View style={{marginTop:10,width:100,justifyContent:'center',alignItems:'center',padding:3}}>
                                    <View><Text style={{fontSize:14,color:'#fff'}}>{this.state.game.teamAName}</Text></View></View>

                            </View>

                            <View style={{flex: 1, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}/>

                            {/*队伍2*/}
                            <View style={{flex:4,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                {
                                    this.state.game.isSingle == '1' ?
                                        <View>
                                            <Image style={{height: 45, width: 45, borderRadius: 23}}
                                                   source={{uri: this.state.game.teamBimgList[0]}}/>
                                        </View>
                                        :
                                        <View style={{flexDirection: 'row'}}>
                                            <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                   source={{uri: this.state.game.teamBimgList[0]}}/>
                                            <Image style={{height: 30, width: 30, borderRadius: 15}}
                                                   source={{uri: this.state.game.teamBimgList[1]}}/>
                                        </View>
                                }

                                <View style={{marginTop:10,width:100,justifyContent:'center',alignItems:'center',padding:3}}>
                                    <View><Text style={{fontSize:14,color:'#fff'}}>{this.state.game.teamBName}</Text></View></View>

                            </View>

                        </View>

                        {/*计分UI*/}
                        <View style={{width:width,height:100,padding:6, paddingHorizontal: 12,flexDirection:'row',marginTop:10}}>

                            {/*队伍1*/}
                            <View style={{flex:4,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

                                <View style={{width:100,height:50,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
                                    <Text style={{fontSize:30,color:'#66CDAA',weight:'bold',}}>
                                        {this.state.match.score1}</Text></View>

                                <View style={{flex:1}}>
                                    {this.state.match.state?null:
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            width: 100
                                        }}>
                                            <TouchableOpacity style={{marginTop: 10, flex: 1, alignItems: 'flex-start'}}
                                                              onPress={() => {
                                                                  this.setState({match: Object.assign(this.state.match, {score1: this.state.match.score1 - 1})})
                                                              }}>
                                                <Ionicons name='md-remove-circle' size={25} color="#fff"/>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{marginTop: 10, flex: 1, alignItems: 'flex-end'}}
                                                              onPress={() => {
                                                                  this.setState({match: Object.assign(this.state.match, {score1: this.state.match.score1 + 1})})
                                                              }}>
                                                <Ionicons name='md-add-circle' size={25} color="#fff"/>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>

                            </View>

                            <View style={{flex: 1, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}/>

                            {/*队伍2*/}
                            <View style={{flex:4,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

                                <View style={{width:100,height:50,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
                                    <Text style={{fontSize:30,color:'#66CDAA',weight:'bold',}}>
                                        {this.state.match.score2}</Text></View>

                                <View style={{flex:1}}>
                                    {this.state.match.state ? null :
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            width: 100
                                        }}>
                                            <TouchableOpacity style={{marginTop: 10, flex: 1, alignItems: 'flex-start'}}
                                                              onPress={() => {
                                                                  this.setState({match: Object.assign(this.state.match, {score2: this.state.match.score2 - 1})})
                                                              }}>
                                                <Ionicons name='md-remove-circle' size={25} color="#fff"/>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{marginTop: 10, flex: 1, alignItems: 'flex-end'}}
                                                              onPress={() => {
                                                                  this.setState({match: Object.assign(this.state.match, {score2: this.state.match.score2 + 1})})
                                                              }}>
                                                <Ionicons name='md-add-circle' size={25} color="#fff"/>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>

                            </View>

                        </View>

                        {/*得分失误UI*/}
                        <View style={{flex:1,padding:6, paddingHorizontal: 20,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>

                            {/*队伍1*/}
                            <View style={{flex:4,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                            {/*正手发球失误*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                <View style={{flex:4}}>
                                    <Text style={{color:'#343434',fontSize:13}}>正手发球失误</Text>
                                </View>
                                <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.lostCount1}
                                </Text>
                                {
                                    this.state.match.state ? null :
                                        <TouchableOpacity
                                            style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                            onPress={() => {
                                                this.setState({recordA: Object.assign(this.state.recordA, {lostCount1: this.state.recordA.lostCount1 + 1})})
                                            }}>
                                            <Ionicons name='md-add' size={15} color="#aaa"/>
                                        </TouchableOpacity>
                                }
                            </View>

                            {/*反手发球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>反手发球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.lostCount2}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {lostCount2: this.state.recordA.lostCount2 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*高远球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>高远球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.lostCount3}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {lostCount3: this.state.recordA.lostCount3 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*杀球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>杀球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.lostCount4}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {lostCount4: this.state.recordA.lostCount4 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*吊球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>吊球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.lostCount5}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {lostCount5: this.state.recordA.lostCount5 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*搓球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>搓球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.lostCount6}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {lostCount6: this.state.recordA.lostCount6 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*勾对角失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:10,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>勾对角失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.lostCount7}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {lostCount7: this.state.recordA.lostCount7 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*杀球得分*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>杀球得分</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.scoreCount1}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {scoreCount1: this.state.recordA.scoreCount1 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*吊球得分*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>吊球得分</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.scoreCount2}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {scoreCount2: this.state.recordA.scoreCount2 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*搓球得分*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>搓球得分</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.scoreCount3}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {scoreCount3: this.state.recordA.scoreCount3 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*勾对角得分*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>勾对角得分</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.scoreCount4}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {scoreCount4: this.state.recordA.scoreCount4 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*推球得分*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>推球得分</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordA.scoreCount5}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordA: Object.assign(this.state.recordA, {scoreCount5: this.state.recordA.scoreCount5 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>
                            </View>

                            <View style={{flex: 1, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}/>

                            {/*队伍2*/}
                            <View style={{flex:4,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                {/*正手发球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>正手发球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.lostCount1}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {lostCount1: this.state.recordB.lostCount1 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*反手发球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>反手发球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.lostCount2}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {lostCount2: this.state.recordB.lostCount2 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*高远球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>高远球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.lostCount3}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {lostCount3: this.state.recordB.lostCount3 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*杀球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>杀球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.lostCount4}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {lostCount4: this.state.recordB.lostCount4 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*吊球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>吊球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.lostCount5}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {lostCount5: this.state.recordB.lostCount5 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*搓球失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>搓球失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.lostCount6}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {lostCount6: this.state.recordB.lostCount6 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*勾对角失误*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:10,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>勾对角失误</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.lostCount7}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {lostCount7: this.state.recordB.lostCount7 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*杀球得分*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>杀球得分</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.scoreCount1}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {scoreCount1: this.state.recordB.scoreCount1 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*吊球得分*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>吊球得分</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.scoreCount2}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {scoreCount2: this.state.recordB.scoreCount2 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*搓球得分*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>搓球得分</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.scoreCount3}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {scoreCount3: this.state.recordB.scoreCount3 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*勾对角得分*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>勾对角得分</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.scoreCount4}
                                    </Text>
                                    {
                                        this.state.match.state ? null :
                                            <TouchableOpacity
                                                style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                                onPress={() => {
                                                    this.setState({recordB: Object.assign(this.state.recordB, {scoreCount4: this.state.recordB.scoreCount4 + 1})})
                                                }}>
                                                <Ionicons name='md-add' size={15} color="#aaa"/>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/*推球得分*/}
                                <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,paddingHorizontal:10}}>
                                    <View style={{flex:4}}>
                                        <Text style={{color:'#343434',fontSize:13}}>推球得分</Text>
                                    </View>
                                    <Text style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',textAlign:'right',backgroundColor:'#fff'}}>{this.state.recordB.scoreCount5}
                                    </Text>
                                    {
                                        this.state.match.state?null:
                                        <TouchableOpacity
                                            style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                            onPress={() => {
                                                this.setState({recordB: Object.assign(this.state.recordB, {scoreCount5: this.state.recordB.scoreCount5 + 1})})
                                            }}>
                                            <Ionicons name='md-add' size={15} color="#aaa"/>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>

                        </View>

                        <View style={{flex: 1, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}/>

                        {/*开始比赛*/}
                        {
                            this.state.isStart?
                                <View style={{height:40,width:width,justifyContent: 'center',alignItems: 'center',marginTop: 20,marginBottom:20}}>
                                <TouchableOpacity style={{
                                    height: 40,
                                    width: 200,
                                    marginTop: 20,
                                    marginBottom: 20,
                                    backgroundColor: '#fc6254',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                                  onPress={() => {
                                                      this.setState({isStart:false,endTime:this.getNow()})
                                                      this.stopTime()
                                                      //将数据保存到数据库中

                                                      this.props.dispatch(CompleteMatch(this.state.match,this.state.recordA,this.state.recordB,this.state.game)).then((json)=>{
                                                          if(json.re==1)
                                                          {
                                                              DeviceEventEmitter.emit('on_record_finish',1)
                                                              this.goBack()
                                                          }
                                                          else {

                                                              Alert.alert('失败','本局比赛记录失败')

                                                              if(json.re=-100){
                                                                  this.props.dispatch(getAccessToken(false))
                                                              }
                                                          }
                                                      })

                                                  }}>
                                    <Text style={{textAlign: 'center', fontSize: 16, color: '#fff'}}>结束比赛</Text>
                                </TouchableOpacity></View>
                                :
                                <View style={{height:40,width:width,justifyContent: 'center',alignItems: 'center',marginTop: 20,marginBottom:20}}>
                                    {
                                        this.state.match.state?
                                            null:
                                        <TouchableOpacity style={{
                                            height: 40,
                                            width: 200,
                                            marginTop: 20,
                                            marginBottom: 20,
                                            backgroundColor: '#efb66a',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                                          onPress={() => {
                                                              this.setState({
                                                                  isStart: true,
                                                                  startTime: this.getNow(),
                                                                  hour: 0,
                                                                  minutes: 0,
                                                                  seconds: 0
                                                              })
                                                              this.countTime();
                                                          }}>
                                            <Text style={{textAlign: 'center', fontSize: 16, color: '#fff'}}>开始比赛</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                        }

                        </View>
                </ScrollView>

                </Toolbar>
            </View>
        )
    }

    countTime(){
        this._timer=setInterval(()=>{
            var seconds = this.state.seconds; //获取秒
            var minutes = this.state.minutes; //获取分
            var hour = this.state.hour;   //获取时间

            seconds++;

            if (seconds>59) { //如果秒大于0，则执行减1
                seconds=0;
                minutes++;
            }

            if (minutes>59) { //如果秒大于0，则执行减1
                minutes=0;
                hour++;
            }

            this.setState({seconds:seconds,minutes:minutes,hour:hour})

        },1000);
    }

    stopTime(){
        this._timer && clearInterval(this._timer);
    }

    componentWillUnmount(){
        this._timer && clearInterval(this._timer);
    }

    componentWillMount(){
        this.getMatchAndRecordInOneGame(this.props.game.id);
    }

    getMatchAndRecordInOneGame(gameId){

        //{recordAList=[{matchNoStr=第一局, teamId=224, matchNoId=1, matchId=146}, {matchNoStr=第二局, teamId=224, matchNoId=2, matchId=147}],
        //recordBList=[{matchNoStr=第一局, teamId=232, matchNoId=1, matchId=146}, {matchNoStr=第二局, teamId=232, matchNoId=2, matchId=147}],
        //matchList=[{matchNoStr=第一局, score2=14, matchNoId=1, gameClass=1, startTime=2018-10-30, score1=21, endTime=2018-10-30, state=1},
        // {matchNoStr=第二局, score2=21, matchNoId=2, gameClass=1, startTime=2018-10-30, score1=7, endTime=2018-10-30, state=1}]}


        this.props.dispatch(getMatchAndRecordInOneGame(gameId)).then((json)=>{
            if(json.re==1)
            {
                var matchList;var match;
                var recordAList;var recordA;
                var recordBList;var recordB;

                matchList = json.data.matchList;
                recordAList = json.data.recordAList;
                recordBList = json.data.recordBList;

                for(var i=0;i<matchList.length;i++){if(matchList[i].matchNoId==1)match=matchList[i]}
                for(var i=0;i<recordAList.length;i++){if(recordAList[i].matchNoId==1)recordA=recordAList[i]}
                for(var i=0;i<recordBList.length;i++){if(recordBList[i].matchNoId==1)recordB=recordBList[i]}

                this.setState({matchList:matchList,recordAList:recordAList,recordBList:recordBList,match:match,recordA:recordA,recordB:recordB});

            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }

    getNow() {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        let second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    };

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
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
    }
});


const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo
    const props = {
    }
    return props
}

export default connect(mapStateToProps)(CompetitionRecord);


