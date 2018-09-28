import React,{Component} from 'react';
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
    Modal,
} from 'react-native';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInputWrapper from 'react-native-text-input-wrapper';
import GroupMemberModal from './GroupMemberModal';
import {
    createGroup,searchMember,enableMyGroupOnFresh
} from '../../action/ActivityActions';
import {getAccessToken,} from '../../action/UserActions';

var {height, width} = Dimensions.get('window');

class CreateGroup extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    searchMember(info){
        this.props.dispatch(searchMember(info)).then((json)=>{
            if(json.re==1){
                this.setState({searchList:json.data});
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

    removeMember(memberList,rowData) {
        var index=null;
        memberList.map((member, i) => {
            if(member.mobilePhone==rowData.mobilePhone){
                index = i;
            }else{
                index=-1;
            }
        });
        if(index!==-1){
            memberList.splice(index,1);
            this.setState({memberList:memberList});
        }
    }

    createGroup(info){
        this.props.dispatch(createGroup(info)).then((json)=>{
            if(json.re==1){
                Alert.alert('信息','创建成功',[{text:'确认',onPress:()=>{
                    this.props.dispatch(enableMyGroupOnFresh());
                    this.goBack()
                }}]);
            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }else{
                    alert('创建失败');
                }

            }
        });
    }

    renderRow(rowData,sectionId,rowId){
        var row=(
            <View style={{flex:1,flexDirection:'row',backgroundColor:'#fff',marginBottom:5,padding:5,borderBottomWidth:1,
            borderColor:'#eee',borderRadius:3}}>
                {
                    rowData.avatar==""?
                        <View style={{flex: 1}}>
                            <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                   source={require('../../../img/portrait.jpg')}/>
                        </View>
                        :
                    <View style={{flex: 1}}>
                        <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                               source={{uri: rowData.avatar}}/>
                    </View>
                }
                <View style={{flex:3,marginLeft:5}}>
                    <View style={{flexDirection:'row',marginLeft:10}}>
                        <Icon name={'user'} size={15} color="pink"/>
                        <Text style={{marginLeft:10,color:'#343434'}}>{rowData.perNum}</Text>
                    </View>
                    <View  style={{flexDirection:'row',marginLeft:10,marginTop:5}}>
                        <Icon name={'phone'} size={15} color="#87CEFF"/>
                        <Text style={{marginLeft:10,color:'#aaa'}}>{rowData.mobilePhone}</Text>
                    </View>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems: 'center',}}>

                </View>
                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',margin:10,borderWidth:1,borderColor:'#FF4040',borderRadius:5}}
                                  onPress={()=>{
                                        this.removeMember(this.state.memberList,rowData);
                }}>
                    <Text style={{color:'#FF4040',fontSize:12,}}>删除</Text>
                </TouchableOpacity>
            </View>
        );
        return row;
    }

    constructor(props) {
        super(props);
        this.state={
            modalVisible:false,
            group:{groupName:null,groupBrief:null,groupMaxMemNum:null},
            doingFetch: false,
            isRefreshing: false,
            member:null,
            memberList:[],
            searchList:[],
        }
        var person = {personId:this.props.personInfo.personId,perNum:this.props.personInfo.perNum,mobilePhone:this.props.personInfo.mobilePhone,avatar:this.props.portrait};
        // person.username = this.props.user.username;
        this.state.memberList.push(person);
    }

    render() {

        var memberList = this.state.memberList;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if(memberList!==undefined&&memberList!==null&&memberList.length>0)
        {
            memberListView=(
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(memberList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }


        return (
            <View style={{flex:1}}>
                <Toolbar width={width}  title="创建新群" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>

                <View style={{flex:5,backgroundColor:'#fff',padding:10}}>

                    {/*群名*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff'
                    ,margin:10,marginTop:5,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>群名</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>

                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入群名"
                                val={this.state.group.groupName==null?'':this.state.group.groupName==null}
                                onChangeText={
                                    (value)=>{
                                        this.setState({group:Object.assign(this.state.group,{groupName:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({group:Object.assign(this.state.group,{groupName:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*群简介*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,
                    marginTop:5,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>群简介</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>

                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入群简介"
                                val={this.state.group.groupBrief==null?'':this.state.group.groupBrief}
                                onChangeText={
                                    (value)=>{
                                        this.setState({group:Object.assign(this.state.group,{groupBrief:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({group:Object.assign(this.state.group,{groupBrief:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*成员上限*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:10,
                    marginTop:5,marginBottom:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>成员上限</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>

                            <TextInputWrapper
                                placeholderTextColor='#888'
                                textInputStyle={{marginLeft:20,fontSize:13,color:'#222'}}
                                placeholder="请输入成员上限"
                                val={this.state.group.groupMaxMemNum==null?'':this.state.group.groupMaxMemNum}
                                onChangeText={
                                    (value)=>{
                                        this.setState({group:Object.assign(this.state.group,{groupMaxMemNum:value})})
                                    }}
                                onCancel={
                                    ()=>{this.setState({group:Object.assign(this.state.group,{groupMaxMemNum:null})});}
                                }
                            />
                        </View>
                    </View>

                    {/*添加成员*/}
                    <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                    margin:10,marginTop:5,marginBottom:10}}>
                        <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start',}}>
                            <Text style={{color:'#343434'}}>添加成员</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#eee',
                            borderRadius:10}}>
                            <TouchableOpacity style={{marginRight:15,padding:3,alignItems:'center',justifyContent:'center'}}
                            onPress={()=>{
                                this.setState({modalVisible:true});
                            }}>
                                <Ionicons name='md-add-circle'  size={20} color="#bbb"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {
                        (this.state.memberList==null||this.state.memberList==undefined||this.state.memberList.length==0)?
                            null:
                            <View style={{height:height*0.4,padding:5,borderWidth:1,borderColor:'#eee',backgroundColor:'#eee'}}>
                                <ScrollView style={{height:height*0.4}}>
                                    {memberListView}
                                </ScrollView>
                            </View>
                    }


                    <View style={{flex:1,backgroundColor:'#fff',padding:10}}>
                        <Text style={{color:'#aaa',fontSize:11}}>
                            温馨提示：您发布的内容应合法、真实、健康、共创文明的网络环境
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={{height:35,backgroundColor:'#66CDAA',margin:20,justifyContent:'center',alignItems: 'center',borderRadius:10,}}
                                  onPress={()=>{
                                      var info ={group:this.state.group,memberList:this.state.memberList};
                                      this.createGroup(info);
                                      }}>
                    <Text style={{color:'#fff',fontSize:15}}>确 认</Text>
                </TouchableOpacity>


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
                        searchList = {this.state.searchList}
                        accessToken={this.props.accessToken}
                        setMemberList={(choose)=>{
                                var memberList = this.state.memberList;
                                memberList.push(choose);
                                this.setState({memberList:memberList});
                        }}
                    />

                </Modal>
                </Toolbar>
            </View>
        );
    }

}

var styles = StyleSheet.create({


});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        user:state.user.user,
        portrait:state.user.portrait.payload,
        myGroupList:state.activity.myGroupList,
        groupOnFresh:state.activity.groupOnFresh
    })
)(CreateGroup);

