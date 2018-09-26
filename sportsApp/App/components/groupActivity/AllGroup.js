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
    InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import TextInputWrapper from 'react-native-text-input-wrapper';
import GroupDetail from './GroupDetail';
import {
    fetchAllGroupList,disableAllGroupOnFresh,joinGroup,fetchGroupMemberList,enableMyGroupOnFresh
} from '../../action/ActivityActions';
import {
    getAccessToken,
} from '../../action/UserActions';
import { SearchBar } from 'react-native-elements'
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';

var {height, width} = Dimensions.get('window');

class AllGroup extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2GroupDetail(group)
    {
                    const { navigator } = this.props;
                    if(navigator) {
                        navigator.push({
                            name:'group_detail',
                            component: GroupDetail,
                            params: {
                                groupInfo:group,
                                // memberList:this.state.memberList,
                                flag:'其他组详情'
                            }
                        })
                    }
    }

    joinGroup(groupId)
    {
        this.props.dispatch(joinGroup(groupId)).then((json)=> {
           if(json.re==1){
               alert('加入成功！');
               this.setMyGroupList();
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

    constructor(props) {
        super(props);
        this.state={
            groups:null,
            allGroups:null,

            memberList:null,
        }
    }

    render() {

        var groupList = [];
        var {groups}=this.state;

        if(groups&&groups.length>0)
        {

            groups.map((group,i)=>{

                groupList.push(

                    <TouchableOpacity key={i} style={{flexDirection:'column'}}
                                      onPress={()=>{
                                          this.navigate2GroupDetail(group);
                                      }}>

                        <View style={{ padding: 8,paddingHorizontal:3,flexDirection:'row'}}>
                            {
                                group.avatar==""?
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                        <Image resizeMode="contain" style={{height: 40, width: 40, borderRadius: 20} }
                                               source={require('../../../img/groupIcon.png')}/>
                                    </View>
                                    :
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image resizeMode="contain" style={{height: 40, width: 40, borderRadius: 20} }
                                           source={{uri: group.avatar}}/>
                                </View>
                            }
                            <View style={{flex:3,flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{ color: '#222', fontSize: 16,marginBottom:6}}>{group.groupName}</Text>
                                <Text style={{ color: '#666', fontSize: 12,marginBottom:3}}>群主：{group.groupManagerLoginName}</Text>
                                <Text style={{ color: '#666', fontSize: 12}}>简介：{group.groupBrief}</Text>
                            </View>
                        </View>

                        <View style={{height:0.7,width:width,backgroundColor:'#c2c2c2'}}></View>

                    </TouchableOpacity>
                )
            })

        }

        return (
            <View style={styles.container}>
                <Toolbar width={width}  title="群组列表" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>
                    <SearchBar
                        lightTheme
                        onChangeText={
                            //模糊查询
                            (text)=>{
                                this.searchByText(text)
                            }
                        }
                        placeholder='群名' />
                    <View style={{width:width,height:40,backgroundColor:'#eee',padding:10,alignItems:'flex-start',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#888',fontSize:13}}>群组名单</Text>
                    </View>
                    <ScrollView style={{ flex: 1, width: width, backgroundColor: '#fff' }}>

                        <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff' }}>
                            {groupList}
                        </Animated.View>

                    </ScrollView>

                </Toolbar>
            </View>
        )

    }

    searchByText(text){

        //前端实现模糊查询

        if(text==null || text=='')
        {
            var groups = this.state.allGroups;
            this.setState({groups:groups})
        }
        else {
            var groups = this.state.allGroups;
            var groupList = [];

            if (groups && groups.length > 0) {
                groups.map((group, i) => {
                    if (group.groupName) {
                        if (group.groupName.indexOf(text) != -1)
                            groupList.push(group)
                    }
                })
            }

            this.setState({groups: groupList})
        }
    }


    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() => {

            this.props.dispatch(fetchAllGroupList()).then((json)=> {

                this.setState({groups:json.data,allGroups:json.data})

            }).catch((e)=>{
                alert(e)
            });

        });
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        allGroupList:state.activity.allGroupList,
        allGroupOnFresh:state.activity.allGroupOnFresh
    })
)(AllGroup);
