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
    Alert,
    Platform,
    DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import DatePicker from 'react-native-datepicker';
import DateFilter from '../../utils/DateFilter';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import TextInputWrapper from 'react-native-text-input-wrapper';
import ActionSheet from 'react-native-actionsheet';
import{
    fetchMemberInformation,getAccessToken
} from '../../action/UserActions';
import{fetchTrailClassByStudent,updateTrailClassMemberType,cancelTrialClass} from '../../action/CourseActions';
import {ButtonGroup} from 'react-native-elements';
import AddTrailClass from './AddTrailClass';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

var {height, width} = Dimensions.get('window');

class TrailStudentInformation extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2AddTrailClass(personId,memberId){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'AddTrailClass',
                component: AddTrailClass,
                params: {
                    personId:personId,
                    memberId:memberId,
                }
            })
        }
    }

    //选学员类型
    _handlePress(index) {
        if(index!==0){
            var typeStr = this.state.typeButtons[index];
            var typeIdx = index-1;

            this.props.dispatch(updateTrailClassMemberType(this.state.member.id,typeIdx)).then((json)=> {
                if(json.re==1) {
                    this.setState({typeIdx: typeIdx});
                    DeviceEventEmitter.emit('on_trial_class_member_type_confirm',typeIdx)
                }
            }).catch((e)=>{
                alert(e)
            });
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

   getDate(tm){
       var tt=new Date(parseInt(tm)*1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
       return tt;
    }

    constructor(props) {
        super(props);
        this.state={

            selectedIndex: 0,

            //学员信息
            // {'id':1,personId:2,
            //     'avatar':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eomLddoUqCUnzajsMFr0ibDxXksGFH1HIeg6ksyWr4fLFxianqOpLVVyE6ia0XUFODVXJQL432uBNqVg/132',
            //     'perNum':'陈海云',
            //     'mobilePhone':'13305607453',
            //     'type':0,
            //     'courseType':'山体课程',
            //     'courseTypeIdx':0,
            //     'joinTime':'2018-10-10','sexStr':'女',birthday:'1996-10-29'},
            member:this.props.student,

            typeIdx:this.props.student.type,
            typeButtons:['取消','试课学员','转正学员','流失学员'],

            //试课列表
            trailClassList:[],

        }
    }

    updateIndex (selectedIndex) {
        this.setState({selectedIndex})
    }

    renderRow(rowData,sectionId,rowId){

        // {classId:1,name:'培训课',content:'加强学生羽毛球水平',unitId:'',unitName:'山东省奥体中心羽毛球馆',time:'',
        //     timeStr:'10-10 8:00-10:00 周四',week:4,coachId:0,coachName:'邹鹏教练'}

        var row=(
            <View style={{flexDirection:'column',marginTop:4,backgroundColor:'#fff'}}>

                <View style={{ paddingVertical:5,flexDirection:'row',marginTop:3}}>
                    <View style={{flex:2,justifyContent:'center',alignItems: 'flex-start',paddingLeft:10}}>
                        <Text style={{ color: '#222', fontSize: 18}}>{rowData.name}</Text>
                    </View>

                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginRight:10}}>
                        <Ionicons name='md-person' size={15} color="#fc3c3f"/>
                        <Text style={{ color: '#666', fontSize: 13,marginLeft:3}}>{rowData.coachName}</Text>
                    </View>
                </View>

                <View style={{flex:3,padding:5,flexDirection:'column'}}>

                    {/*内容*/}
                    <View style={{flex:4,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>内容</Text>
                        </View>
                        <View style={{flex:4,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.content}</Text>
                        </View>
                        <View style={{flex: 2}}/>
                    </View>

                    {/*时间*/}
                    <View style={{flex:4,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>场地</Text>
                        </View>
                        <View style={{flex:4,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.unitName}</Text>
                        </View>
                        <View style={{flex: 2}}/>
                    </View>

                    {/*时间*/}
                    <View style={{flex:4,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>时间</Text>
                        </View>
                        <View style={{flex:4,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.timeStr}</Text>
                        </View>
                            <TouchableOpacity
                                style={{flex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: '#fc3c3f', margin: 5, marginHorizontal:5}}
                                onPress={()=>{
                                    this.cancelTrialClass(this.state.member.id,rowData.classId)
                                }
                                }>
                            <Text style={{color: '#fc3c3f', justifyContent: 'center', alignItems: 'center', fontSize: 13,padding:5}}>取消报名</Text></TouchableOpacity>
                    </View>

                </View>

                <View style={{height:0.8,width:width,backgroundColor:'#c2c2c2'}}></View>

            </View>
        );
        return row;
    }

    render(){

        const buttons = ['试课', '资料']
        const { selectedIndex } = this.state

       var type='试课学员';
       switch (this.state.typeIdx){
           case 0:type='试课学员';break;
           case 1:type='转正学员';break;
           case 2:type='流失学员';break;
       }

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        var trailClassListView=null;
        var trailClassList = this.state.trailClassList;

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (trailClassList !== undefined && trailClassList !== null && trailClassList.length > 0)
            {
                trailClassListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(trailClassList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="学员信息" navigator={this.props.navigator}
                         actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 //添加试课
                                 this.navigate2AddTrailClass(this.state.member.personId,this.state.member.id)
                             }
                         }}>
                    <View style={{flexDirection:'column'}}>

                        {/*头部*/}
                            <View style={{width:width,height:200,backgroundColor:'#66CDAA',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',padding:5}}>
                            {/*头像*/}
                                {
                                    //Android头像无法与边框同步形成圆角
                                Platform.OS === 'ios'?
                                <View style={{alignItems:'center',justifyContent:'center',height:60,width:width}}>
                                    {this.state.member.avatar && this.state.member.avatar != '' ?
                                        <Image resizeMode="stretch" style={{
                                            height: 60,
                                            width: 60,
                                            borderRadius: 30,
                                            borderColor: '#fff',
                                            borderWidth: 2,
                                        }}
                                               source={{uri: this.state.member.avatar}}/> :
                                        <Image resizeMode="stretch" style={{
                                            height: 60,
                                            width: 60,
                                            borderRadius: 30,
                                            borderColor: '#fff',
                                            borderWidth: 2,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                               source={require('../../../img/portrait.jpg')}/>
                                    }
                                </View>
                                :
                                <View style={{alignItems:'center',justifyContent:'center',height:60,width:width}}>
                                    {
                                        this.state.member.avatar && this.state.member.avatar != '' ?
                                            <Image resizeMode="stretch" style={{
                                                height: 60,
                                                width: 60,
                                                borderRadius: 30,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                                   source={{uri: this.state.member.avatar}}/> :
                                            <Image resizeMode="stretch" style={{
                                                height: 60,
                                                width: 60,
                                                borderRadius: 30,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                                   source={require('../../../img/portrait.jpg')}/>
                                    }
                                </View>
                                }

                        {/*用户名*/}
                        <View style={{marginTop:10,justifyContent:'center'}}>
                                {
                                    this.state.member.perNum&&this.state.member.perNum!=''?
                                        <Text style={{color:'#fff',fontSize:20}}>
                                            {this.state.member.perNum}
                                        </Text>:
                                        <Text style={{color:'#fff',fontSize:20}}>
                                            未设置
                                        </Text>
                                }
                        </View>

                                {/*学员类型*/}
                                <View style={{paddingHorizontal:10,marginTop:10,justifyContent:'center',marginBottom:20}}>
                                    <TouchableOpacity style={{justifyContent:'center',backgroundColor:'#efb66a',padding:5}}
                                    onPress={()=>{
                                        this.show('actionSheet');
                                    }}>
                                    <Text style={{color:'#fff',fontSize:13}}>{type}</Text>
                                        <ActionSheet
                                            ref={(p) => {
                                                this.actionSheet =p;
                                            }}
                                            title="请选择学员类型"
                                            options={this.state.typeButtons}
                                            cancelButtonIndex={CANCEL_INDEX}
                                            destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                            onPress={
                                                (data)=>{ this._handlePress(data); }
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/*功能按钮*/}
                                <ButtonGroup
                                    onPress={
                                        (selectedIndex)=> {
                                        this.updateIndex(selectedIndex)
                                        }
                                    }
                                    selectedIndex={selectedIndex}
                                    buttons={buttons}
                                    containerStyle={{height: 30,width:150,borderWidth:1.5,borderColor:'#fff'}}
                                    innerBorderStyle={{color:'#fff',width:1.5}}
                                    buttonStyle={{backgroundColor:'#66CDAA'}}
                                    selectedButtonStyle={{backgroundColor:'#fff'}}
                                    textStyle={{fontSize:14,color:'#fff'}}
                                    selectedTextStyle={{fontSize:14,color:'#66CDAA'}}
                                />

                            </View>

                        {/*内容部分*/}
                        {
                            selectedIndex==0?
                                <View style={{
                                    height:height-330,
                                    width:width,
                                    backgroundColor: '#eee',
                                    flexDirection: 'column'
                                }}>
                                    <ScrollView style={{flex:1}}>
                                        {trailClassListView}
                                        {
                                            trailClassListView==null || trailClassList.length==0 ?
                                                <View style={{flex:1,justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                                    <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                                </View>:null
                                        }
                                    </ScrollView>

                                </View>

                                :
                            <View style={{
                                height:height-200,
                                width:width,
                                backgroundColor: '#eee',
                                flexDirection: 'column'
                            }}>

                                {/*真实姓名*/}
                                <View style={{height:35,backgroundColor:'#fff',marginTop:4,paddingHorizontal: 10, paddingVertical:3, flexDirection: 'row'}}>

                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={{color: '#555', fontSize: 15}}>
                                            真实姓名
                                        </Text>
                                    </View>
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        {
                                            this.state.member.perName && this.state.member.perName != '' ?
                                                <Text style={{color: '#444', fontSize: 15}}>
                                                    {this.state.member.perName}
                                                </Text> :
                                                <Text style={{color: '#777', fontSize: 15}}>
                                                    未设置
                                                </Text>
                                        }
                                    </View>
                                </View>


                                {/*性别*/}
                                <View style={{height:35,backgroundColor:'#fff',marginTop:1,paddingHorizontal: 10, paddingVertical:3, flexDirection: 'row'}}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={{color: '#555', fontSize: 15}}>
                                            性别
                                        </Text>
                                    </View>
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        {
                                            this.state.member.sex && this.state.member.sex != '' ?
                                                <Text style={{color: '#444', fontSize: 15}}>
                                                    {this.state.member.sex}
                                                </Text> :
                                                <Text style={{color: '#777', fontSize: 15}}>
                                                    未设置
                                                </Text>
                                        }
                                    </View>
                                </View>


                                {/*出生日期*/}
                                <View style={{height:35,backgroundColor:'#fff',marginTop:1,paddingHorizontal: 10, paddingVertical:3, flexDirection: 'row'}}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={{color: '#555', fontSize: 15}}>
                                            出生日期
                                        </Text>
                                    </View>
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        {
                                            this.state.member.birthday && this.state.member.birthday != '' ?
                                                <Text style={{color: '#444', fontSize: 15}}>
                                                    {this.state.member.birthday}
                                                </Text> :
                                                <Text style={{color: '#777', fontSize: 15}}>
                                                    未设置
                                                </Text>
                                        }
                                    </View>
                                </View>

                                {/*手机号*/}
                                <View style={{height:35,backgroundColor:'#fff',marginTop:1,paddingHorizontal: 10, paddingVertical:3, flexDirection: 'row'}}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={{color: '#555', fontSize: 15}}>
                                            手机号
                                        </Text>
                                    </View>
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        {
                                            this.state.member.mobilePhone && this.state.member.mobilePhone != '' ?
                                                <Text style={{color: '#444', fontSize: 15}}>
                                                    {this.state.member.mobilePhone}
                                                </Text> :
                                                <Text style={{color: '#777', fontSize: 15}}>
                                                    未设置
                                                </Text>
                                        }
                                    </View>
                                </View>
                            </View>

                        }

                    </View>
                </Toolbar>
            </View>
        )
    }

    componentWillUnmount()
    {
        if(this.Listener)
            this.Listener.remove();
    }

    componentWillMount()
    {
        this.fetchTrailClassByStudent(this.props.student.id)

        this.Listener=DeviceEventEmitter.addListener('on_trial_class_confirm', (data)=>{
            if(data)
                this.fetchTrailClassByStudent(this.props.student.id)
        });

    }

    fetchTrailClassByStudent(memberId){
        this.props.dispatch(fetchTrailClassByStudent(memberId)).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.setState({trailClassList:json.data})
        }).catch((e)=>{
            alert(e)
        });
    }

    cancelTrialClass(memberId,classId){
        this.props.dispatch(cancelTrialClass(memberId,classId)).then((json)=> {
            if(json.re==1){
                Alert.alert('成功','取消成功')
                this.fetchTrailClassByStudent(this.props.student.id)
            }
            else {
                Alert.alert('失败','取消失败')
            }
        }).catch((e)=>{
            alert(e)
        });
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
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


module.exports = connect(state=>({
        userType: state.user.user.usertype,
        creatorId:state.user.personInfo.personId,
    })
)(TrailStudentInformation);


