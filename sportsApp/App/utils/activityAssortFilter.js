
let activityAssortFilter={
//对活动进行筛选
    filter:(list,venueId,dateId,statusId)=>{

        var filterList = [];

        //dateList:['今天','明天','后天','一周内']
        //statusList:['正在报名','已结束']

        //没有筛选
        if(venueId==-1 && dateId==-1 && statusId==-1)
            for(i=0;i<list.length;i++)filterList.push(list[i])
        //对场地进行筛选
        if(venueId!=-1 && dateId==-1 && statusId==-1)
            for(i=0;i<list.length;i++)if(list[i].unitId==venueId)filterList.push(list[i])
        //对日期进行筛选
        if(venueId==-1 && dateId!=-1 && statusId==-1)
        {
            var now   = new Date();
            var selectedDate = new Date();

            switch (dateId) {
                case '0':
                    //今天
                    selectedDate.setDate(now.getDate());

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time)
                            filterList.push(list[i])
                    }
                    break;
                case '1':
                    //明天
                    selectedDate.setDate(now.getDate() + 1);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time)
                            filterList.push(list[i])
                    }
                    break;
                case '2':
                    //后天
                    selectedDate.setDate(now.getDate() + 2);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time)
                            filterList.push(list[i])
                    }
                    break;
                case '3':
                    //一周内
                    selectedDate.setDate(now.getDate() + 7);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)

                        var start_time = getNowFormatDate(now)
                        var end_time = getNowFormatDate(selectedDate)

                        if (activity_time >= start_time && activity_time <= end_time)
                            filterList.push(list[i])
                    }
                    break;
            }
        }
        //对状态进行筛选
        if(venueId==-1 && dateId==-1 && statusId!=-1)
            for(i=0;i<list.length;i++)if(list[i].status==statusId)filterList.push(list[i])
        //对场馆和日期筛选
        if(venueId!=-1 && dateId!=-1 && statusId==-1)
        {
            var now   = new Date();
            var selectedDate = new Date();

            switch (dateId) {
                case '0':
                    //今天
                    selectedDate.setDate(now.getDate());

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time && list[i].unitId==venueId)
                            filterList.push(list[i])
                    }
                    break;
                case '1':
                    //明天
                    selectedDate.setDate(now.getDate() + 1);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time && list[i].unitId==venueId)
                            filterList.push(list[i])
                    }
                    break;
                case '2':
                    //后天
                    selectedDate.setDate(now.getDate() + 2);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time && list[i].unitId==venueId)
                            filterList.push(list[i])
                    }
                    break;
                case '3':
                    //一周内
                    selectedDate.setDate(now.getDate() + 7);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)

                        var start_time = getNowFormatDate(now)
                        var end_time = getNowFormatDate(selectedDate)

                        if (activity_time >= start_time && activity_time <= end_time && list[i].unitId==venueId)
                            filterList.push(list[i])
                    }
                    break;
            }
        }
        //对场馆和状态筛选
        if(venueId!=-1 && dateId==-1 && statusId!=-1)
            for(i=0;i<list.length;i++)if(list[i].unitId==venueId && list[i].status==statusId)filterList.push(list[i])
        //对日期和状态筛选
        if(venueId==-1 && dateId!=-1 && statusId!=-1)
        {
            var now   = new Date();
            var selectedDate = new Date();

            switch (dateId) {
                case '0':
                    //今天
                    selectedDate.setDate(now.getDate());

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time && list[i].status==statusId)
                            filterList.push(list[i])
                    }
                    break;
                case '1':
                    //明天
                    selectedDate.setDate(now.getDate() + 1);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time && list[i].status==statusId)
                            filterList.push(list[i])
                    }
                    break;
                case '2':
                    //后天
                    selectedDate.setDate(now.getDate() + 2);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time && list[i].status==statusId)
                            filterList.push(list[i])
                    }
                    break;
                case '3':
                    //一周内
                    selectedDate.setDate(now.getDate() + 7);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)

                        var start_time = getNowFormatDate(now)
                        var end_time = getNowFormatDate(selectedDate)

                        if (activity_time >= start_time && activity_time <= end_time && list[i].status==statusId)
                            filterList.push(list[i])
                    }
                    break;
            }
        }
        //对场馆日期状态筛选
        if(venueId!=-1 && dateId!=-1 && statusId!=-1)
        {
            var now   = new Date();
            var selectedDate = new Date();

            switch (dateId) {
                case '0':
                    //今天
                    selectedDate.setDate(now.getDate());

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time && list[i].status==statusId && list[i].unitId==venueId)
                            filterList.push(list[i])
                    }
                    break;
                case '1':
                    //明天
                    selectedDate.setDate(now.getDate() + 1);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time && list[i].status==statusId && list[i].unitId==venueId)
                            filterList.push(list[i])
                    }
                    break;
                case '2':
                    //后天
                    selectedDate.setDate(now.getDate() + 2);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)
                        var selected_time = getNowFormatDate(selectedDate)

                        if (activity_time == selected_time && list[i].status==statusId && list[i].unitId==venueId)
                            filterList.push(list[i])
                    }
                    break;
                case '3':
                    //一周内
                    selectedDate.setDate(now.getDate() + 7);

                    for (i = 0; i < list.length; i++) {
                        var activity_time = list[i].timeStart.substring(0, 10)

                        var start_time = getNowFormatDate(now)
                        var end_time = getNowFormatDate(selectedDate)

                        if (activity_time >= start_time && activity_time <= end_time && list[i].status==statusId && list[i].unitId==venueId)
                            filterList.push(list[i])
                    }
                    break;
            }
        }

        return filterList;
    },

}

//时间格式YYYY-MM-DD
function getNowFormatDate(date) {
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var formatdate = year + seperator1 + month + seperator1 + strDate;
    return formatdate;
}

module.exports=activityAssortFilter;