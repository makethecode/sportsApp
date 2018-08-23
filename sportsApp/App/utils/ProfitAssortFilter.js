/**
 * Created by danding on 2018/8/17.
 */
let ProfitAssortFilter={

    filter:(list,clubId,venueId,typeId)=>{
        var res = list;
        for(var i=0;i<res.length;) {
            var isRemove = false;
            if (res[i].clubId != clubId && clubId != -1)
            {res.splice(i,1);isRemove=true;}
            //场馆类型不知道如何判断
            // if (isRemove==false && res[i].unitId != venueId && venueId != -1)
            // {res.splice(i,1);isRemove=true;}
            //项目类型不知道如何判断
            if(isRemove==false)i++;
        }
        return res;
    }
}
module.exports=ProfitAssortFilter;