/**
 * Created by danding on 2018/8/17.
 */
let ProfitAssortFilter={
//对收益进行筛选
    filter:(list,typeId)=>{
        var filterList = [];

        if(typeId==-1)
            for(var i=0;i<list.length;i++)filterList.push(list[i])
        //对种类进行筛选
        if(typeId!=-1)
            for(var i=0;i<list.length;i++)if(list[i].typeId==typeId)filterList.push(list[i])
        return filterList;
    }
}
module.exports=ProfitAssortFilter;