
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
    Easing
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewPager from 'react-native-viewpager';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_QR_SCANNER,ACTION_BARCODE,ACTION_ADD} from 'react-native-toolbar-wrapper'

var {height, width} = Dimensions.get('window');

class ProductDetail extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
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
            product:this.props.product,
        }
    }

    renderAllJson(jsonList){
        var allJsons = [];
        if(jsonList==null)return null;
        for(var i=0;i<jsonList.length;i++) {
            var model = jsonList[i]
            var item = this.getJsonItem(model)
            allJsons.push(item);
        }
        return allJsons;
    }

    getJsonItem(model){

        return (
            <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',padding:3,marginRight:8}}>
                <Text style={{color:'#343434',fontSize:11}}>{model}</Text>
            </View>
        );
    }

    renderRow(rowData, sectionId, rowId) {

        var jsonList = this.props.product.jsonList;

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
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{color:'#888',}} adjustsFontSizeToFit={true} allowFontScaling={true}>{rowData}：</Text>
                <View style={{flexDirection:'row',}}>
                    {jsonListView}
                </View>
            </View>
        )}

    render() {

        var imgs = this.state.product.imgsurl;
        var imgList = imgs.split(";");
        var ds=new ViewPager.DataSource({pageHasChanged:(p1,p2)=>p1!==p2});
        var dataSource = ds.cloneWithPages(imgList);

        var oldPrice = this.state.product.price;
        var discount = this.state.product.discount;
        var newPrice = oldPrice*discount;

        var typeListView=null;
        var typeList = this.state.product.typeList;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (typeList !== undefined && typeList !== null && typeList.length > 0) {
            typeListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(typeList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (
            <View style={{flex:1,backgroundColor:'#eee'}}>
                <Toolbar width={width} title="商品详情" actions={[]} navigator={this.props.navigator}>
                <ScrollView style={{width:width,height:height,backgroundColor:'#eee'}}>

                    <View style={{width:width,height:height*0.4}}>
                        <ViewPager
                            style={this.props.style}
                            dataSource={dataSource}
                            renderPage={this._renderPage}
                            isLoop={true}
                            autoPlay={true}
                        />
                    </View>

                    <View style={{backgroundColor:'#fff'}}>
                        {/*商品名称*/}
                        <View style={{width:width,flexDirection:'column',justifyContent:'center',alignItems:'flex-start',padding:10}}>
                        <Text style={{color:'#343434',fontSize:15}}>{this.state.product.name}</Text>
                        </View>
                        {/*价格+折扣*/}
                        <View style={{width:width,flexDirection:'column',justifyContent:'center',alignItems:'flex-start',marginTop:3,backgroundColor:'#eee',padding:10}}>
                            <Text style={{fontSize:12,color:'#666',textDecorationLine:'line-through'}}>原价 ￥{oldPrice}</Text>
                            <View style={{flexDirection:'row',marginTop:5}}>
                                <Text style={{fontSize:16,color:'red'}}>现价 ￥{newPrice}</Text>
                                <View style={{backgroundColor:'#66CDAA',marginLeft:20,padding:3}}>
                                    <Text style={{fontSize:12,color:'#fff'}}>折扣 {discount}</Text>
                                </View>
                            </View>
                        </View>
                        {/*简介*/}
                        <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                            <Text style={{color:'#444',fontSize:13}}>{this.state.product.brief}</Text>
                        </View>

                    </View>

                    <View style={{marginTop:1,padding:10,backgroundColor:'#fff'}}>
                        {/*库存*/}
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'#888',}} adjustsFontSizeToFit={true} allowFontScaling={true}>尺码：</Text>
                            <View style={{flexDirection:'row',}}>
                                <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',padding:3,marginRight:8}}>
                                    <Text style={{color:'#343434',fontSize:11}}>M</Text>
                                </View>
                                <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',padding:3,marginRight:8}}>
                                    <Text style={{color:'#343434',fontSize:11}}>L</Text>
                                </View>
                                <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',padding:3,marginRight:8}}>
                                    <Text style={{color:'#343434',fontSize:11}}>XL</Text>
                                </View>
                            </View>
                        </View>
                        {/*规格*/}
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'#888',}} adjustsFontSizeToFit={true} allowFontScaling={true}>尺码：</Text>
                            <View style={{flexDirection:'row',}}>
                                <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',padding:3,marginRight:8}}>
                                    <Text style={{color:'#343434',fontSize:11}}>M</Text>
                                </View>
                                <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',padding:3,marginRight:8}}>
                                    <Text style={{color:'#343434',fontSize:11}}>L</Text>
                                </View>
                                <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',padding:3,marginRight:8}}>
                                    <Text style={{color:'#343434',fontSize:11}}>XL</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:8}}>
                            <Text style={{color:'#888',fontSize:12}}>颜色：</Text>
                            <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',padding:3,marginRight:8}}>
                                <Text style={{color:'#343434',fontSize:11}}>白色</Text>
                            </View>
                            <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',padding:3,marginRight:8}}>
                                <Text style={{color:'#343434',fontSize:11}}>灰色</Text>
                            </View>
                            <View style={{flexDirection:'row',borderWidth:1,borderColor:'#ddd',padding:3,marginRight:8}}>
                                <Text style={{color:'#343434',fontSize:11}}>黑色</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:8}}>
                            <Text style={{flex:1,color:'#aaa',fontSize:12}}>数量：</Text>

                            <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                                <View style={{flex:1}}>
                                    <Icon name={'plus-square-o'} size={20} color="#ddd"/>
                                </View>
                                <View style={{flex:1,}}>
                                    <Text style={{color:'#343434',fontSize:11}}>1</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Icon name={'minus-square-o'} size={20} color="#ddd"/>
                                </View>
                            </View>
                            <View style={{flex:2,color:'#aaa',fontSize:12}}>

                            </View>
                        </View>

                        <View style={{marginTop:8}}>
                            <Text style={{flex:1,color:'#008B00',fontSize:13}}>健康商城</Text>

                            <View style={{flex:2,flexDirection:'row',marginTop:10}}>
                                <Icon name="bookmark-o" size={16} color="#EEAD0E" />
                                <Text style={{color:'#aaa',fontSize:11,marginRight:10}}>
                                   正品保证
                                </Text>
                                <Icon name="bookmark-o" size={16} color="#EEAD0E" />
                                <Text style={{color:'#aaa',fontSize:11,marginRight:10}}>
                                   超值返利
                                </Text>
                                <Icon name="bookmark-o" size={16} color="#EEAD0E" />
                                <Text style={{color:'#aaa',fontSize:11,marginRight:10}}>
                                  全场包邮
                                </Text>
                            </View>

                        </View>
                    </View>

                </ScrollView>
                </Toolbar>
            </View>
        );
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


