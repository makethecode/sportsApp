
let GoodsProfitFilter={
//对商品收益进行筛选
    filter:(list,clubId,typeId)=>{
        var filterList = [];

        if(clubId==-1 && typeId==-1)
            for(i=0;i<list.length;i++)filterList.push(list[i])
        //对俱乐部进行筛选
        if(clubId!=-1 && typeId==-1)
            for(i=0;i<list.length;i++)if(list[i].clubId==clubId)filterList.push(list[i])
        //对种类进行筛选
        if(clubId==-1 && typeId!=-1)
            for(i=0;i<list.length;i++)if(list[i].typeId==typeId)filterList.push(list[i])
        //对俱乐部和种类筛选
        if(clubId!=-1 && typeId!=-1)
            for(i=0;i<list.length;i++)if(list[i].clubId==clubId && list[i].typeId==typeId)filterList.push(list[i])

        return filterList;
    }
}
module.exports=GoodsProfitFilter;