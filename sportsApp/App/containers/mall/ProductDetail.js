
import React,{Component} from 'react';
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
    DeviceEventEmitter
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewPager from 'react-native-viewpager';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_QR_SCANNER,ACTION_BARCODE,ACTION_BOOK} from 'react-native-toolbar-wrapper'
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditProduct from './EditProduct'
import Config from '../../../config';
import Proxy from '../../utils/Proxy';

var {height, width} = Dimensions.get('window');

class ProductDetail extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2EditProduct(product)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'EditProduct',
                component: EditProduct,
                params: {
                    product:product
                }
            })
        }
    }

    _renderPage(data,pageID){
        return (
            <View style={{width:width}}>
                <Image
                    source={{uri:data}}
                    style={{width:width,flex:3}}
                    resizeMode={"stretch"}
                />
            </View>
        );
    }

    constructor(props) {
        super(props);
        this.state={
            product:{id:0,goodsnum:0,name:'',type:'',typeStr:'',typeList:[],jsonList:[],reservenum:0,brief:'',discount:0,
                thumburl:'',price:0,realprice:0,creatorId:0,creatorTel:'',creatorName:'',creatorAvatar:'',imgsUrl:'',detailurl:''},
            imgHeight:height,
            imgWidth:width,
        }
    }

    renderAllJson(jsonList){
        var allJsons = [];
        if(jsonList==null)return null;

        var str = jsonList.substring(1,jsonList.length-1);
        var strList = str.split(',');
        var model;
        for(var i=0;i<strList.length;i++) {
            model = strList[i];
            if(this.isNumber(model));
            else model = model.substring(1,model.length-1)
            var item = this.getJsonItem(model)
            allJsons.push(item);
        }
        return allJsons;
    }

    getJsonItem(model){

        return (
            <View style={{flexDirection:'row',borderColor:'#ddd',padding:3,marginRight:8,borderWidth:1}}>
                <Text style={{color:'#222',fontSize:12}}>{model}</Text>
            </View>
        );
    }

    isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
    }

    renderRow(rowData, sectionId, rowId) {

        var jsonList = this.state.product.jsonList[rowId];

        var jsonListView = (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                bounces ={false}
                showsHorizontalScrollIndicator  ={false}
                ref={(scrollView) => { this._scrollView = scrollView; }}
                horizontal={true}
            >
                {this.renderAllJson(jsonList)}
            </ScrollView>
        );

        return (
            <View style={{flexDirection:'row',alignItems:'center',marginTop:3}}>
                <Text style={{color:'#666',}} adjustsFontSizeToFit={true} allowFontScaling={true}>{rowData} </Text>
                <View style={{flexDirection:'row',}}>
                    {jsonListView}
                </View>
            </View>
        )}

    render() {

            var imgsView = null;
            var imgs = this.state.product.imgsurl;
            if (imgs !== undefined && imgs !== null) {
                var imgList = imgs.split(';');
                var ds = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
                var dataSource = ds.cloneWithPages(imgList);

                imgsView=(
                    <ViewPager
                        style={this.props.style}
                        dataSource={dataSource}
                        renderPage={this._renderPage}
                        isLoop={true}
                        autoPlay={true}
                    />
                )
            }

            var oldPrice = this.state.product.price / 100;
            var discount = this.state.product.discount / 100;
            var newPrice = this.state.product.realprice / 100;

            var typeListView = null;
            var typeList = this.state.product.typeList;

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (typeList !== undefined && typeList !== null && typeList.length > 0) {
                typeListView = (
                    <View style={{marginTop:1,padding:10,backgroundColor:'#fff'}}>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(typeList)}
                        renderRow={this.renderRow.bind(this)}
                    /></View>
                );
            }

        return (
            <View style={{flex:1,backgroundColor:'#eee'}}>
                <Toolbar width={width} title="商品详情" navigator={this.props.navigator}
                         actions={[{icon:ACTION_BOOK,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             this.navigate2EditProduct(this.state.product)
                         }}>
                <ScrollView style={{width:width,height:height,backgroundColor:'#eee'}}>

                    <View style={{width:width,height:height*0.4}}>
                        {imgsView}
                    </View>

                    <View>
                        {/*商品名称*/}
                        <View style={{width:width,flexDirection:'column',justifyContent:'center',alignItems:'flex-start',padding:10,backgroundColor:'#fff'}}>
                        <Text style={{color:'#343434',fontSize:15}}>{this.state.product.name}</Text>
                        </View>
                        {/*价格+折扣*/}
                        <View style={{width:width,flexDirection:'column',justifyContent:'center',alignItems:'flex-start',marginTop:1,backgroundColor:'#fff',padding:10}}>
                            <Text style={{fontSize:12,color:'#666',textDecorationLine:'line-through'}}>原价 ￥{oldPrice}</Text>
                            <View style={{flexDirection:'row',marginTop:5}}>
                                <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                <Text style={{fontSize:16,color:'red'}}>现价 ￥{newPrice}</Text>

                                <View style={{backgroundColor:'#66CDAA',marginLeft:20,padding:3,textAlign:'center'}}>
                                    <Text style={{fontSize:12,color:'#fff'}}>折扣 {discount}</Text>
                                </View>
                                </View>

                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text style={{fontSize:13,color:'#666'}}>库存量 </Text>
                                <View style={{backgroundColor:'red',marginLeft:5,padding:3}}>
                                    <Text style={{fontSize:16,color:'#fff'}}>{this.state.product.reservenum}</Text>
                                </View>
                                </View>

                            </View>
                        </View>
                        {/*简介*/}
                        <View style={{flexDirection:'row',padding:10,alignItems:'center',backgroundColor:'#fff',marginTop:1}}>
                            <Text style={{color:'#444',fontSize:13}}>{this.state.product.brief}</Text>
                        </View>

                    </View>

                    {/*规格*/}

                        {typeListView}

                    {/*上传人*/}
                    <View style={{marginTop:1,padding:10,backgroundColor:'#fff',flexDirection:'row'}}>
                        <View style={{flex:1,jusifyContent:'center'}}>
                            <Image source={{uri:this.state.product.creatorAvatar}} style={{width:35,height:35,borderRadius:17}} resizeMode={"stretch"} />
                        </View>
                        <View style={{flex:6,jusifyContent:'center',alignItems:'flex-start',flexDirection:'column'}}>
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Ionicons name='md-person' size={12} color="#fca482"/>
                                <Text style={{fontSize:13,color:'#333',marginLeft:5}}>{this.state.product.creatorName}</Text>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Ionicons name='md-call' size={12} color="#fca482"/>
                                <Text style={{fontSize:13,color:'#333',marginLeft:5}}>{this.state.product.creatorTel}</Text>
                            </View>
                        </View>
                    </View>

                    {/*详情图片*/}
                    <View style={{marginTop:2,backgroundColor:'#fff',marginBottom:20}}>
                        <Image
                            source={{uri:this.state.product.detailurl}}
                            style={{width:this.state.imgWidth,height:this.state.imgHeight}}
                            resizeMode={"stretch"}
                        />
                    </View>

                </ScrollView>

                </Toolbar>
            </View>
        );
    }

    componentWillMount(){
        this.fetchGoodsDetailInfo(this.props.productId)
        this.productListener=DeviceEventEmitter.addListener('on_product_edit', (data)=>{
            if(data)
                this.fetchGoodsDetailInfo(this.props.productId)
        });
    }

    componentWillUnmount()
    {
        if(this.productListener)
            this.productListener.remove();
    }

    fetchGoodsDetailInfo(productId){

        Proxy.postes({
            url: Config.server + '/func/node/fetchGoodsDetailInfo',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                productId:productId
            }
        }).then((json)=>{

            var product = json.data;
            this.setState({product:product})

            Image.getSize(this.state.product.detailurl, (imgwidth, imgheight) => {
                var imgHeight = width * imgheight / imgwidth;
                this.setState({imgHeight:imgHeight,imgwidth:width});
            });

        }).catch((e)=>{
        })

    }

}

var styles = StyleSheet.create({


});

const mapStateToProps = (state, ownProps) => {

    const props = {

    }
    return props
}

export default connect(mapStateToProps)(ProductDetail);


