
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
import { SearchBar } from 'react-native-elements'
import {
    onStudentsUpdate,
    enableStudentsOnFresh,
    disableStudentsOnFresh,
    fetchStudents,
} from '../../action/CourseActions';
import {getAccessToken,} from '../../action/UserActions';
import BadmintonCourseSignUp from './BadmintonCourseSignUp';
import MemberInformation from './MemberInformation';

var { height, width } = Dimensions.get('window');


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

        <TouchableOpacity key={i} style={{flexDirection:'column',marginTop:4}}
                          onPress={()=>{
                              //this.navigate2StudentsCourseRecord(rowData.courseId,rowData.memberId);
                              //查看学生详细信息
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
                {/*结业/报名*/}
                {/*<View style={{alignItems:'center',justifyContent:'flex-end',padding:10,borderRadius:5,borderWidth:1,borderColor:'#fc6254'}}>*/}
                    {/*<Text style={{fontSize:14,color:'#fc6254'}}>{condition}</Text>*/}
                {/*</View>*/}
            </View>

            <View style={{flex:3,padding:10,flexDirection:'column'}}>
                <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                    <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                        <Text style={{color:'#66CDAA'}}>身高体重</Text>
                    </View>
                    <View style={{flex:3.5,padding:5,marginLeft:5}}>
                        <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.heightweight}</Text>
                    </View>
                </View>

                <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                    <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                        <Text style={{color:'#fff'}}>报名时间</Text>
                    </View>
                    <View style={{flex:3.5,padding:5,marginLeft:5}}>
                        <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{joinTime}</Text>
                    </View>
                </View>

                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>已上课次</Text>
                        </View>
                        <View style={{flex:3.5,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.hasCount}/{rowData.buyCount}</Text>
                        </View>
                    </View>
            </View>

            <View style={{height:0.7,width:width,backgroundColor:'#c2c2c2'}}></View>

        </TouchableOpacity>
    )}

    fetchStudents(courseId){
        this.props.dispatch(fetchStudents(courseId)).then((json)=> {
          if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.setState({students:json.data,allStudents:json.data})
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
            allStudents:null,
            students:null,
        };
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }

    searchByText(text,allStudents){

        //前端实现模糊查询
        if(text==null || text=='')
        {
            var students = allStudents;
            this.setState({students:students})
        }
        else {
            var students = allStudents;
            var studentsList = [];

            if (students && students.length > 0) {
                students.map((person, i) => {
                    if (person.perNum) {
                        if (person.perNum.indexOf(text) != -1)
                            studentsList.push(person)
                    }
                })
            }
            this.setState({students: studentsList})
        }
    }

    render() {
        var studentsListView=null;
        var students = this.state.students;

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

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="学生列表" navigator={this.props.navigator} actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 this.navigate2AddStudent(this.props.courseId)}
                         }}>
                    <SearchBar
                        lightTheme
                        onChangeText={
                            //模糊查询
                            (text)=>{
                                this.searchByText(text,this.state.allStudents)
                            }
                        }
                        placeholder='姓名\电话' />
                    <View style={{width:width,height:40,backgroundColor:'#eee',padding:10,alignItems:'flex-start',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#888',fontSize:13}}>学生名单</Text>
                    </View>
                    {<View style={{flex:1,backgroundColor:'#eee'}}>
                        <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff'}}>
                            <ScrollView>
                                {studentsListView}
                            </ScrollView>
                        </Animated.View>
                    </View>}
                </Toolbar>
            </View>
        )
    }

    componentDidMount()
    {
        this.fetchStudents(this.props.courseId)
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
        userType: state.user.user.usertype,
        creatorId:state.user.personInfo.personId
    })
)(StudentInformation);