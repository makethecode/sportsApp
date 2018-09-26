
import React, { Component } from 'react';
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
    InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import TextInputWrapper from 'react-native-text-input-wrapper'
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { SearchBar } from 'react-native-elements'
import {
    fetchMyGroupList,disableMyGroupOnFresh,enableMyGroupOnFresh,fetchGroupMemberFormList
} from '../../action/ActivityActions';
import {getAccessToken,} from '../../action/UserActions';
import MemberInformation from '../course/MemberInformation';

var { height, width } = Dimensions.get('window');


class GroupMemberInformation extends Component {

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

    goBack() {
        const { navigator } = this.props;
        if (navigator) {
            this.props.dispatch(enableStudentsOnFresh())
            navigator.pop();

        }
    }

    renderRow(rowData, sectionId, rowId) {

        return (

        <TouchableOpacity style={{flexDirection:'column',marginTop:4}}
                          onPress={()=>{
                              //this.navigate2StudentsCourseRecord(rowData.courseId,rowData.memberId);
                              //查看成员详细信息
                              this.navigate2MemberInformation(rowData.personId);
                          }}>
            <View style={{ padding: 6,flexDirection:'row',marginTop:3}}>
                <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                    {
                        rowData.avatar!=""?
                            <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                   source={{uri: rowData.avatar}}/>:
                            <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                   source={require('../../../img/portrait.jpg')}/>
                    }
                </View>
                <View style={{flex:4,flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                    <Text style={{ color: '#222', fontSize: 14,marginBottom:5}}>{rowData.perNum}</Text>
                    <Text style={{ color: '#666', fontSize: 13}}>{rowData.mobilePhone}</Text>
                </View>
            </View>
            <View style={{height:0.7,width:width,backgroundColor:'#c2c2c2'}}></View>

        </TouchableOpacity>
    )}

    fetchMembers(groupId){
        this.props.dispatch(fetchGroupMemberFormList(groupId)).then((json)=> {
          if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.setState({members:json.data,allMembers:json.data})
        }).catch((e)=>{
            alert(e)
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),
            allMembers:null,
            members:null,
        };
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }

    searchByText(text,allMembers){

        //前端实现模糊查询
        if(text==null || text=='')
        {
            var members = allMembers;
            this.setState({members:members})
        }
        else {
            var members = allMembers;
            var membersList = [];

            if (members && members.length > 0) {
                members.map((person, i) => {
                    if (person.perNum) {
                        if (person.perNum.indexOf(text) != -1)
                            membersList.push(person)
                    }
                })
            }
            this.setState({members: membersList})
        }
    }

    render() {
        var membersListView=null;
        var members = this.state.members;

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (members !== undefined && members !== null && members.length > 0)
            {
                membersListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(members)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="成员列表" navigator={this.props.navigator} actions={[]}
                         onPress={(i)=>{
                         }}
                >
                    <SearchBar
                        lightTheme
                        onChangeText={
                            //模糊查询
                            (text)=>{
                                this.searchByText(text,this.state.allMembers)
                            }
                        }
                        placeholder='成员姓名\电话' />
                    <View style={{width:width,height:40,backgroundColor:'#eee',padding:10,alignItems:'flex-start',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#888',fontSize:13}}>成员名单</Text>
                    </View>
                    {<View style={{flex:1,backgroundColor:'#eee'}}>
                        <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff'}}>
                            <ScrollView>
                                {membersListView}
                            </ScrollView>
                        </Animated.View>
                    </View>}
                </Toolbar>
            </View>
        )
    }

    componentDidMount()
    {
        this.fetchMembers(this.props.groupId)
    }

    componentWillUnmount(){
        this.props.dispatch(enableMyGroupOnFresh());
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize: 14
    }
});

module.exports = connect(state=>({
        userType: state.user.usertype.perTypeCode,
        creatorId:state.user.personInfo.personId
    })
)(GroupMemberInformation);