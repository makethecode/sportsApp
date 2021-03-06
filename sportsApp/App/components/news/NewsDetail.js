
import React, {Component} from 'react';
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
    InteractionManager,
    WebView
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';

var {height, width} = Dimensions.get('window');
var BGWASH = 'rgba(255,255,255,0.8)';

class NewsDetail extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
            detailHtml:''
        }
    }

    render()
    {
        return (
            <View style={styles.container}>

                <Toolbar width={width}  title="新闻详情" navigator={this.props.navigator} actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>
                    <WebView
                        automaticallyAdjustContentInsets={true}
                        source={{html: this.state.detailHtml, baseUrl: ''}}     //网页数据源
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                    />
                </Toolbar>
            </View>
        )
    }

    componentDidMount(){
        this.getNewsDetail();
    }

    getNewsDetail(){
        var docid=this.props.docid;       //获取新闻id
        let url='http://c.3g.163.com/nc/article/' + docid + '/full.html';    //拼接新闻详情的url
        fetch(url).then(response=>response.json())
            .then((responseJson)=>{
                let detail=responseJson[docid];
                let imgArr=detail.img;                      //抽取数据中的图片数组
                let rawHtml=detail.body;                    //抽取数据中的htmlbody内容
                imgArr.forEach((imgItem)=>{                 //遍历图片数组将图片插入到body中
                    let imgHtml='<img src="'+imgItem.src+'" width="100%">';
                    rawHtml=rawHtml.replace(imgItem.ref,imgHtml);
                });
                this.setState({
                    detailHtml:rawHtml                        //将拼接好的网页body保存到state中
                });
            })
            .catch((err)=>{
                console.log(err);
            })
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

});

export default  NewsDetail
