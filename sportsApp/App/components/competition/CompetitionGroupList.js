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
    Modal
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
    updateTeamGroupList,fetchGroupList,createGroupList,addGroupList,deleteGroupList,deleteAllGroupList
} from '../../action/CompetitionActions';
import AddListTeamModal from './AddListTeamModal'
import EditListTeamModal from './EditListTeamModal'
import CompetitionRule from './CompetitionRule'

var {height, width} = Dimensions.get('window');

class CompetitionGroupList extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    navigate2CompetitionRule()
    {
        //比赛规则
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionRule',
                component: CompetitionRule,
                params: {
                }
            })
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
                this.deleteGroupList(rowData)
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
                                  this.deleteGroupList(rowData)
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
                                      this.deleteGroupList(rowData);
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
                                  this.deleteGroupList(rowData)
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
                                  this.deleteGroupList(rowData)
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
                                  this.deleteGroupList(rowData)
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
                                  this.deleteGroupList(rowData)
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
                                  this.deleteGroupList(rowData)
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
                                  this.deleteGroupList(rowData)
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
            gameClass:6,
            gameClassStr:'小组赛',
            gameClassButtons:['取消','冠亚军决赛','半决赛','8进4','16进8','32进16','小组赛'],

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
        }

    }

    render() {

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

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
                <Text style={{color:'#5c5c5c'}}>得分</Text>
            </View>
            {/*失分*/}
            <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                <Text style={{color:'#5c5c5c'}}>失分</Text>
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
                    <Text style={{color:'#5c5c5c'}}>得分</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>失分</Text>
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
                    <Text style={{color:'#5c5c5c'}}>得分</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>失分</Text>
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
                    <Text style={{color:'#5c5c5c'}}>得分</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>失分</Text>
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
                    <Text style={{color:'#5c5c5c'}}>得分</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>失分</Text>
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
                    <Text style={{color:'#5c5c5c'}}>得分</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>失分</Text>
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
                    <Text style={{color:'#5c5c5c'}}>得分</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>失分</Text>
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
                    <Text style={{color:'#5c5c5c'}}>得分</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>失分</Text>
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
                                              this.deleteAllGroupList();
                                          }}>
                           <Text style={{color:'#fff',fontSize:14}}>清空名单</Text>
                        </TouchableOpacity>
                    </View>
                    {<ScrollView style={{backgroundColor:'#eee'}}>
                        {//A组
                            (ListA==null || ListA.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} A组</Text></View>
                                    {headA}
                                    {ListAView}
                                    </View>
                        }
                        {//B组
                            (ListB==null || ListB.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} B组</Text></View>{headB}{ListBView}</View>
                        }
                        {//C组
                            (ListC==null || ListC.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} C组</Text></View>{headC}{ListCView}</View>
                        }
                        {//D组
                            (ListD==null || ListD.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} D组</Text></View>{headD}{ListDView}</View>
                        }
                        {//E组
                            (ListE==null || ListE.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} E组</Text></View>{headE}{ListEView}</View>
                        }
                        {//F组
                            (ListF==null || ListF.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} F组</Text></View>{headF}{ListFView}</View>
                        }
                        {//G组
                            (ListG==null || ListG.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} G组</Text></View>{headG}{ListGView}</View>
                        }
                        {//H组
                            (ListH==null || ListH.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} H组</Text></View>{headH}{ListHView}</View>
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
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }

    componentWillUnmount(){
    }

    componentDidMount(){
    this.fetchGroupList();
    }

    fetchGroupList(){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        this.props.dispatch(fetchGroupList(this.props.projectId,this.state.gameClass)).then((json)=>{
            if(json.re==1)
            {
                var listA = [];
                var listB = [];
                var listC = [];
                var listD = [];
                var listE = [];
                var listF = [];
                var listG = [];
                var listH = [];

                if(json.data!=null && json.data.length>0) {
                    this.setState({teams: json.data});
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

                this.setState({ListA:listA,ListB:listB,ListC:listC,ListD:listD,ListE:listE,ListF:listF,ListG:listG,ListH:listH});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })

    }

    deleteAllGroupList(){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        this.props.dispatch(deleteAllGroupList(this.props.projectId,this.state.gameClass)).then((json)=>{
            if(json.re==1)
            {
                var listA = [];
                var listB = [];
                var listC = [];
                var listD = [];
                var listE = [];
                var listF = [];
                var listG = [];
                var listH = [];

                this.setState({ListA:listA,ListB:listB,ListC:listC,ListD:listD,ListE:listE,ListF:listF,ListG:listG,ListH:listH});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
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
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CompetitionGroupList);



