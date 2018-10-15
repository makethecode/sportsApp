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
    ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CreateGroup from './CreateGroup';
import GroupDetail from './GroupDetail';
import AllGroup from './AllGroup';
import {
    fetchMyGroupList,disableMyGroupOnFresh,enableMyGroupOnFresh,fetchGroupMemberList
} from '../../action/ActivityActions';
import {
    getAccessToken,
} from '../../action/UserActions';
import GroupMember from '../groupActivity/GroupMemberInformation'

var {height, width} = Dimensions.get('window');
var Popover = require('react-native-popover');

class MyGroup extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    showPopover(){
            this.setState({
                menuVisible: true,
                buttonRect: {x: width-80, y: 0, width: 100, height: 80}
            });
    }

    closePopover(){
        this.setState({menuVisible: false});
    }

    setMyGroupList(){
        this.props.dispatch(enableMyGroupOnFresh());
    }

    navigate2GroupMember(groupId){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'GroupMember',
                component: GroupMember,
                params: {
                    groupId:parseInt(groupId)
                }
            })
        }
    }

    navigate2CreateGroup(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'create_group',
                component: CreateGroup,
                params: {
                    setMyGroupList:this.setMyGroupList.bind(this),
                }
            })
        }
    }

    navigate2AllGroup(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'all_group',
                component: AllGroup,
                params: {
                    setMyGroupList:this.setMyGroupList.bind(this),
                }
            })
        }
    }

    navigate2GroupDetail(group){
                    const { navigator } = this.props;
                    if(navigator) {
                        navigator.push({
                            name:'group_detail',
                            component: GroupDetail,
                            params: {
                                setMyGroupList:this.setMyGroupList.bind(this),
                                groupInfo:group,
                                flag:'我的组详情'
                            }
                        })
                    }
    }

    renderAllAvatars(avatars){
        var allAvatars = [];
        if(avatars==null)return null;
        for(var i=0;i<avatars.length;i++) {
            var model = avatars[i]
            var item = this.getImageViewItem(model)
            allAvatars.push(item);
        }
        return allAvatars;
    }

    getImageViewItem(model){

        return (
            <View style={{flex:1,padding:1}}>
                <Image resizeMode="stretch" style={{height:25,width:25,borderRadius:13}} source={{uri:model}}/>
            </View>
        );
    }

    renderRow(rowData,sectionId,rowId){

        var avatars = rowData.avatarList;

        var avatarList = (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                bounces ={false}
                showsHorizontalScrollIndicator  ={true}
                ref={(scrollView) => { this._scrollView = scrollView; }}
                horizontal={true}
            >
                {this.renderAllAvatars(avatars)}
            </ScrollView>
        );

        var row=(
            <TouchableOpacity
                style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,}}
                onPress={()=>{
                    this.navigate2GroupDetail(rowData)
                }}>
                <View style={{flex:1,flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'transparent',}}>
                    <View style={{flex:1,justifyContent:'flex-start',alignItems: 'flex-start'}}>
                        <Image resizeMode="stretch" style={{height:35,width:35,borderRadius:17}} source={require('../../../img/groupIcon.png')}/>
                    </View>
                    <View style={{flex:6,justifyContent:'center',alignItems: 'flex-start',marginLeft:3}}>
                        <Text style={{color:'#444',fontSize:16}}>{rowData.groupName}</Text>
                    </View>

                </View>

                <View style={{flex:1,paddingHorizontal:10,paddingVertical:3}}>
                    <View style={{flex:3,flexDirection:'row'}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>群主</Text>
                        </View>
                        <View style={{flex:7,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.groupManager}</Text>
                        </View>
                    </View>
                </View>

                <View style={{flex:1,paddingHorizontal:10,paddingVertical:3}}>
                    <View style={{flex:3,flexDirection:'row'}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>简介</Text>
                        </View>
                        <View style={{flex:7,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.groupBrief}</Text>
                        </View>
                    </View>
                </View>

                <View style={{flex:1,paddingHorizontal:10,paddingVertical:6}}>

                    <View style={{flexDirection:'row',flex:2.5,alignItems:'flex-start'}}>
                        <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row',marginBottom:3}}>

                            <View style={{backgroundColor:'#ffffff',borderRadius:5,padding:5}}><Text style={{color:'#66CDAA'}}>已报名</Text></View>
                            <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.groupNowMemNum}/{rowData.groupMaxMemNum}人</Text>
                        </View>

                        <View style={{flex:4,backgroundColor:'#fff',justifyContent:'flex-start',marginBottom:3}}>
                            <TouchableOpacity onPress={()=>{
                                this.navigate2GroupMember(rowData.groupId)
                            }}>
                                {avatarList}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
        return row;
    }

    fetchData() {

        this.props.dispatch(fetchMyGroupList()).then((json) => {
            if (json.re == 1) {
                this.setState({myGroupList: json.data,showProgress:false})
            }
        });
    }

    constructor(props) {
        super(props);
        this.state={
            myGroupList:null,
            showProgress:false,
        }
    }

    render() {

        var displayArea = {x:5, y:10, width:width-10, height: height - 10};

        var groupListView=null;
        var myGroupList = this.state.myGroupList;

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (myGroupList !== undefined && myGroupList !== null && myGroupList.length > 0) {
                groupListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(myGroupList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }


        return (
            <View style={{flex:1, backgroundColor:'#eee',}}>

                <Toolbar width={width} title="我的群组" navigator={this.props.navigator} actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 this.showPopover();
                             }
                         }}>
                    <ScrollView style={{marginTop:10}}>
                        {
                            groupListView==null?
                                <View style={{justifyContent:'center',alignItems: 'center',marginTop:20}}>
                                    <Text style={{color:'#343434'}}>尚未加入任何群组</Text>
                                </View> :null
                        }

                        {groupListView}

                    </ScrollView>
                {/*popover part*/}
                <Popover
                    isVisible={this.state.menuVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={displayArea}
                    onClose={()=>{this.closePopover()
                        }}
                    style={{backgroundColor:'transparent'}}
                    placement="bottom"
                >

                    <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd'}]}
                                      onPress={()=>{
                                              this.closePopover();
                                              setTimeout(()=>{
                                                   this.navigate2AllGroup();
                                              },300);

                                          }}>
                        <Text style={[styles.popoverText]}>所有群组</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.popoverContent}
                                      onPress={()=>{
                                              this.closePopover();
                                                 setTimeout(()=>{
                                                  this.navigate2CreateGroup();
                                              },300);
                                          }}>
                        <Text style={[styles.popoverText]}>创建新群</Text>
                    </TouchableOpacity>

                </Popover>

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

    componentDidMount(){
        this.setState({showProgress:true})
        this.fetchData();
    }

}

var styles = StyleSheet.create({
    popoverContent: {
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText:{
        color:'#444',
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
)(MyGroup);