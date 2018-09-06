import React, {Component} from 'react';
import {
    Dimensions,
    TextInput,
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
    NetInfo,
    TouchableHighlight,
    ActivityIndicator,
    WebView,
    Alert,
    AlertIOS,
    DeviceEventEmitter, // android
    NativeAppEventEmitter, // ios
} from 'react-native';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import proxy from "../../utils/Proxy";
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_QR_SCANNER} from 'react-native-toolbar-wrapper'
import Config from '../../../config';
import Camera from 'react-native-camera';
import ProductPay from './ProductPay'
const {height, width} = Dimensions.get('window');

class ScannerList extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2ProductPay(goods,money)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'ProductPay',
                component: ProductPay,
                params: {
                    //暂时实现一次扫描
                    goods:goods,
                    money:money,
                }
            })
        }
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    queryGoodsCode(code) {

        proxy.postes({
            url: Config.server + '/func/allow/getGoodInfoByCode',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                code:code,
            }
        }).then((json) => {

            var goods = this.state.goods;
            goods.push(json.data[0]);
            var money = this.state.money + json.data[0].salePrice;
            this.setState({goods: goods, money: money});

        }).catch((err) => {
            alert(err);
        });
    }

    constructor(props) {
        super(props);
        this.state={
            goodName:null,
            cameraModalVisible: false,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto,
                barcodeScannerEnabled:true,
            },
            code:null,
            //实现多次扫描
            goods:[
                {sortId:'1234567',name:'农夫山泉',brief:'农夫山泉 饮用天然水塑膜量贩装',salePrice:2,
                    inventortNumber:5,size:'550ml',clubId:1,id:1,url:'/badminton/mall/goods/nongfushanquan.jpeg'},
                {sortId:'678930',name:'脉动',brief:'MIZONE/脉动维生素饮料 青柠味 ',salePrice:4,size:'600ml',clubId:1,id:2,
                url:'/badminton/mall/goods/maidong.jpeg'},
            ],
            money:6,
        };
    }

    renderRow(rowData, sectionId, rowId) {

        const defaultImg = require('../../../img/p1.jpeg')
        var url = Config.server + rowData.url

        var lineStyle=null;
        lineStyle={flex:1,flexDirection:'row',padding:10,paddingLeft:0,paddingRight:0,borderBottomWidth:1,
            borderColor:'#ddd',justifyContent:'flex-start',backgroundColor:'transparent',};

        var row=(
            <TouchableOpacity style={lineStyle}>
                <View style={{flex:1,justifyContent:'flex-start',alignItems:'center'}}>
                    <Image resizeMode="contain" style={{ width:100,height:100}} source={{uri:url}} />
                </View>
                <View style={{flex:2,justifyContent:'flex-start',alignItems:'flex-start',paddingLeft:5}}>
                    <View style={{flex:2,justifyContent:'flex-start',alignItems:'center',marginBottom:3}}>
                        <Text  style={{fontSize:14,color:'#343434'}}>{rowData.brief}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:2}}>
                        <View style={{backgroundColor: '#efefef',justifyContent:'center',alignItems:'center',padding:2}}>
                            <Text style={{flex: 1, fontSize: 12, color: '#8a8a8a'}}>{rowData.size}</Text>
                        </View>
                    </View>
                        {
                            //库存量<10时库存紧张
                            rowData.inventortNumber<10?
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:2}}>
                            <View style={{flex: 1, backgroundColor: 'red',justifyContent:'center',alignItems:'center',padding:2}}>
                                <Text style={{flex: 1, fontSize: 12, color: '#fff'}}>库存紧张</Text>
                            </View>
                            < View style={{flex:3,backgroundColor:'red'}}/>
                            </View>
                            :
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:5}}></View>
                        }
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:3}}>
                        <Text style={{flex:4,fontSize:13,color:'red'}}>￥{rowData.salePrice}</Text>
                        <TouchableOpacity style={{justifyContent:'center',alignItems: 'center',padding:5,marginLeft:5}}
                                          onPress={()=>{
                                              var goods = this.state.goods
                                              goods.splice(rowId,1)
                                              var money = this.state.money-rowData.salePrice
                                              this.setState({goods:goods,money:money})
                                          }}>
                            <Image style={{width: 20, height: 20}} source={require('../../../img/delete_icon.png')}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
        return row;
    }

    render()
    {

        var goodsListView=null;
        var goods = this.state.goods;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (goods !== undefined && goods !== null && goods.length > 0)
        {
                goodsListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        //列表中数据
                        dataSource={ds.cloneWithRows(goods)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="收银台" navigator={this.props.navigator}
                         actions={[{icon:ACTION_QR_SCANNER,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0)
                             {
                                 //打开相机开始扫码
                                 this.setState({cameraModalVisible: true})
                             }
                         }}>

                    {<View style={{flex:5,backgroundColor:'#fff'}}>
                            <ScrollView>
                                {goodsListView}
                                {
                                    goodsListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }
                            </ScrollView>
                    </View>}

                    <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',alignItems:'center',padding:5,backgroundColor:'#f4f4f4',paddingBottom:15}}>
                        <View style={{flex:4,flexDirection:'row',padding:10,alignItems: 'center'}}>
                            <Text style={{color:'#8a8a8a',fontSize:15}}>总计：</Text>
                            <Text style={{color:'red',fontSize:15}}>￥{this.state.money}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({goods:[],money:0})
                                        this.navigate2ProductPay(this.state.goods,this.state.money)
                                    }}>
                                    <Text style={{color:'#fff',fontSize:15}}>结账</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Toolbar>
                {/*camera part*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.cameraModalVisible}
                    onRequestClose={() => {
                        this.setState({cameraModalVisible: false})
                    }}
                >
                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        style={styles.preview}
                        aspect={this.state.camera.aspect}
                        captureTarget={this.state.camera.captureTarget}
                        type={this.state.camera.type}
                        flashMode={this.state.camera.flashMode}
                        defaultTouchToFocus
                        mirrorImage={false}
                        barcodeScannerEnabled={this.state.camera.barcodeScannerEnabled}
                        onBarCodeRead={(barcode) => {
                            var {data, type} = barcode;

                            if (data !== undefined && data !== null) {

                                this.setState({code: data})
                                this.queryGoodsCode(this.state.code)
                                this.closeCamera()
                            }
                        }}
                    />

                    <View style={[styles.box]}>

                    </View>
                    <View style={{
                        position: 'absolute',
                        right: 1 / 2 * width - 100,
                        top: 1 / 2 * height,
                        height: 100,
                        width: 200,
                        borderTopWidth: 1,
                        borderColor: '#e42112',
                        backgroundColor: 'transparent'
                    }}>

                    </View>

                    <View style={[styles.overlay, styles.bottomOverlay]}>

                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={() => {
                                this.closeCamera()
                            }}
                        >
                            <Icon name="times-circle" size={50} color="#343434"/>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )

    }

    componentWillUnmount()
    {
        this.setState({goods:[]})
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection:'column',
    },
    siftWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        height: 44,
        borderBottomColor: '#cdcdcd',
    },
    viewWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        height: 50,
        borderBottomColor: '#cdcdcd',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
    },
    modelbox: {
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        width: 300,
        height: 200,
        backgroundColor: '#ffffff'
    },
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    body: {
        padding: 10
    },
    row: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    box: {
        position: 'absolute',
        right: 1 / 2 * width - 100,
        top: 1 / 2 * height - 100,
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#387ef5',
        backgroundColor: 'transparent'

    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

module.exports = connect(state=>({

        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        clubId:state.user.personInfoAuxiliary.clubId,
        coaches:state.coach.coaches,
        total:state.myprofit.total,
        qunhuodong:state.myprofit.qunhuodong,
        total1:state.myprofit.total1,
        huaxiao:state.myprofit.huaxiao,
        total2:state.myprofit.total2,
        tel1:state.myprofit.tel1,
        tel2:state.myprofit.tel2,
        wx1:state.myprofit.wx1,
        wx2:state.myprofit.wx2,
    })
)(ScannerList);