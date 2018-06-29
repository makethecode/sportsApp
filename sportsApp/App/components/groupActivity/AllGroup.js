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
    Easing
} from 'react-native';

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

import TextInputWrapper from 'react-native-text-input-wrapper';
import GroupDetail from './GroupDetail';
import {
    fetchAllGroupList,disableAllGroupOnFresh,joinGroup,fetchGroupMemberList
} from '../../action/ActivityActions';

import {
    getAccessToken,
} from '../../action/UserActions';

class AllGroup extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    _onRefresh() {
        this.setState({ isRefreshing: true, fadeAnim: new Animated.Value(0) });
        setTimeout(function () {
            this.setState({
                isRefreshing: false,
            });
            Animated.timing(          // Uses easing functions
                this.state.fadeAnim,    // The value to drive
                {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.bounce
                },           // Configuration
            ).start();
        }.bind(this), 500);

        this.props.dispatch(enableAllGroupOnFresh());

    }

    navigate2GroupDetail(group){

        this.props.dispatch(fetchGroupMemberList(group))
            .then((json)=> {
                if (json.re == 1) {
                    var memberList = json.data;
                    const { navigator } = this.props;
                    if(navigator) {
                        navigator.push({
                            name:'group_detail',
                            component: GroupDetail,
                            params: {
                                groupInfo:group,
                                memberList:memberList,
                                flag:'其他组详情'
                            }
                        })
                    }
                }else{
                    if(json.re==-100){
                        this.props.dispatch(getAccessToken(false));
                    }
                }
            })

    }

    renderRow(rowData,sectionId,rowId){

        var row=(
            <TouchableOpacity style={{flex:1,flexDirection:'row',backgroundColor:'#fff',marginBottom:5,padding:10}}
                              onPress={()=>{
                    this.navigate2GroupDetail(rowData);
                }}>
                <View style={{flex:1,}}>
                    <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={require('../../../img/portrait.jpg')}/>
                </View>
                <View style={{flex:3,marginLeft:10,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                    <Text style={{color:'#343434'}}>{rowData.groupName}</Text>
                    <Text style={{color:'#343434'}}>({rowData.groupNowMember})</Text>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems: 'center',}}>

                </View>
                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',margin:10,borderWidth:1,borderColor:'#66CDAA',borderRadius:5}}
                                  onPress={()=>{
                                      this.joinGroup(rowData.groupId);
                }}>
                    <Text style={{color:'#66CDAA',fontSize:12,}}>加入</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
        return row;
    }

    joinGroup(groupId)
    {
        this.props.dispatch(joinGroup(groupId)).then((json)=> {
           if(json.re==1){
               alert('加入成功！');
               this.props.setMyGroupList();
               this.goBack();
           }else{
               if(json.re==-100){
                   this.props.dispatch(getAccessToken(false));
               }
           }
        }).catch((e)=>{
            alert(e)
        });

    }

    fetchData(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchAllGroupList()).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }else{
                this.props.dispatch(disableAllGroupOnFresh());
                this.setState({doingFetch:false,isRefreshing:false})
            }
        }).catch((e)=>{
            this.props.dispatch(disableAllGroupOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }


    constructor(props) {
        super(props);
        this.state={
            groupName:null,
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),

        }
    }

    render() {

        var groupListView=null;
        var {allGroupList,allGroupOnFresh}=this.props;

        if(allGroupOnFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchData();
        }else {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (allGroupList !== undefined && allGroupList !== null && allGroupList.length > 0) {

                groupListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(allGroupList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }

        return (
            <View style={{flex:1, backgroundColor:'#eee',}}>

                <View style={{height:55,width:width,paddingTop:20,flexDirection:'row',justifyContent:'center',
                    backgroundColor:'#66CDAA',borderBottomWidth:1,borderColor:'#66CDAA'}}>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',}}
                                      onPress={()=>{this.goBack();}}>
                        <Icon name={'angle-left'} size={30} color="#fff"/>
                    </TouchableOpacity>
                    <View style={{flex:3,justifyContent:'center',alignItems: 'center',}}>
                        <Text style={{color:'#fff',fontSize:18}}>所有群组</Text>
                    </View>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',}}>

                    </TouchableOpacity>
                </View>

                {/*//搜索框*/}
                <View style={{flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',margin:8,padding:5,borderRadius:8}}>
                    <TextInputWrapper
                        style={{fontSize:13}}
                        onConfirm={()=>{alert('ccc');}}
                        search={true}
                        onChangeText={(groupName) => {
                                      this.setState({groupName:groupName});
                                    }}
                        value={this.state.groupName==null?'':this.state.groupName}
                        placeholder='搜索群组'
                        placeholderTextColor="#aaa"
                        underlineColorAndroid="transparent"
                        onCancel={
                           ()=>{this.setState({groupName:''});}
                        }
                    />
                </View>

                <View style={{backgroundColor:'#eee',padding:5}}>
                    <Text style={{color:'#343434'}}>全部群组(4)</Text>
                </View>

                <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,borderTopWidth:1,borderColor:'#eee'}}>
                    <ScrollView
                        refreshControl={
                                     <RefreshControl
                                         refreshing={this.state.isRefreshing}
                                         onRefresh={this._onRefresh.bind(this)}
                                         tintColor="#9c0c13"
                                         title="刷新..."
                                         titleColor="#9c0c13"
                                         colors={['#ff0000', '#00ff00', '#0000ff']}
                                         progressBackgroundColor="#ffff00"
                                     />
                                    }
                    >

                        {
                            groupListView==null?
                                <View style={{justifyContent:'center',alignItems: 'center',marginTop:20}}>
                                    <Text style={{color:'#343434'}}>还没有已创建的群组</Text>
                                </View> :
                               null
                        }

                        {groupListView}

                    </ScrollView>
                </Animated.View>
            </View>
        );
    }

}

var styles = StyleSheet.create({


});

module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        allGroupList:state.activity.allGroupList,
        allGroupOnFresh:state.activity.allGroupOnFresh
    })
)(AllGroup);
