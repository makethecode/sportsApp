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
import ViewPager from 'react-native-viewpager';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_MAP} from 'react-native-toolbar-wrapper';
import Video from 'react-native-video';
import Config from '../../../config'

var {height, width} = Dimensions.get('window');

class VideoDetail extends Component{

    constructor(props) {
        super(props);

        this.state={
            paused:false,
        }
    }

    renderRow(rowData,sectionId,rowId){

        // {'avatar','perName','content'}

        return (
            <View style={{width:width,height:70,flexDirection:'column',borderBottomWidth:1,borderColor:'#ddd',padding:5,paddingHorizontal:5,backgroundColor:'#fff'}}>

                <View style={{flex:1,justifyContent: 'flex-start',alignItems: 'center',flexDirection:'row',paddingHorizontal:10}}>
                    <Image style={{width:30,height:30}} source={{uri:rowData.avatar}} resizeMode="stretch"/>
                    <Text style={{color:'#333',fontSize:14,marginLeft:5}}>{rowData.perName}</Text>
                </View>

                <View style={{flex:1,justifyContent: 'center',alignItems: 'flex-start',paddingHorizontal:10}}>
                    <Text style={{color:'#666',fontSize:12}}>{rowData.content}</Text>
                </View>

            </View>
        );
    }

    render() {

        //{id,videoname,type,author,brief,longbrief,browsecount,uploadTime,commentList,videoUrl}

        var video = this.props.video;

        var commentList=null
        if(video.commentList && video.commentList.length>0)
        {
            var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            commentList=(
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds1.cloneWithRows(video.commentList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>
            );
        }

        if(video.videoUrl!=null && video.videoUrl!='') {
            var videoUrl = 'http://114.215.99.2' + video.videoUrl.substring(27, video.videoUrl.length);
        }

        return (
            <View style={{flex:1,flexDirection:'column',backgroundColor:'#eee'}}>

                <Toolbar width={width} title="视频播放" actions={[]} navigator={this.props.navigator}>

                    <View style={{width:width,height:200,marginTop:10,justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity
                            onPress={() => this.setState({ paused: !this.state.paused })}
                        >
                        <Video
                            source={{uri: videoUrl}} // Can be a URL or a local file.
                            rate={1.0}                   // 控制暂停/播放，0 代表暂停
                            volume={1.0}                 // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
                            muted={false}                //true代表静音，默认为false.
                            paused={true}               // Pauses playback entirely.
                            resizeMode="cover"           // 视频的自适应伸缩铺放行为，
                            repeat={true}                // 是否重复播放
                            style={{width:width-20,height:200}}
                        />
                        </TouchableOpacity>
                    </View>

                    <View style={{width:width,height:40,backgroundColor:'#fff',justifyContent:'center',padding:10,marginBottom:1}}>
                        <Text style={{color:'#333',fontSize:16}}>
                            {video.videoname}
                        </Text>
                    </View>

                    <View style={{width:width,height:60,backgroundColor:'#fff',justifyContent:'center',padding:10,textAlign:'start',marginBottom:1}}>
                        <Text style={{color:'#666',fontSize:13}}>
                            {video.longbrief}
                        </Text>
                    </View>

                    <View style={{width:width,height:30,backgroundColor:'#fff',justifyContent:'center',padding:10,marginBottom:1}}>
                        <Text style={{color:'#333',fontSize:14}}>
                            评价
                        </Text>
                    </View>

                    {commentList}

                </Toolbar>

            </View>
        );
    }

}

var styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
    },
});

module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(VideoDetail);
