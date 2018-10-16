/**
 * Created by dingyiming on 2017/2/16.
 */
/**
 * "yyyy-MM-dd hh:mm:ss
 *
 */
let EmptyFilter= {

    filter: (source) => {
        /*判断对象不为空*/
            if(!isEmpty(source)){
                return true;
            }
            return false;
    }
}

/*判断对象为空*/
function isEmpty(obj){
    if(typeof (obj) != 'number' && (!obj || obj == null || obj == ' ' || obj == undefined || typeof (obj) == 'undefined')){
        return true;
    }
    return false;
};

module.exports=EmptyFilter;
