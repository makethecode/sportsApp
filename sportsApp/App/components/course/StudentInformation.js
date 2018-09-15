
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
import CreateBadmintonCourse from './CreateBadmintonCourse';
import CreateCustomerPlan from './CreateCustomerPlan';
import CustomerCourseList from './CustomerCourseList';
import ModifyDistribution from './ModifyDistribution';
import StudentsCourseRecord from './StudentsCourseRecord';
import StudentPayInformation from './StudentPayInformation';
import AddStudent from './AddStudent';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';


var { height, width } = Dimensions.get('window');

import {
    onStudentsUpdate,
    enableStudentsOnFresh,
    disableStudentsOnFresh,
    fetchStudents,
} from '../../action/CourseActions';

import {getAccessToken,} from '../../action/UserActions';

import BadmintonCourseSignUp from './BadmintonCourseSignUp';


class StudentInformation extends Component {

    //导航至定制（for 教练）
    navigate2BadmintonCourseForCoach() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'CreateBadmintonCourse',
                component: CreateBadmintonCourse,
                params: {
                    setMyCourseList:this.setMyCourseList.bind(this)
                }
            })
        }
    }

    //导航至定制（for 用户）
    navigate2BadmintonCourseForUser() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'CreateCustomerPlan',
                component: CreateCustomerPlan,
                params: {

                }
            })
        }
    }

    navigate2ModifyDistribution(course){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'ModifyDistribution',
                component: ModifyDistribution,
                params: {
                    course:course
                }
            })
        }
    }

    //导航至定制列表（for 教练）
    navigate2CustomCourseList(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name:'CustomerCourseList',
                component:CustomerCourseList,
                params: {

                }
            })
        }
    }

    navigate2CourseSignUp(classInfo)
    {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'BadmintonCourseSignUp',
                component: BadmintonCourseSignUp,
                params: {
                    classInfo,
                    setMyCourseList:this.setMyCourseList.bind(this)
                }
            })
        }
    }

    navigate2AddStudent(courseId){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'AddStudent',
                component: AddStudent,
                params: {
                    courseId:courseId,
                    setMyCourseList:this.setMyCourseList.bind(this),
                }
            })
        }
    }

    navigate2StudentPayInformation(courseId,memberId){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'StudentPayInformation',
                component: StudentPayInformation,
                params: {
                    courseId:courseId,
                    memberId:memberId
                }
            })
        }
    }

    navigate2StudentsCourseRecord(courseId,memberId)
    {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'StudentsCourseRecord',
                component: StudentsCourseRecord,
                params: {
                    courseId:courseId,
                    memberId:memberId

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

    setMyCourseList(courseId)
    {
        this.props.dispatch(fetchStudents(courseId)).then((json)=>{
            if(json.re==1)
            {
                this.props.dispatch(onStudentsUpdate(json.data))
            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }
            }
        })
    }

    renderRow(rowData, sectionId, rowId) {
        var date = new Date(rowData.joinTime);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var joinTime = year + '年' + month + '月' + day + '日';

        var condition = null;
        if (rowData.state == 1)
            condition = "报名"
        else
            condition = "结业"

        return (
            <TouchableOpacity style={{flex: 1, backgroundColor: '#fff', marginTop: 5, marginBottom: 5,}}
            onPress={
                ()=>{
                    this.navigate2StudentsCourseRecord(rowData.courseId,rowData.memberId);
                }
            }>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    padding: 5,
                    borderBottomWidth: 1,
                    borderColor: '#ddd',
                    backgroundColor: 'transparent',
                }}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        {rowData.avatar!=''?
                            <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                   source={{uri: rowData.avatar}}/>:
                            <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                   source={require('../../../img/portrait.jpg')}/>
                        }
                    </View>
                    <View style={{
                        flex: 3,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginLeft: 3,
                        flexDirection: 'row'
                    }}>

                        <View style={{backgroundColor: '#fca482', borderRadius: 5, padding: 5}}><Text
                            style={{color: '#ffffff'}}>姓名</Text></View>
                        <Text style={{color: '#5c5c5c', marginLeft: 5}}>{rowData.perNum}</Text>
                    </View>

                    <View style={{flex: 2, marginRight: 3, justifyContent: 'center', alignItems: 'flex-end'}}>
                        <View style={{backgroundColor: '#fc6254', borderRadius: 5, padding: 5}}><Text
                            style={{color: '#fff'}}>{condition}</Text></View>
                    </View>
                </View>
                <View style={{flex: 3, padding: 10}}>

                    <View style={{flex: 3, flexDirection: 'row', marginBottom: 3}}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            backgroundColor: '#66CDAA',
                            borderRadius: 5,
                            padding: 5
                        }}>
                            <Text style={{color: '#ffffff'}}>身高体重</Text>
                        </View>
                        <View style={{flex: 4, padding: 5, marginLeft: 5}}>
                            <Text style={{
                                color: '#5c5c5c',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>{rowData.heightweight}</Text>
                        </View>
                    </View>

                    <View style={{flex: 3, flexDirection: 'row', marginBottom: 3}}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            backgroundColor: '#ffffff',
                            borderRadius: 5,
                            padding: 5
                        }}>
                            <Text style={{color: '#66CDAA'}}>联系方式</Text>
                        </View>
                        <View style={{flex: 4, padding: 5, marginLeft: 5}}>
                            <Text style={{
                                color: '#5c5c5c',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>{rowData.mobilePhone}</Text>
                        </View>
                    </View>

                    <View style={{flex: 3, flexDirection: 'row', marginBottom: 3}}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            backgroundColor: '#66CDAA',
                            borderRadius: 5,
                            padding: 5
                        }}>
                            <Text style={{color: '#ffffff'}}>报名时间</Text>
                        </View>
                        <View style={{flex: 4, padding: 5, marginLeft: 5}}>
                            <Text style={{
                                color: '#5c5c5c',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>{joinTime}</Text>
                        </View>
                    </View>

                    <View style={{flex: 3, flexDirection: 'row', marginBottom: 3}}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            backgroundColor: '#ffffff',
                            borderRadius: 5,
                            padding: 5
                        }}>
                            <Text style={{color: '#66CDAA'}}>已上课次</Text>
                        </View>
                        <View style={{flex: 4, padding: 5, marginLeft: 5}}>
                            <Text style={{
                                color: '#5c5c5c',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>{rowData.hasCount}/{rowData.buyCount}</Text>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    fetchStudents(courseId){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchStudents(courseId)).then((json)=> {
          if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.props.dispatch(disableStudentsOnFresh());
            this.setState({doingFetch:false,isRefreshing:false})
        }).catch((e)=>{
            this.props.dispatch(disableStudentsOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }

    _onRefresh() {
        this.setState({isRefreshing: true, fadeAnim: new Animated.Value(0)});
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
        this.props.dispatch(enableStudentsOnFresh());

    }

    constructor(props) {
        super(props);
        this.state = {
            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),
        };
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }

    render() {
        var studentsListView=null;
        var {students,studentsOnFresh}=this.props;
        var competitionList=this.state.competitionList;
        if(studentsOnFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchStudents(this.props.courseId);
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (students !== undefined && students !== null && students.length > 0)
            {
                studentsListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(students)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
       }



        return (
            <View style={styles.container}>
                <Toolbar width={width} title="我的学生" navigator={this.props.navigator} actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 this.navigate2AddStudent(this.props.courseId)}
                         }}>
                    {<View style={{flex:5,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-100,paddingTop:5,paddingBottom:5,}}>
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
                                {studentsListView}
                                {
                                    studentsListView==null?
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>该课程尚未有学生报名</Text>
                                        </View>:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }

                            </ScrollView>

                        </Animated.View>
                    </View>}



                </Toolbar>
            </View>
        )
    }

    componentDidMount()
    {

    }

    componentWillUnmount(){
        this.props.dispatch(enableStudentsOnFresh());
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
        students:state.course.studentsOfCourse,
        studentsOnFresh:state.course.studentsOnFresh,
        creatorId:state.user.personInfo.personId
    })
)(StudentInformation);