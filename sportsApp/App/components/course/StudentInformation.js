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
    InteractionManager,
    Modal,
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
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD,ACTION_BARCODE} from 'react-native-toolbar-wrapper'
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
import BadmintonCoursePay from './BadmintonCoursePay'
import CoursePayModal from './CoursePayModal'
import { IndicatorViewPager,PagerTitleIndicator } from 'rn-viewpager'

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

    navigate2BadmintonCoursePay(course,isChild){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'BadmintonCoursePay',
                component: BadmintonCoursePay,
                params: {
                    course:course,
                    isChild:isChild,//0为自己报名,1为孩子报名(isChild=0/1)
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

        <TouchableOpacity style={{flexDirection:'column',marginTop:4,backgroundColor:'#fff'}}
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

                {
                    rowData.isChild==1?
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 14, color: '#fc6254'}}>家长</Text>
                        <Text style={{fontSize: 13, color: '#666', marginLeft: 5,}}>{rowData.parentName}</Text>
                    </View>:
                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}/>
                }
            </View>

            <View style={{flex:3,padding:10,flexDirection:'row'}}>
                <View style={{flex:2,flexDirection:'row',marginBottom:3}}>
                    <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                        <Text style={{color:'#66CDAA'}}>身高体重</Text>
                    </View>
                    <View style={{flex:2,padding:5,marginLeft:5}}>
                        <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.heightweight}</Text>
                    </View>
                </View>

                    <View style={{flex:2,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>已上课次</Text>
                        </View>
                        <View style={{flex:2,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.hasCount}/{rowData.buyCount}</Text>
                        </View>
                    </View>
            </View>

            <View style={{height:0.7,width:width,backgroundColor:'#c2c2c2'}}></View>

        </TouchableOpacity>
    )}

    fetchStudents(courseId){
        this.props.dispatch(fetchStudents(courseId)).then((json)=> {
            var students = json.data;
            var childStudentsList = [];
            var selfStudentsList = [];
            for(var i=0;i<students.length;i++){
                if(students[i].isChild==1)childStudentsList.push(students[i])
                else selfStudentsList.push(students[i])
            }
            this.setState({students:json.data,allStudents:json.data,childStudents:childStudentsList,selfStudents:selfStudentsList})
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
            bgColor: new Animated.Value(0),

            allStudents:null,
            students:null,
            childStudents:[],
            selfStudents:[],

            modalVisible:false,
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
        var childStudentsListView=null;
        var childStudents = this.state.childStudents;

            var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (childStudents !== undefined && childStudents !== null && childStudents.length > 0)
            {
                childStudentsListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds1.cloneWithRows(childStudents)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }

        var selfStudentsListView=null;
        var selfStudents = this.state.selfStudents;

        var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (selfStudents !== undefined && selfStudents !== null && selfStudents.length > 0)
        {
            selfStudentsListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds2.cloneWithRows(selfStudents)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (

            // course:{classCount: 100,clubName: "山体",coachId: "小吴,邹鹏,",coachLevel: "五星级教练",cost: 150,costType: "1",courseClub: 1,
            // courseGrade: 1,courseId: 29, courseName: "健身场地暖冬畅玩",courseNum: "20180021",createTime: 1521944116000,
            // creatorId: 3,creatorLoginName: "wbh",creatorName: "小吴",creatorPhone: "18254888887",detail: "每小时150",indexNum: 0,
            // isOwner: 1,maxNumber: 100,scheduleDes: "每小时150",signNumber: 0,status: 0,trainerId: "1,35,",unitId: 1,unitName: "山东体育学院羽毛球馆"}


        <View style={styles.container}>
                <Toolbar width={width} title="学生列表" navigator={this.props.navigator} actions={[{icon:ACTION_BARCODE,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0) {
                                 //扫码报名
                                 this.setState({modalVisible:true})
                             }
                         }} >

                    {<View style={{flex:1,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingBottom:5,}}>
                            <IndicatorViewPager
                                style={{flex:1,flexDirection: 'column-reverse'}}
                                indicator={this._renderTitleIndicator()}
                                onPageScroll={this._onPageScroll.bind(this)}
                            >
                                <View>{selfStudentsListView}</View>
                                <View>{childStudentsListView}</View>
                            </IndicatorViewPager>
                        </Animated.View>
                    </View>}

                    {/* Add CoursePay Modal*/}
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            console.log("Modal has been closed.");
                        }}
                    >
                        <CoursePayModal
                            onClose={()=>{
                                this.setState({modalVisible:false});
                            }}
                            navi2CoursePay={(isChild)=>{
                                this.navigate2BadmintonCoursePay(this.props.course,isChild)
                            }}
                        />

                    </Modal>

                </Toolbar>
            </View>
        )
    }

    _renderTitleIndicator () {
        return (
            <PagerTitleIndicator
                style={styles.indicatorContainer}
                trackScroll={true}
                itemTextStyle={styles.indicatorText}
                itemStyle={{width:width/2}}
                selectedItemStyle={{width:width/2}}
                selectedItemTextStyle={styles.indicatorSelectedText}
                selectedBorderStyle={styles.selectedBorderStyle}
                titles={['个人学员', '孩子学员']}
            />
        )
    }

    _onPageScroll (scrollData) {
        let {offset, position} = scrollData
        if (position < 0 || position > 1) return
    }

    componentDidMount()
    {
        this.fetchStudents(this.props.course.courseId)
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
    },
    indicatorContainer: {
        backgroundColor: '#66CDAA',
        height: 48
    },
    indicatorText: {
        fontSize: 14,
        color: 0xFFFFFF99
    },
    indicatorSelectedText: {
        fontSize: 14,
        color: 0xFFFFFFFF
    },
    selectedBorderStyle: {
        height: 3,
        backgroundColor: 'white'
    },
    statusBar: {
        height: 24,
        backgroundColor: 0x00000044
    },
    toolbarContainer: {
        height: 56,
        backgroundColor: 0x00000020,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    backImg: {
        width: 16,
        height: 17
    },
    titleTxt: {
        marginLeft: 36,
        color: 'white',
        fontSize: 20
    }
});

module.exports = connect(state=>({
        userType: state.user.user.usertype,
        creatorId:state.user.personInfo.personId
    })
)(StudentInformation);