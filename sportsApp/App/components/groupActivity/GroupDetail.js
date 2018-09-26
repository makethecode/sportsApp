import React,{Component} from 'react';
import {
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
    Modal,
    Alert
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GridView from 'react-native-grid-view';
import GroupMemberModal from './GroupMemberModal';
import {
   searchMember,deleteGroup,exitGroup,fetchGroupMemberList,joinGroup,enableMyGroupOnFresh
} from '../../action/ActivityActions';
import {getAccessToken,} from '../../action/UserActions';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import MemberInformation from '../course/MemberInformation';

var {height, width} = Dimensions.get('window');

class GroupDetail extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2MemberInformation(personId){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'MemberInformation',
                component: MemberInformation,
                params: {
                    personId:personId,
                }
            })
        }
    }

    renderRow(rowData)
    {
  //      if(rowData.addNewOne==true && this.props.personInfo.personId == this.props.groupInfo.groupManagerId)
        if(rowData.addNewOne==true)
        {
            return  (
                <View style={{alignItems:'center',justifyContent:'center',margin:5}}>
                    <TouchableOpacity style={{height:50,width:50,justifyContent:'center',alignItems: 'center',borderWidth:2,borderColor:'#ddd',borderRadius:25}}
                                      onPress={()=>{
                                          //this.setState({modalVisible:true});
                                          //添加群成员
                }}>
                        <Ionicons name='md-add' size={30} color="#ddd"/>
                    </TouchableOpacity>
                    <View style={{width:60,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{numberOfLines:1,fontSize:12,color:'#666'}}> </Text>
                    </View>
                </View>

            );
        }else{
            return  (
                <View style={{alignItems:'center',justifyContent:'center',margin:5}}>
                    {
                        rowData.avatar ==''?
                            <TouchableOpacity style={{height:60,width:60,alignItems:'center',justifyContent:'center'}}
                                              onPress={()=>{
                                                  //成员信息
                                                  //this.navigate2MemberInformation(rowData.personId);
                                              }}>
                                <Image resizeMode="stretch" style={{height:50,width:50,borderRadius:25,}} source={require('../../../img/portrait.jpg')}/>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{height:60,width:60,alignItems:'center',justifyContent:'center'}}
                                  onPress={()=>{
                                      //成员信息
                                      //this.navigate2MemberInformation(rowData.personId);
                                  }}>
                                 <Image resizeMode="stretch" style={{height:50,width:50,borderRadius:25,}} source={{uri:rowData.avatar}}/>
                            </TouchableOpacity>
                    }
                    <View style={{width:60,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{numberOfLines:1,fontSize:12,color:'#666'}}>{rowData.name.substring(0,4)}</Text>
                    </View>
                </View>
            );
        }
    }

    searchMember(info){
        this.props.dispatch(searchMember(info)).then((json)=>{
            if(json.re==1){
                this.setState({member:json.data});
            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }else{
                    alert('该用户未注册，是否邀请');
                    //TODO:微信分享邀请好友
                }
            }
        });
    }

    deleteGroup(groupId)
    {
        this.props.dispatch(deleteGroup(groupId)).then((json)=>{
            if(json.re==1){
                Alert.alert('成功','删除成功');
                this.props.setMyGroupList();
                this.goBack();
            }else{
                Alert.alert('失败','删除失败');
            }
        });

    }

    exitGroup(group)
    {
        this.props.dispatch(exitGroup(group)).then((json)=>{
            if(json.re==1){
                Alert.alert('成功','退群成功');
                this.props.setMyGroupList();
                this.goBack();
            }else{
                Alert.alert('失败','退群失败');
            }
        });
    }

    joinGroup(groupId)
    {
        this.props.dispatch(joinGroup(groupId)).then((json)=> {
            if(json.re==1){
                Alert.alert('成功','加入成功');
                this.setMyGroupList();
                this.goBack();
            }else{
                Alert.alert('失败','您已加入')
            }
        }).catch((e)=>{
            alert(e)
        });
    }

    setMyGroupList(){
        this.props.dispatch(enableMyGroupOnFresh());
    }

    constructor(props) {
        super(props);
        this.state={
            modalVisible:false,
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            groupInfo:this.props.groupInfo,
            member:null,
            memberList:null,
        }
    }

    render() {

        var membergridView = null;

        if(this.state.memberList!=null && this.state.memberList.length>0) {

            var memberList = this.state.memberList;
            var dataSource = memberList;
            membergridView = (
            <GridView
                items={dataSource}
                itemsPerRow={5}
                renderItem={this.renderRow}
                style={styles.listView}
            />
            );

        }


        var flag = this.props.flag;
        var {personInfo}=this.props;

        return (
            <View style={{flex:1, backgroundColor:'#eee',}}>

                <Toolbar width={width}  title="群组详情" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>

                <ScrollView style={{width:width,height:height,backgroundColor:'#eee',}}>
                    <View style={{flex:1,backgroundColor:'#eee',marginBottom:5}}>
                        <View style={{flex:1,flexDirection:'row',backgroundColor:'#fff'}}>
                            <View style={{justifyContent:'center',alignItems: 'center',padding:10}}>
                                <Text>群成员</Text>
                            </View>
                        </View>
                        <View style={{backgroundColor:'#fff',paddingHorizontal:10,paddingVertical:5}}>
                            {membergridView}
                        </View>
                    </View>

                    <View style={{flex:1,backgroundColor:'#fff',paddingHorizontal:5}}>
                        <View style={{flex:1,flexDirection:'row',backgroundColor:'#fff',padding:12,justifyContent:'center',alignItems: 'center',
                                      borderBottomWidth:1,borderColor:'#eee'}}>
                            <View style={{flex:2}}>
                                <Text>群组名称</Text>
                            </View>
                            <View style={{flex:4,textAlign:'right',alignItems:'flex-end'}}>
                                <Text style={{color:'#444'}}>{this.state.groupInfo.groupName}</Text>
                            </View>
                        </View>

                        <View style={{flex:1,flexDirection:'row',backgroundColor:'#fff',padding:12,justifyContent:'center',alignItems: 'center',
                                      borderBottomWidth:1,borderColor:'#eee'}}>
                            <View style={{flex:2}}>
                                <Text>群号</Text>
                            </View>
                            <View style={{flex:4,textAlign:'right',alignItems:'flex-end'}}>
                                <Text style={{color:'#444'}}>{this.state.groupInfo.groupNum}</Text>
                            </View>
                        </View>

                        <View style={{flex:1,flexDirection:'row',backgroundColor:'#fff',padding:12,justifyContent:'center',alignItems: 'center',
                         borderBottomWidth:1,borderColor:'#eee'}}>
                            <View style={{flex:2}}>
                                <Text>群简介</Text>
                            </View>
                            <View style={{flex:4,textAlign:'right',alignItems:'flex-end'}}>
                                <Text style={{color:'#444'}}>{this.state.groupInfo.groupBrief}</Text>
                            </View>
                        </View>
                    </View>

                    {
                        (flag=='我的组详情'&&this.state.groupInfo.groupManagerId==personInfo.personId)?
                            <View style={{alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity style={{height:40,width:200,backgroundColor:'#EE6A50',margin:20,justifyContent:'center',alignItems: 'center'}}
                                      onPress={()=>{
                                            this.deleteGroup(this.props.groupInfo.groupId);
                                      }}>
                        <Text style={{color:'#fff',fontSize:15}}>删除群组</Text>
                    </TouchableOpacity></View>:null
                    }

                    {
                        (flag=='我的组详情'&&this.state.groupInfo.groupManagerId!==personInfo.personId)?
                            <View style={{alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity style={{height:40,width:200,backgroundColor:'#EE6A50',margin:20,justifyContent:'center',alignItems: 'center'}}
                                              onPress={()=>{
                                                  this.exitGroup(this.props.groupInfo);
                                      }}>
                                <Text style={{color:'#fff',fontSize:15}}>退出群组</Text>
                            </TouchableOpacity></View>:null
                    }

                    {
                        (flag=='其他组详情'&&this.state.groupInfo.groupManagerId!==personInfo.personId)?
                            <View style={{alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity style={{height:40,width:200,backgroundColor:'#66CDAA',margin:20,justifyContent:'center',alignItems: 'center'}}
                                              onPress={()=>{
                                                  if(this.props.groupInfo.groupMaxMemNum==this.props.groupInfo.groupNowMemNum)
                                                      alert("人数已满")
                                                  else
                                                  this.joinGroup(this.props.groupInfo.groupId);
                                              }}>
                                <Text style={{color:'#fff',fontSize:15}}>加入群组</Text>
                            </TouchableOpacity></View>:null
                    }


                </ScrollView>

                {/* Add GroupMember Modal*/}
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log("Modal has been closed.");
                    }}
                >

                    <GroupMemberModal
                        onClose={()=>{
                            this.setState({modalVisible:false});
                        }}
                        searchMember={(info)=>{
                            this.searchMember(info);
                        }}
                        member={this.state.member}
                        accessToken={this.props.accessToken}
                        setMemberList={()=>{
                            if(this.state.member!==null&&this.state.member!==undefined){
                                var memberList = this.state.memberList;
                                memberList.push(this.state.member);
                                this.setState({memberList:memberList});
                                //TODO:把新加入的成员添到数据库
                            }
                        }}
                    />

                </Modal>

                </Toolbar>
            </View>
        );
    }

    componentDidMount(){
        this.props.dispatch(fetchGroupMemberList(this.props.groupInfo.groupId))
            .then((json)=> {

                var memberList = json.data;
                this.setState({memberList:memberList})

            }).catch((e)=>{
            alert(e)
        });
    }

}

var styles = StyleSheet.create({
    listView: {
        backgroundColor: '#fff',
    },

});

module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(GroupDetail);
