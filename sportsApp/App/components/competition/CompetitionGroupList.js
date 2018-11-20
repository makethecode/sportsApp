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
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    ToastAndroid,
    Modal,
    ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import {getAccessToken,} from '../../action/UserActions';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_BOOK} from 'react-native-toolbar-wrapper'
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CompetitionTeamPerson from './CompetitionTeamPersonList'
import ActionSheet from 'react-native-actionsheet';
import {
    updateTeamGroupList,fetchGroupList,createGroupList,addGroupList,deleteGroupList,deleteAllGroupList,updateAllGroupList
} from '../../action/CompetitionActions';
import AddListTeamModal from './AddListTeamModal'
import EditListTeamModal from './EditListTeamModal'

var {height, width} = Dimensions.get('window');

class CompetitionGroupList extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    //选比赛等级
    _handlePress(index) {
        if(index!==0){
            var gameClassStr = this.state.gameClassButtons[index];
            var gameClass = index;
            this.setState({gameClass:gameClass,gameClassStr:gameClassStr});
            this.fetchGroupList();
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    //ListA行渲染
    renderListARow(rowData,sectionId,rowId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var imguri = rowData.avatar;
        var no = parseInt(rowId)+1

        var row=(
            <TouchableOpacity style={{padding:5,backgroundColor:'#fff',flexDirection:'row',marginTop:1}}
            onPress={()=>{
                this.setState({chooseTeamGroup:rowData,editTeamListModalVisible:true})
            }}>

                {/*队伍*/}
                <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start'}}>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{no}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                    <Image resizeMode="stretch" style={{height:30,width:30,borderRadius:15}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:2,justifyContent:'center',alignItems: 'center'}}>
                        <Text style={{color:'#5c5c5c'}}>{rowData.team}</Text>
                    </View>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.winCount}</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.lostCount}</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.rank}</Text>
                </View>
                {/*删除*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                onPress={()=>{
                            var ListA = this.state.ListA;
                            //var List = [];
                            //for(var i=0;i<ListA.length;i++){
                            //    if(ListA[i].teamId != rowData.teamId)List.push(ListA[i])
                            //}
                            //this.setState({ListA:List})
                            ListA.splice(rowId,1);
                            this.setState({ListA:ListA});
                            this.deleteGroupList(rowData);
                    }
                }>
                    <Ionicons name='md-close' size={18} color="#666"/>
                </TouchableOpacity>
                </TouchableOpacity>
        );
        return row;
    }

    //ListB行渲染
    renderListBRow(rowData,sectionId,rowId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var imguri = rowData.avatar;
        var no = parseInt(rowId)+1

        var row=(
            <TouchableOpacity style={{padding:5,backgroundColor:'#fff',flexDirection:'row',marginTop:1}}
                              onPress={()=>{
                                  this.setState({chooseTeamGroup:rowData,editTeamListModalVisible:true})
                              }}>

                {/*队伍*/}
                <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start'}}>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{no}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:30,width:30,borderRadius:15}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:2,justifyContent:'center',alignItems: 'center'}}>
                        <Text style={{color:'#5c5c5c'}}>{rowData.team}</Text>
                    </View>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.winCount}</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.lostCount}</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.rank}</Text>
                </View>
                {/*删除*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      var ListB = this.state.ListB;
                                      //var List = [];
                                      //for(var i=0;i<ListA.length;i++){
                                      //    if(ListA[i].teamId != rowData.teamId)List.push(ListA[i])
                                      //}
                                      //this.setState({ListA:List})
                                      ListB.splice(rowId,1);
                                      this.setState({ListB:ListB});
                                  }
                                  }>
                    <Ionicons name='md-close' size={18} color="#666"/>
                </TouchableOpacity>
            </TouchableOpacity>
        );
        return row;
    }

    //ListC行渲染
    renderListCRow(rowData,sectionId,rowId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var imguri = rowData.avatar;
        var no = parseInt(rowId)+1

        var row=(
            <TouchableOpacity style={{padding:5,backgroundColor:'#fff',flexDirection:'row',marginTop:1}}
                              onPress={()=>{
                                  this.setState({chooseTeamGroup:rowData,editTeamListModalVisible:true})
                              }}>
                {/*队伍*/}
                <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start'}}>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{no}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:30,width:30,borderRadius:15}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:2,justifyContent:'center',alignItems: 'center'}}>
                        <Text style={{color:'#5c5c5c'}}>{rowData.team}</Text>
                    </View>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.winCount}</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.lostCount}</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.rank}</Text>
                </View>
                {/*删除*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      var ListC = this.state.ListC;
                                      //var List = [];
                                      //for(var i=0;i<ListA.length;i++){
                                      //    if(ListA[i].teamId != rowData.teamId)List.push(ListA[i])
                                      //}
                                      //this.setState({ListA:List})
                                      ListC.splice(rowId,1);
                                      this.setState({ListC:ListC});
                                      this.deleteGroupList(rowData);
                                  }
                                  }>
                    <Ionicons name='md-close' size={18} color="#666"/>
                </TouchableOpacity>
            </TouchableOpacity>
        );
        return row;
    }

    //ListD行渲染
    renderListDRow(rowData,sectionId,rowId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var imguri = rowData.avatar;
        var no = parseInt(rowId)+1

        var row=(
            <TouchableOpacity style={{padding:5,backgroundColor:'#fff',flexDirection:'row',marginTop:1}}
                              onPress={()=>{
                                  this.setState({chooseTeamGroup:rowData,editTeamListModalVisible:true})
                              }}>
                {/*队伍*/}
                <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start'}}>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{no}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:30,width:30,borderRadius:15}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:2,justifyContent:'center',alignItems: 'center'}}>
                        <Text style={{color:'#5c5c5c'}}>{rowData.team}</Text>
                    </View>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.winCount}</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.lostCount}</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.rank}</Text>
                </View>
                {/*删除*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      var ListD = this.state.ListD;
                                      //var List = [];
                                      //for(var i=0;i<ListA.length;i++){
                                      //    if(ListA[i].teamId != rowData.teamId)List.push(ListA[i])
                                      //}
                                      //this.setState({ListA:List})
                                      ListD.splice(rowId,1);
                                      this.setState({ListD:ListD});
                                      this.deleteGroupList(rowData);
                                  }
                                  }>
                    <Ionicons name='md-close' size={18} color="#666"/>
                </TouchableOpacity>
            </TouchableOpacity>
        );
        return row;
    }

    //ListE行渲染
    renderListERow(rowData,sectionId,rowId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var imguri = rowData.avatar;
        var no = parseInt(rowId)+1

        var row=(
            <TouchableOpacity style={{padding:5,backgroundColor:'#fff',flexDirection:'row',marginTop:1}}
                              onPress={()=>{
                                  this.setState({chooseTeamGroup:rowData,editTeamListModalVisible:true})
                              }}>
                {/*队伍*/}
                <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start'}}>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{no}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:30,width:30,borderRadius:15}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:2,justifyContent:'center',alignItems: 'center'}}>
                        <Text style={{color:'#5c5c5c'}}>{rowData.team}</Text>
                    </View>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.winCount}</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.lostCount}</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.rank}</Text>
                </View>
                {/*删除*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      var ListE = this.state.ListE;
                                      //var List = [];
                                      //for(var i=0;i<ListA.length;i++){
                                      //    if(ListA[i].teamId != rowData.teamId)List.push(ListA[i])
                                      //}
                                      //this.setState({ListA:List})
                                      ListE.splice(rowId,1);
                                      this.setState({ListE:ListE});
                                      this.deleteGroupList(rowData);
                                  }
                                  }>
                    <Ionicons name='md-close' size={18} color="#666"/>
                </TouchableOpacity>
            </TouchableOpacity>
        );
        return row;
    }

    //ListF行渲染
    renderListFRow(rowData,sectionId,rowId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var imguri = rowData.avatar;
        var no = parseInt(rowId)+1

        var row=(
            <TouchableOpacity style={{padding:5,backgroundColor:'#fff',flexDirection:'row',marginTop:1}}
                              onPress={()=>{
                                  this.setState({chooseTeamGroup:rowData,editTeamListModalVisible:true})
                              }}>
                {/*队伍*/}
                <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start'}}>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{no}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:30,width:30,borderRadius:15}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:2,justifyContent:'center',alignItems: 'center'}}>
                        <Text style={{color:'#5c5c5c'}}>{rowData.team}</Text>
                    </View>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.winCount}</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.lostCount}</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.rank}</Text>
                </View>
                {/*删除*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      var ListF = this.state.ListF;
                                      //var List = [];
                                      //for(var i=0;i<ListA.length;i++){
                                      //    if(ListA[i].teamId != rowData.teamId)List.push(ListA[i])
                                      //}
                                      //this.setState({ListA:List})
                                      ListF.splice(rowId,1);
                                      this.setState({ListF:ListF});
                                      this.deleteGroupList(rowData);
                                  }
                                  }>
                    <Ionicons name='md-close' size={18} color="#666"/>
                </TouchableOpacity>
            </TouchableOpacity>
        );
        return row;
    }

    //ListG行渲染
    renderListGRow(rowData,sectionId,rowId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var imguri = rowData.avatar;
        var no = parseInt(rowId)+1

        var row=(
            <TouchableOpacity style={{padding:5,backgroundColor:'#fff',flexDirection:'row',marginTop:1}}
                              onPress={()=>{
                                  this.setState({chooseTeamGroup:rowData,editTeamListModalVisible:true})
                              }}>
                {/*队伍*/}
                <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start'}}>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{no}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:30,width:30,borderRadius:15}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:2,justifyContent:'center',alignItems: 'center'}}>
                        <Text style={{color:'#5c5c5c'}}>{rowData.team}</Text>
                    </View>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.winCount}</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.lostCount}</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.rank}</Text>
                </View>
                {/*删除*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      var ListG = this.state.ListG;
                                      //var List = [];
                                      //for(var i=0;i<ListA.length;i++){
                                      //    if(ListA[i].teamId != rowData.teamId)List.push(ListA[i])
                                      //}
                                      //this.setState({ListA:List})
                                      ListG.splice(rowId,1);
                                      this.setState({ListG:ListG});
                                      this.deleteGroupList(rowData);
                                  }
                                  }>
                    <Ionicons name='md-close' size={18} color="#666"/>
                </TouchableOpacity>
            </TouchableOpacity>
        );
        return row;
    }

    //ListH行渲染
    renderListHRow(rowData,sectionId,rowId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var imguri = rowData.avatar;
        var no = parseInt(rowId)+1

        var row=(
            <TouchableOpacity style={{padding:5,backgroundColor:'#fff',flexDirection:'row',marginTop:1}}
                              onPress={()=>{
                                  this.setState({chooseTeamGroup:rowData,editTeamListModalVisible:true})
                              }}>
                {/*队伍*/}
                <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start'}}>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{no}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:30,width:30,borderRadius:15}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:2,justifyContent:'center',alignItems: 'center'}}>
                        <Text style={{color:'#5c5c5c'}}>{rowData.team}</Text>
                    </View>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.winCount}</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.lostCount}</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.rank}</Text>
                </View>
                {/*删除*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      var ListH = this.state.ListH;
                                      //var List = [];
                                      //for(var i=0;i<ListA.length;i++){
                                      //    if(ListA[i].teamId != rowData.teamId)List.push(ListA[i])
                                      //}
                                      //this.setState({ListA:List})
                                      ListH.splice(rowId,1);
                                      this.setState({ListH:ListH});
                                      this.deleteGroupList(rowData);
                                  }
                                  }>
                    <Ionicons name='md-close' size={18} color="#666"/>
                </TouchableOpacity>
            </TouchableOpacity>
        );
        return row;
    }

    constructor(props) {
        super(props);
        this.state = {
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            teams:[],
            //初始
            gameClass:1,
            gameClassStr:'小组赛',
            gameClassButtons:['取消','小组赛','32进16','16进8','8进4','半决赛','冠亚军决赛'],

            //分组
            ListA:[],
            ListB:[],
            ListC:[],
            ListD:[],
            ListE:[],
            ListF:[],
            ListG:[],
            ListH:[],

            addTeamListModalVisible:false,
            editTeamListModalVisible:false,
            chooseListType:'',
            chooseTeamGroup:'',

            showProgress:false,
        }

    }

    render() {

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        var projectType = '';

        switch (this.props.projectType){
            case '1':projectType='男单';break;
            case '2':projectType='女单';break;
            case '3':projectType='男双';break;
            case '4':projectType='女双';break;
            case '5':projectType='混双';break;
            case '6':projectType='团体';break;
        }

        //A组
        var ListAView = null;
        var ListA = this.state.ListA;

            var dsA = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (ListA !== undefined && ListA !== null && ListA.length > 0) {
                ListAView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={dsA.cloneWithRows(ListA)}
                        renderRow={this.renderListARow.bind(this)}
                    />
                );
            }

        //B组
        var ListBView = null;
        var ListB = this.state.ListB;

        var dsB = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListB !== undefined && ListB !== null && ListB.length > 0) {
            ListBView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsB.cloneWithRows(ListB)}
                    renderRow={this.renderListBRow.bind(this)}
                />
            );
        }

        //C组
        var ListCView = null;
        var ListC = this.state.ListC;

        var dsC = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListC !== undefined && ListC !== null && ListC.length > 0) {
            ListCView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsC.cloneWithRows(ListC)}
                    renderRow={this.renderListCRow.bind(this)}
                />
            );
        }

        //D组
        var ListDView = null;
        var ListD = this.state.ListD;

        var dsD = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListD !== undefined && ListD !== null && ListD.length > 0) {
            ListDView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsD.cloneWithRows(ListD)}
                    renderRow={this.renderListDRow.bind(this)}
                />
            );
        }

        //E组
        var ListEView = null;
        var ListE = this.state.ListE;

        var dsE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListE !== undefined && ListE !== null && ListE.length > 0) {
            ListEView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsE.cloneWithRows(ListE)}
                    renderRow={this.renderListERow.bind(this)}
                />
            );
        }

        //F组
        var ListFView = null;
        var ListF = this.state.ListF;

        var dsF = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListF !== undefined && ListF !== null && ListF.length > 0) {
            ListFView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsF.cloneWithRows(ListF)}
                    renderRow={this.renderListFRow.bind(this)}
                />
            );
        }

        //G组
        var ListGView = null;
        var ListG = this.state.ListG;

        var dsG = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListG !== undefined && ListG !== null && ListG.length > 0) {
            ListGView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsG.cloneWithRows(ListG)}
                    renderRow={this.renderListGRow.bind(this)}
                />
            );
        }

        //H组
        var ListHView = null;
        var ListH = this.state.ListH;

        var dsH = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListH !== undefined && ListH !== null && ListH.length > 0) {
            ListHView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsH.cloneWithRows(ListH)}
                    renderRow={this.renderListHRow.bind(this)}
                />
            );
        }

        //表头A
        var headA = (
            <View style={{padding:5,backgroundColor:'#eee',flexDirection:'row',marginTop:1}}>
                {/*队伍*/}
            <View style={{flex:3,padding:5,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#5c5c5c'}}>队伍</Text>
            </View>
            {/*得分*/}
            <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                <Text style={{color:'#5c5c5c'}}>胜</Text>
            </View>
            {/*失分*/}
            <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                <Text style={{color:'#5c5c5c'}}>负</Text>
            </View>
            {/*排名*/}
            <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                <Text style={{color:'#5c5c5c'}}>排名</Text>
            </View>
            {/*增加*/}
            <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                              onPress={()=>{
                                  this.setState({addTeamListModalVisible:true,chooseListType:0})
                              }}>
                <Ionicons name='md-add' size={18} color="#666"/>
            </TouchableOpacity>
        </View>
        )

        //表头B
        var headB = (
            <View style={{padding:5,backgroundColor:'#eee',flexDirection:'row',marginTop:1}}>
                {/*队伍*/}
                <View style={{flex:3,padding:5,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#5c5c5c'}}>队伍</Text>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>胜</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>负</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>排名</Text>
                </View>
                {/*增加*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      this.setState({addTeamListModalVisible:true,chooseListType:1})
                                  }}>
                    <Ionicons name='md-add' size={18} color="#666"/>
                </TouchableOpacity>
            </View>
        )

        //表头C
        var headC = (
            <View style={{padding:5,backgroundColor:'#eee',flexDirection:'row',marginTop:1}}>
                {/*队伍*/}
                <View style={{flex:3,padding:5,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#5c5c5c'}}>队伍</Text>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>胜</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>负</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>排名</Text>
                </View>
                {/*增加*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      this.setState({addTeamListModalVisible:true,chooseListType:2})
                                  }}>
                    <Ionicons name='md-add' size={18} color="#666"/>
                </TouchableOpacity>
            </View>
        )

        //表头D
        var headD = (
            <View style={{padding:5,backgroundColor:'#eee',flexDirection:'row',marginTop:1}}>
                {/*队伍*/}
                <View style={{flex:3,padding:5,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#5c5c5c'}}>队伍</Text>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>胜</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>负</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>排名</Text>
                </View>
                {/*增加*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      this.setState({addTeamListModalVisible:true,chooseListType:3})
                                  }}>
                    <Ionicons name='md-add' size={18} color="#666"/>
                </TouchableOpacity>
            </View>
        )

        //表头E
        var headE = (
            <View style={{padding:5,backgroundColor:'#eee',flexDirection:'row',marginTop:1}}>
                {/*队伍*/}
                <View style={{flex:3,padding:5,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#5c5c5c'}}>队伍</Text>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>胜</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>负</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>排名</Text>
                </View>
                {/*增加*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      this.setState({addTeamListModalVisible:true,chooseListType:4})
                                  }}>
                    <Ionicons name='md-add' size={18} color="#666"/>
                </TouchableOpacity>
            </View>
        )

        //表头F
        var headF = (
            <View style={{padding:5,backgroundColor:'#eee',flexDirection:'row',marginTop:1}}>
                {/*队伍*/}
                <View style={{flex:3,padding:5,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#5c5c5c'}}>队伍</Text>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>胜</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>负</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>排名</Text>
                </View>
                {/*增加*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      this.setState({addTeamListModalVisible:true,chooseListType:5})
                                  }}>
                    <Ionicons name='md-add' size={18} color="#666"/>
                </TouchableOpacity>
            </View>
        )

        //表头G
        var headG = (
            <View style={{padding:5,backgroundColor:'#eee',flexDirection:'row',marginTop:1}}>
                {/*队伍*/}
                <View style={{flex:3,padding:5,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#5c5c5c'}}>队伍</Text>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>胜</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>负</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>排名</Text>
                </View>
                {/*增加*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      this.setState({addTeamListModalVisible:true,chooseListType:6})
                                  }}>
                    <Ionicons name='md-add' size={18} color="#666"/>
                </TouchableOpacity>
            </View>
        )

        //表头H
        var headH = (
            <View style={{padding:5,backgroundColor:'#eee',flexDirection:'row',marginTop:1}}>
                {/*队伍*/}
                <View style={{flex:3,padding:5,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#5c5c5c'}}>队伍</Text>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>胜</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>负</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>排名</Text>
                </View>
                {/*增加*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                                  onPress={()=>{
                                      this.setState({addTeamListModalVisible:true,chooseListType:7})
                                  }}>
                    <Ionicons name='md-add' size={18} color="#666"/>
                </TouchableOpacity>
            </View>
        )

        return (
            <View style={{flex:1}}>
                <Toolbar width={width} title="赛事安排" navigator={this.props.navigator}
                         actions={[{icon:ACTION_BOOK,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0) {
                                // this.deleteAllGroupList();
                             }
                         }}>
                    <View style={{width:width,height:40,backgroundColor:'#fff',flexDirection:'row',marginTop:0.7,marginBottom:0.7}}>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#66CDAA'}}
                                          onPress={()=>{ this.show('actionSheet'); }}>
                            {
                                this.state.gameClassStr==null?
                                    <View style={{flex:1,justifyContent:'center',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#fff',fontSize:14}}>请选择比赛等级</Text>
                                    </View> :
                                    <View style={{flex:1,justifyContent:'center',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#fff',fontSize:14}}>{this.state.gameClassStr}</Text>
                                    </View>

                            }
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet =p;
                                }}
                                title="请选择比赛等级"
                                options={this.state.gameClassButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress(data); }
                                }
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',backgroundColor:'#66CDAA',marginLeft:0.7}}
                                          onPress={()=>{
                                              this.createGroupList();
                                          }}>
                        <Text style={{color:'#fff',fontSize:14}}>生成名单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',backgroundColor:'#66CDAA',marginLeft:0.7}}
                                          onPress={()=>{
                                              this.createRankList();
                                          }}>
                           <Text style={{color:'#fff',fontSize:14}}>生成排名</Text>
                        </TouchableOpacity>
                    </View>
                    {<ScrollView style={{backgroundColor:'#eee'}}>
                        {//A组
                            (ListA==null || ListA.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{projectType} A组</Text></View>
                                    {headA}
                                    {ListAView}
                                    </View>
                        }
                        {//B组
                            (ListB==null || ListB.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{projectType} B组</Text></View>{headB}{ListBView}</View>
                        }
                        {//C组
                            (ListC==null || ListC.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{projectType} C组</Text></View>{headC}{ListCView}</View>
                        }
                        {//D组
                            (ListD==null || ListD.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{projectType} D组</Text></View>{headD}{ListDView}</View>
                        }
                        {//E组
                            (ListE==null || ListE.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{projectType} E组</Text></View>{headE}{ListEView}</View>
                        }
                        {//F组
                            (ListF==null || ListF.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{projectType} F组</Text></View>{headF}{ListFView}</View>
                        }
                        {//G组
                            (ListG==null || ListG.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{projectType} G组</Text></View>{headG}{ListGView}</View>
                        }
                        {//H组
                            (ListH==null || ListH.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{projectType} H组</Text></View>{headH}{ListHView}</View>
                        }
                    </ScrollView>
                    }

                    {/* Add AddTeamList Modal*/}
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.addTeamListModalVisible}
                        onRequestClose={() => {}}
                    >
                        <AddListTeamModal
                            onClose={()=>{
                                this.setState({addTeamListModalVisible:false});
                            }}
                            chooseListType={this.state.chooseListType}
                            teams={this.state.teams}

                            ListA={this.state.ListA}
                            ListB={this.state.ListB}
                            ListC={this.state.ListC}
                            ListD={this.state.ListD}
                            ListE={this.state.ListE}
                            ListF={this.state.ListF}
                            ListG={this.state.ListG}
                            ListH={this.state.ListH}

                            setList={(team)=>{
                                this.addGroupList(team,this.props.projectId)
                            }}
                        />
                    </Modal>

                    {/* Add EditTeamList Modal*/}
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.editTeamListModalVisible}
                        onRequestClose={() => {}}
                    >
                        <EditListTeamModal
                            onClose={()=>{
                                this.setState({editTeamListModalVisible:false});
                            }}
                            chooseTeamGroup={this.state.chooseTeamGroup}
                            updateList={(teamGroup)=>{
                                this.props.dispatch(updateTeamGroupList(teamGroup)).then((json)=>{
                                    if(json.re==1)
                                    {}
                                    else {
                                        if(json.re=-100){
                                            this.props.dispatch(getAccessToken(false))
                                        }
                                        Alert.alert('失败','队伍信息修改失败');
                                    }
                                })
                            }}
                        />
                    </Modal>

                    {/*loading模态框*/}
                    <Modal animationType={"fade"} transparent={true} visible={this.state.showProgress}>
                        <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                          onPress={()=>{
                                              //TODO:cancel this behaviour

                                          }}>
                            <View style={{width:width*2/3,height:80,backgroundColor:'transparent',position:'relative',
                                justifyContent:'center',alignItems:'center',borderRadius:6}}>
                                <ActivityIndicator
                                    animating={true}
                                    style={{marginTop:10,height: 40,position:'absolute',transform: [{scale: 1.6}]}}
                                    size="large"
                                />
                                <View style={{flexDirection:'row',justifyContent:'center',marginTop:45}}>
                                    <Text style={{color:'#666',fontSize:13}}>
                                        加载中...
                                    </Text>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                </Toolbar>
            </View>
        );
    }

    createGroupList(){


        this.props.dispatch(createGroupList(this.props.projectId,this.state.gameClass)).then((json)=>{
            if(json.re==1)
            {
                this.fetchGroupList();
            }
            else {
                //对返回的错误信息进行处理
                Alert.alert('生成失败',json.data);
            }
        })
    }

    componentWillUnmount(){
    }

    componentDidMount(){
    this.fetchGroupList();
    }

    createRankList(){
        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var listA = this.state.ListA;var listB = this.state.ListB;var listC = this.state.ListC;var listD = this.state.ListD;
        var listE = this.state.ListE;var listF = this.state.ListF;var listG = this.state.ListG;var listH = this.state.ListH;

        var resList = [];

        //先按照负=输的次数少则靠前=按负的次数升序（次元）
        //再按照胜=胜的次数多则靠前=按胜的次数降序（主元）
        if(listA!=null && listA.length>0) {
            listA.sort(function (a, b) {
                return a.lostCount - b.lostCount
            });

            listA.sort(function (a, b) {
                return b.winCount - a.winCount
            });

            for(var i=0;i<listA.length;i++){
                listA[i].rank=i+1;
            }

            this.setState({ListA:listA})

            resList.push(listA)
        }

        if(listB!=null && listB.length>0) {
            listB.sort(function (a, b) {
                return a.lostCount - b.lostCount
            });

            listB.sort(function (a, b) {
                return b.winCount - a.winCount
            });

            for(var i=0;i<listB.length;i++){
                listB[i].rank=i+1;
            }

            this.setState({ListB:listB})

            resList.push(listB)
        }

        if(listC!=null && listC.length>0) {
            listC.sort(function (a, b) {
                return a.lostCount - b.lostCount
            });

            listC.sort(function (a, b) {
                return b.winCount - a.winCount
            });

            for(var i=0;i<listC.length;i++){
                listC[i].rank=i+1;
            }

            this.setState({ListC:listC})

            resList.push(listC)
        }

        if(listD!=null && listD.length>0) {
            listD.sort(function (a, b) {
                return a.lostCount - b.lostCount
            });

            listD.sort(function (a, b) {
                return b.winCount - a.winCount
            });

            for(var i=0;i<listD.length;i++){
                listD[i].rank=i+1;
            }

            this.setState({ListD:listD})

            resList.push(listD)
        }

        if(listE!=null && listE.length>0) {
            listE.sort(function (a, b) {
                return a.lostCount - b.lostCount
            });

            listE.sort(function (a, b) {
                return b.winCount - a.winCount
            });

            for(var i=0;i<listE.length;i++){
                listE[i].rank=i+1;
            }

            this.setState({ListE:listE})

            resList.push(listE)
        }

        if(listF!=null && listF.length>0) {
            listF.sort(function (a, b) {
                return a.lostCount - b.lostCount
            });

            listF.sort(function (a, b) {
                return b.winCount - a.winCount
            });

            for(var i=0;i<listF.length;i++){
                listF[i].rank=i+1;
            }

            this.setState({ListF:listF})

            resList.push(listF)
        }

        if(listG!=null && listG.length>0) {
            listG.sort(function (a, b) {
                return a.lostCount - b.lostCount
            });

            listG.sort(function (a, b) {
                return b.winCount - a.winCount
            });

            for(var i=0;i<listG.length;i++){
                listG[i].rank=i+1;
            }

            this.setState({ListG:listG})

            resList.push(listG)
        }

        if(listH!=null && listH.length>0) {
            listH.sort(function (a, b) {
                return a.lostCount - b.lostCount
            });

            listH.sort(function (a, b) {
                return b.winCount - a.winCount
            });

            for(var i=0;i<listA.length;i++){
                listH[i].rank=i+1;
            }

            this.setState({ListH:listH})

            resList.push(listH)
        }

        this.props.dispatch(updateAllGroupList(resList)).then((json)=>{
            if(json.re==1)
            {
                Alert.alert('成功','排名成功')
            }
            else{
                Alert.alert('失败','排名失败,请手动排名')
            }
        })

    }

    fetchGroupList(){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        this.setState({showProgress:true})

        this.props.dispatch(fetchGroupList(this.props.projectId,this.state.gameClass)).then((json)=>{

            this.setState({showProgress:false})

            var listA = [];
            var listB = [];
            var listC = [];
            var listD = [];
            var listE = [];
            var listF = [];
            var listG = [];
            var listH = [];

            if(json.re==1){

                if(json.data!=null && json.data.length>0) {
                    var teams = json.data;

                    for (var i = 0; i < teams.length; i++) {
                        var team = teams[i]

                        switch (team.groupId) {
                            case 0:
                                listA.push(team);
                                break;
                            case 1:
                                listB.push(team);
                                break;
                            case 2:
                                listC.push(team);
                                break;
                            case 3:
                                listD.push(team);
                                break;
                            case 4:
                                listE.push(team);
                                break;
                            case 5:
                                listF.push(team);
                                break;
                            case 6:
                                listG.push(team);
                                break;
                            case 7:
                                listH.push(team);
                                break;
                        }
                    }
                }

                this.setState({teams:json.data,ListA:listA,ListB:listB,ListC:listC,ListD:listD,ListE:listE,ListF:listF,ListG:listG,ListH:listH,});
            }else{
                this.setState({ListA:listA,ListB:listB,ListC:listC,ListD:listD,ListE:listE,ListF:listF,ListG:listG,ListH:listH,});
            }
        })

    }

    addGroupList(team,projectId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        switch (this.state.chooseListType){
            case 0:
                var ListA = this.state.ListA;
                team.groupId = 0;
                ListA.push(team);
                this.setState({ListA:ListA});
                break;
            case 1:
                var ListB = this.state.ListB;
                team.groupId = 1;
                ListB.push(team);
                this.setState({ListB:ListB});
                break;
            case 2:
                var ListC = this.state.ListC;
                team.groupId = 2;
                ListC.push(team);
                team.groupId = 2;
                this.setState({ListC:ListC});
                break;
            case 3:
                var ListD = this.state.ListD;
                team.groupId = 3;
                ListD.push(team);
                this.setState({ListD:ListD});
                break;
            case 4:
                var ListE = this.state.ListE;
                team.groupId = 4;
                ListE.push(team);
                this.setState({ListE:ListE});
                break;
            case 5:
                var ListF = this.state.ListF;
                team.groupId = 5;
                ListF.push(team);
                this.setState({ListF:ListF});
                break;
            case 6:
                var ListG = this.state.ListG;
                team.groupId = 6;
                ListG.push(team);
                this.setState({ListG:ListG});
                break;
            case 7:
                var ListH = this.state.ListH;
                team.groupId = 7;
                ListH.push(team);
                this.setState({ListH:ListH});
                break;
        }

        this.props.dispatch(addGroupList(team,projectId)).then((json)=>{
            if(json.re==1){}
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }

    deleteGroupList(team){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        this.props.dispatch(deleteGroupList(team)).then((json)=>{
            if(json.re==1){}
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }

}

var styles = StyleSheet.create({
    container: {
    },
    siftWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        height: 44,
        borderBottomColor: '#cdcdcd',
    },
    viewWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        height: 50,
        borderBottomColor: '#cdcdcd',
    },
    siftCell: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewCell: {
        height: 50,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    orderByFont: {
        color:'#5c5c5c',
        marginRight: 5
    },
    paymentItem: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    flexContainer: {
        flexDirection: 'row',
    },
    textstyle: {
        fontSize: 13,
        textAlign: 'center',
        color:'#646464',
        justifyContent:'center',
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'transparent'
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CompetitionGroupList);



