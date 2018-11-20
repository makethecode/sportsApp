/**
 * Created by danding on 2018/8/14.
 */

let AssortFilter={
//对课程进行筛选
    filter:(list,venues,venueId,coachId,typeId)=>{
        var filterList = [];
        var unitId = -1;

        if(typeId==-1 && venueId==-1 && coachId==-1)
            for(var i=0;i<list.length;i++)filterList.push(list[i])
        //对分类进行筛选
        if(typeId!=-1 && venueId==-1 && coachId==-1)
            for(var i=0;i<list.length;i++)if(list[i].sportsType==typeId)filterList.push(list[i])
        //对场馆进行筛选
        if(typeId==-1 && venueId!=-1 && coachId==-1)
        {
            for(var i=0;i<venues.length;i++)
                if(venues[i].idx == venueId)unitId = venues[i].unitId;
            for(var i=0;i<list.length;i++)if(list[i].unitId==unitId)filterList.push(list[i])
        }
        //对教练进行筛选
        if(typeId==-1 && venueId==-1 && coachId!=-1)
            for(var i=0;i<list.length;i++)if(list[i].creatorId==coachId)filterList.push(list[i])
        //对分类和场馆进行筛选
        if(typeId!=-1 && venueId!=-1 && coachId==-1)
        {
            for(var i=0;i<venues.length;i++)
                if(venues[i].idx == venueId)unitId = venues[i].unitId;

            for(var i=0;i<list.length;i++)if(list[i].sportsType==typeId && list[i].unitId == unitId)filterList.push(list[i]);
        }
        //对分类和教练筛选
        if(typeId!=-1 && venueId==-1 && coachId!=-1)
            for(var i=0;i<list.length;i++)if(list[i].sportsType==typeId && list[i].creatorId==coachId)filterList.push(list[i])
        //对场馆和教练筛选
        if(typeId==-1 && venueId!=-1 && coachId!=-1)
            for(var i=0;i<list.length;i++)
            {
                for(var i=0;i<venues.length;i++)
                    if(venues[i].idx == venueId)unitId = venues[i].unitId;

                if(list[i].unitId==unitId && list[i].creatorId==coachId)filterList.push(list[i])
            }
        //对分类、场馆、教练筛选
        if(typeId!=-1 && venueId!=-1 && coachId!=-1) {
            for(var i=0;i<venues.length;i++)
                if(venues[i].idx == venueId)unitId = venues[i].unitId;

            for (var i = 0; i < list.length; i++)if (list[i].unitId == unitId && list[i].creatorId == coachId && list[i].sportsType == typeId) filterList.push(list[i])
        }
        return filterList;
    }
}
module.exports=AssortFilter;