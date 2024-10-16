let objControlChartDaily = {
    selected: {
        RxNo_Part: '',
        RxNo_Machine: '',
        RxNo_Line: '',
        RxNo_PartInsp: '',
        Filter:'*',
        itemIdx: 0
    },
    listSelected: {
        part: [],
        machine: [],
        line: [],
        partInsp: []
    },
    data: {
        header: {},
        chart: {}
    },


}
async function startChartDaily() {
    let today = new Date()
    $("#dtpDailyPerformance_Date").datetimepicker({

        timepicker: false,
        datepicker: true,
        format: 'Y-m-d',
        value: `${today.getFullYear().toString()}-${(today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}-01`,
        // value: today.toISOString().slice(0, 10),
        week: true
    });
    
    document.getElementById('tab-menu-chart-daily').click()
    

    await chartDailySelectLine()
    await chartDailySelectMachine()
    await chartDailySelectPart()
    await chartDailySelectPartInsp()

    await controlChartDailyApi()
}

async function chartDailySelectPart() {
    $('#selDailyPerformance_Part').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_part_list_in_chart, 'GET', objControlChartDaily.selected, (dataRes) => {
        objControlChartDaily.listSelected.part = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Part --</option>`
        let innerHTML = ``
        dataRes.forEach(part => {
            innerHTML += `<option value="${part.RxNo}">${part.PartNo}</option>`
        });
        document.getElementById('selDailyPerformance_Part').innerHTML = innerHTML
        $('#selDailyPerformance_Part').selectize({ normalize: true });
        // manage_dselect(document.getElementById('selDailyPerformance_Part'))
        document.getElementById('selDailyPerformance_Part').value = dataRes[0].RxNo
        objControlChartDaily.selected.RxNo_Part = dataRes[0].RxNo
    })

}
async function chartDailySelectLine() {
    $('#selDailyPerformance_Line').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_line_list_in_chart, 'GET', {}, (dataRes) => {
        objControlChartDaily.listSelected.line = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Line --</option>`
        let innerHTML = ``
        dataRes.forEach(line => {
            innerHTML += `<option value="${line.RxNo}">${line.LineName}</option>`
        });
        document.getElementById('selDailyPerformance_Line').innerHTML = innerHTML
        $('#selDailyPerformance_Line').selectize({ normalize: true });
        document.getElementById('selDailyPerformance_Line').value = dataRes[0].RxNo
        objControlChartDaily.selected.RxNo_Line = dataRes[0].RxNo
    })
}
async function chartDailySelectMachine() {
    $('#selDailyPerformance_Machine').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_machine_list_in_chart, 'GET', objControlChartDaily.selected, (dataRes) => {

        objControlChartDaily.listSelected.machine = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Machine --</option>`
        let innerHTML = ``
        dataRes.forEach(machine => {
            innerHTML += `<option value="${machine.RxNo}">[${machine.MachineNo}] ${machine.MachineName}</option>`
        });
        document.getElementById('selDailyPerformance_Machine').innerHTML = innerHTML
        $('#selDailyPerformance_Machine').selectize({ normalize: true });
        if (dataRes.length > 0) {

            document.getElementById('selDailyPerformance_Machine').value = dataRes[0].RxNo
            objControlChartDaily.selected.RxNo_Machine = dataRes[0].RxNo
        } else {
            document.getElementById('selDailyPerformance_Machine').value = ''
            objControlChartDaily.selected.RxNo_Machine = ''
        }

    })
}
async function chartDailySelectPartInsp() {
    $('#selDailyPerformance_PartInsp').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_part_insp_list_in_chart, 'GET', objControlChartDaily.selected, (dataRes) => {

        objControlChartDaily.listSelected.partInsp = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Item --</option>`
        let innerHTML = ``
        dataRes.forEach(partInsp => {
            innerHTML += `<option value="${partInsp.RxNo}">[${partInsp.ItemNo}] ${partInsp.CheckingItem}</option>`
        });
        document.getElementById('selDailyPerformance_PartInsp').innerHTML = innerHTML
        $('#selDailyPerformance_PartInsp').selectize({ normalize: true });

        if (dataRes.length > 0) {

            document.getElementById('selDailyPerformance_PartInsp').value = dataRes[0].RxNo
            objControlChartDaily.selected.RxNo_PartInsp = dataRes[0].RxNo
        } else {
            document.getElementById('selDailyPerformance_PartInsp').value = ''
            objControlChartDaily.selected.RxNo_PartInsp = ''
        }
    })
}
function updateControlChartDaily() {
    return new Promise((resolve, reject) => {
        try {
            // console.log('objControlChartDaily : ',objControlChartDaily)
            ControlChartDaily.data.labels = objControlChartDaily.data.chart.control_chart_labels
            let idxChartResult = 0
            let idxChartUSL = 1
            let idxChartLSL = 2
            let idxChartTarget = 3
            let idxChartUCL = 4
            let idxChartLCL = 5
            let idxChartMean = 6
            if (objControlChartDaily.selected.Filter === '*'){

                ControlChartDaily.data.datasets[idxChartResult].data = objControlChartDaily.data.chart.control_chart_data_all
            }
            else if (objControlChartDaily.selected.Filter === 'OK'){

                ControlChartDaily.data.datasets[idxChartResult].data = objControlChartDaily.data.chart.control_chart_data_ok
            }
            else if (objControlChartDaily.selected.Filter === 'NG'){

                ControlChartDaily.data.datasets[idxChartResult].data = objControlChartDaily.data.chart.control_chart_data_ng
            }
            // ControlChartDaily.data.datasets[idxChartResult].backgroundColor =  objControlChartDaily.data.chart.control_chart_data_style.background_color
            // ControlChartDaily.data.datasets[idxChartResult].borderColor =  objControlChartDaily.data.chart.control_chart_data_style.border_color
            ControlChartDaily.data.datasets[idxChartResult].pointBackgroundColor =  objControlChartDaily.data.chart.control_chart_data_style.background_color  
            ControlChartDaily.data.datasets[idxChartResult].pointBorderColor =  objControlChartDaily.data.chart.control_chart_data_style.border_color


            ControlChartDaily.data.datasets[idxChartUSL].data = objControlChartDaily.data.chart.control_chart_usl
            ControlChartDaily.data.datasets[idxChartLSL].data = objControlChartDaily.data.chart.control_chart_lsl
            ControlChartDaily.data.datasets[idxChartTarget].data = objControlChartDaily.data.chart.control_chart_target
            ControlChartDaily.data.datasets[idxChartUCL].data = objControlChartDaily.data.chart.control_chart_ucl
            ControlChartDaily.data.datasets[idxChartLCL].data = objControlChartDaily.data.chart.control_chart_lcl
            ControlChartDaily.data.datasets[idxChartMean].data = objControlChartDaily.data.chart.control_chart_mean
            ControlChartDaily.options.scales.yAxes[0].ticks.suggestedMin = objControlChartDaily.data.chart.yAxesMax_control_chart
            ControlChartDaily.options.scales.yAxes[0].ticks.suggestedMax = objControlChartDaily.data.chart.yAxesMin_control_chart



            ControlChartDaily.update();
            ControlChartDaily.resize()
            resolve('')
        } catch (error) {
            reject(error)
        }


    })
}
async function controlChartDailyApi() {
    document.getElementById('ldsControlChartDaily').classList.remove('d-none')
    objControlChartDaily.selected.itemIdx = objControlChartDaily.listSelected.partInsp.findIndex(o => o.RxNo === objControlChartDaily.selected.RxNo_PartInsp);
    document.getElementById('lblControlChartDaily_ItemCount').innerHTML = `${objControlChartDaily.selected.itemIdx + 1}/${objControlChartDaily.listSelected.partInsp.length}`
    dtpDailyPerformance_Date_old = document.getElementById('dtpDailyPerformance_Date').value
    // dtpChartView_DateTo_old = document.getElementById('dtpChartView_DateTo').value
    await reqAndRes(url_control_chart_data_daily, 'GET', {
        RxNo_PartInsp: objControlChartDaily.selected.RxNo_PartInsp,
        RxNo_Line: objControlChartDaily.selected.RxNo_Line,
        DateFrom: document.getElementById('dtpDailyPerformance_Date').value,
        // DateTo: document.getElementById('dtpChartView_DateTo').value,
    }, async (dataRes) => {
        // console.log('chart : ',dataRes)
        objControlChartDaily.data = dataRes
        // console.log(objControlChartDaily)

        document.getElementById('controlChartHeaderDaily_Spec').innerHTML = dataRes.header.Spec
        document.getElementById('controlChartHeaderDaily_Target').innerHTML = dataRes.header.Target
        document.getElementById('controlChartHeaderDaily_UCL').innerHTML = dataRes.header.UCL
        document.getElementById('controlChartHeaderDaily_LCL').innerHTML = dataRes.header.LCL
        document.getElementById('controlChartHeaderDaily_USL').innerHTML = dataRes.header.USL
        document.getElementById('controlChartHeaderDaily_LSL').innerHTML = dataRes.header.LSL
        document.getElementById('controlChartHeaderDaily_Mean').innerHTML = dataRes.header.mean

        // if(objControlChartDaily.data.chart.control_chart_data.length > 400){
            let gap = 20
        if (objControlChartDaily.data.chart.control_chart_data_all.length * gap > window.innerWidth) {
            document.getElementById('containerControlChartDaily').style.width = `${objControlChartDaily.data.chart.control_chart_data_all.length * gap}px`
            // root_css.style.setProperty('--w-containner-chart', `${objControlChartDaily.data.chart.control_chart_data.length * 6}px`);
        }
        else {
            // root_css.style.setProperty('--w-containner-chart', `auto`);
            document.getElementById('containerControlChartDaily').style.width = `auto`
        }
        await updateControlChartDaily()
        setTimeout(() => {
            ControlChartDaily.resize()
        }, 500);


    })
    document.getElementById('ldsControlChartDaily').classList.add('d-none')
}

document.getElementById('selDailyPerformance_PartInsp').onchange = async function () {
    objControlChartDaily.selected.RxNo_PartInsp = document.getElementById('selDailyPerformance_PartInsp').value
    await controlChartDailyApi()
}


async function controlChartDaily_FirstItem() {
    if (objControlChartDaily.listSelected.partInsp.length > 0 && objControlChartDaily.selected.itemIdx !== 0) {
        // document.getElementById('selDailyPerformance_PartInsp').value = objControlChartDaily.listSelected.partInsp[0].RxNo
        objControlChartDaily.selected.RxNo_PartInsp = objControlChartDaily.listSelected.partInsp[0].RxNo
        setValueSelectize('selDailyPerformance_PartInsp',objControlChartDaily.listSelected.partInsp[0].RxNo)
        // objControlChartDaily.selected.itemIdx = 0
        // await controlChartDailyApi()
    }
}
async function controlChartDaily_PreviousItem() {
    if (objControlChartDaily.listSelected.partInsp.length > 0 && objControlChartDaily.selected.itemIdx !== 0) {
        // document.getElementById('selDailyPerformance_PartInsp').value = objControlChartDaily.listSelected.partInsp[objControlChartDaily.selected.itemIdx - 1].RxNo
        objControlChartDaily.selected.RxNo_PartInsp = objControlChartDaily.listSelected.partInsp[objControlChartDaily.selected.itemIdx - 1].RxNo
        setValueSelectize('selDailyPerformance_PartInsp',objControlChartDaily.listSelected.partInsp[objControlChartDaily.selected.itemIdx - 1].RxNo)
        // objControlChartDaily.selected.itemIdx -= 1
        // await controlChartDailyApi()
    }
}
async function controlChartDaily_NextItem() {
    if (objControlChartDaily.listSelected.partInsp.length > 0 && objControlChartDaily.selected.itemIdx !== objControlChartDaily.listSelected.partInsp.length - 1) {
        // document.getElementById('selDailyPerformance_PartInsp').value = objControlChartDaily.listSelected.partInsp[objControlChartDaily.selected.itemIdx + 1].RxNo
        objControlChartDaily.selected.RxNo_PartInsp = objControlChartDaily.listSelected.partInsp[objControlChartDaily.selected.itemIdx + 1].RxNo
        setValueSelectize('selDailyPerformance_PartInsp',objControlChartDaily.listSelected.partInsp[objControlChartDaily.selected.itemIdx + 1].RxNo)
        // let $select = $("#selDailyPerformance_PartInsp").selectize();
        // let selectize = $select[0].selectize;
        // selectize.setValue(objControlChartDaily.listSelected.partInsp[objControlChartDaily.selected.itemIdx + 1].RxNo);
        // objControlChartDaily.selected.itemIdx += 1
        // await controlChartDailyApi()
    }
}
async function controlChartDaily_LastItem() {
    if (objControlChartDaily.listSelected.partInsp.length > 0 && objControlChartDaily.selected.itemIdx !== objControlChartDaily.listSelected.partInsp.length - 1) {
        // document.getElementById('selDailyPerformance_PartInsp').value = objControlChartDaily.listSelected.partInsp[objControlChartDaily.listSelected.partInsp.length - 1].RxNo
        objControlChartDaily.selected.RxNo_PartInsp = objControlChartDaily.listSelected.partInsp[objControlChartDaily.listSelected.partInsp.length - 1].RxNo
        setValueSelectize('selDailyPerformance_PartInsp',objControlChartDaily.listSelected.partInsp[objControlChartDaily.listSelected.partInsp.length - 1].RxNo)
        // objControlChartDaily.selected.itemIdx = objControlChartDaily.listSelected.partInsp.length - 1
        // await controlChartDailyApi()
    }
}
document.getElementById('btncontrolChartDaily_FirstItem').onclick = function () {
    controlChartDaily_FirstItem()
}
document.getElementById('btnControlChartDaily_PreviousItem').onclick = function () {
    controlChartDaily_PreviousItem()
}
document.getElementById('btnControlChartDaily_NextItem').onclick = function () {
    controlChartDaily_NextItem()
}
document.getElementById('btnControlChartDaily_LastItem').onclick = function () {
    controlChartDaily_LastItem()
}
document.getElementById('btnControlChartDaily_RefreshItem').onclick = async function () {
    await controlChartDailyApi()
}

let ControlChartDaily = new Chart(ctx = document.getElementById('ControlChartDaily').getContext('2d'), {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: "",
        datasets: [
            //--------------------------------------- เส้น Data --------------------------------------------
            {
                label: 'Inspec Result',
                fill: false, //ไม่แสดงพื้นที่ใต้กราฟ
                lineTension: 0, //กำหนัดความโค้งของเส้นตั่งแต่ 0-1


                data: "",
                pointBackgroundColor: '#0000FF',
                pointBorderColor: '#0000FF',
                pointBorderWidth: 1.5, // ขนาดของขอบจุด
                pointRadius: 3, // ขนาดของจุด
                pointHoverRadius: 4.5, // ขนาดของจุด เมื่อนำเมาส์ไปชี้
                pointHoverBorderColor: '#B7DBF9',
                backgroundColor: '#0000FF',
                borderColor: '#0000FF',
                borderWidth: 1.5
            },
            //--------------------------------------- เส้น USL --------------------------------------------
            {
                label: 'USL',
                fill: false, //ไม่แสดงพื้นที่ใต้กราฟ
                lineTension: 0, //กำหนัดความโค้งของเส้นตั่งแต่ 0-1
                pointRadius: 0,//ไม่แสดงจุดบอกตำแหน่งบนกราฟ

                data: "",
                backgroundColor: '#FF0000',
                borderColor: '#FF0000',
                borderWidth: 1.5
            },
            //--------------------------------------- เส้น LSL --------------------------------------------
            {
                label: 'LSL',
                fill: false, //ไม่แสดงพื้นที่ใต้กราฟ
                lineTension: 0, //กำหนัดความโค้งของเส้นตั่งแต่ 0-1
                pointRadius: 0,//ไม่แสดงจุดบอกตำแหน่งบนกราฟ

                data: "",
                backgroundColor: '#FF0000',
                borderColor: '#FF0000',
                borderWidth: 1.5
            },

            {
                label: 'Target',
                fill: false, //ไม่แสดงพื้นที่ใต้กราฟ
                lineTension: 0, //กำหนัดความโค้งของเส้นตั่งแต่ 0-1
                pointRadius: 0,//ไม่แสดงจุดบอกตำแหน่งบนกราฟ

                data: "",
                backgroundColor: '#33CC33',
                borderColor: '#33CC33',
                borderWidth: 1
            },


            {
                label: 'UCL',
                fill: false, //ไม่แสดงพื้นที่ใต้กราฟ
                lineTension: 0, //กำหนัดความโค้งของเส้นตั่งแต่ 0-1
                pointRadius: 0,//ไม่แสดงจุดบอกตำแหน่งบนกราฟ

                borderDash: [10, 5], //เส้นประ
                data: "",
                backgroundColor: '#FF0000',
                borderColor: '#FF0000',
                borderWidth: 1.5
            },
            //--------------------------------------- เส้น LSL --------------------------------------------
            {
                label: 'LCL',
                fill: false, //ไม่แสดงพื้นที่ใต้กราฟ
                lineTension: 0, //กำหนัดความโค้งของเส้นตั่งแต่ 0-1
                pointRadius: 0,//ไม่แสดงจุดบอกตำแหน่งบนกราฟ

                borderDash: [10, 5], //เส้นประ
                data: "",
                backgroundColor: '#FF0000',
                borderColor: '#FF0000',
                borderWidth: 1.5
            },
            {
                label: 'X̅',
                // showLine: true,
                fill: false, //ไม่แสดงพื้นที่ใต้กราฟ
                lineTension: 0, //กำหนัดความโค้งของเส้นตั่งแต่ 0-1
                pointRadius: 0,//ไม่แสดงจุดบอกตำแหน่งบนกราฟ

                data: "",
                backgroundColor: '#33CC33',
                borderColor: '#33CC33',
                borderWidth: 1.5
            },


        ]
    },

    // Configuration options go here
    options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 1000,
        spanGaps: true, //วาดเว้นกราฟต่อเนื่อง
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false,
                    suggestedMin: 0,
                    suggestedMax: 5,
                }
            }]
        },
    }
});

function menageDateControlChart(dateSelected) {
    let dateFrom = new Date(document.getElementById('dtpDailyPerformance_Date').value)
    let dateTo = new Date(document.getElementById('dtpChartView_DateTo').value)
    if (dateSelected === 'DateFrom') {
        // month 0 = january
        if (dateFrom > dateTo || dateFrom.getMonth() != dateTo.getMonth()) {
            let lastday = new Date(dateFrom.getFullYear(), dateFrom.getMonth() + 1, 0)
            let year = lastday.getFullYear().toString()
            let month = (lastday.getMonth() + 1) < 10 ? `0${lastday.getMonth() + 1}` : lastday.getMonth() + 1
            let day = lastday.getDate() < 10 ? `0${lastday.getDate()}` : lastday.getDate()
            $("#dtpChartView_DateTo").datetimepicker({
                value: `${year}-${month}-${day}`,

            });

        }
    } else if (dateSelected === 'DateTo') {
        if (dateFrom > dateTo || dateFrom.getMonth() != dateTo.getMonth()) {

            let year = dateTo.getFullYear().toString()
            let month = (dateTo.getMonth() + 1) < 10 ? `0${dateTo.getMonth() + 1}` : dateTo.getMonth() + 1
            let day = '01'
            $("#dtpDailyPerformance_Date").datetimepicker({
                value: `${year}-${month}-${day}`,

            });

        }

    }
}

document.getElementById('selDailyPerformance_Part').onchange = async function () {
    objControlChartDaily.selected.RxNo_Part = document.getElementById('selDailyPerformance_Part').value
    await chartDailySelectPartInsp()
    await controlChartDailyApi()
}
document.getElementById('selDailyPerformance_Line').onchange = async function () {
    objControlChartDaily.selected.RxNo_Line = document.getElementById('selDailyPerformance_Line').value
    await chartDailySelectMachine()
    await chartDailySelectPart()
    await chartDailySelectPartInsp()
    await controlChartDailyApi()
}
document.getElementById('selDailyPerformance_Machine').onchange = async function () {
    objControlChartDaily.selected.RxNo_Machine = document.getElementById('selDailyPerformance_Machine').value
    await chartDailySelectPart()
    await chartDailySelectPartInsp()
    await controlChartDailyApi()
}
document.getElementById('selDailyPerformance_PartInsp').onchange = async function () {
    objControlChartDaily.selected.RxNo_PartInsp = document.getElementById('selDailyPerformance_PartInsp').value
    await controlChartDailyApi()
}
let dtpDailyPerformance_Date_old = ''
document.getElementById('dtpDailyPerformance_Date').onchange = async function () {
    if (document.getElementById('dtpDailyPerformance_Date').value !== dtpDailyPerformance_Date_old) {
        // menageDateControlChart('DateFrom')
        await controlChartDailyApi()
    }
}
// let dtpChartView_DateTo = ''
// document.getElementById('dtpChartView_DateTo').onchange = async function () {
//     if (document.getElementById('dtpChartView_DateTo').value !== dtpChartView_DateTo_old) {
//         menageDateControlChart('DateTo')
//         await controlChartDailyApi()
//     }
// }

async function filterControlChartDataDaily(){
    let elRadios = document.querySelectorAll(`#pnlSpecDailyPerformance * input[type="radio"]`)
    for (const rad of elRadios){
        if (rad.checked) {
            objControlChartDaily.selected.Filter = rad.value
            break;
          }
    }  
    // console.log(`objControlChartDaily.selected : `,objControlChartDaily.selected)
    await updateControlChartDaily()
    setTimeout(() => {
        ControlChartDaily.resize()
    }, 500);
}


document.getElementById("ControlChartDaily").onclick = function (evt) {
    try {
        var activePoints = ControlChartDaily.getElementAtEvent(event);

        // make sure click was on an actual point
        let idxChartResult = 0
        if (activePoints[idxChartResult]._datasetIndex == 0) {
            // Active เฉพาะเส้น X

            if (activePoints.length > 0) {
                // console.log(`activePoints[idxChartResult]._index : `,activePoints[idxChartResult]._index)
                let index = activePoints[idxChartResult]._index
                let RxNo_InspItem = objControlChartDaily.data.data_set[index].RxNo_InspItem
                let row = objControlChartDaily.data.data_set[index]
                if(row.AbnormalMode !== 0){
                    
                    abnormalDetailApi(RxNo_InspItem).then((result) => {
                        // console.log('result',result)
                        objAbnormal.RxNo_InspItem = result.RxNo_InspItem
                        objAbnormal.RxNo_InspHeader = result.RxNo_InspHeader
                        objAbnormal.RxNo_ProblemAction = result.RxNo_ProblemAction
                        objAbnormal.itemName = result.CheckingItem
                        objAbnormal.inspResult = result.InspValType === 'VAL'?result.InspVal:InspVal.InspStr
                        objAbnormal.mode = result.AbnormalMode===''?row.AbnormalMode:result.AbnormalMode
                        objAbnormal.desription = result.AbnormalDesription===''?row.Adjudge:result.AbnormalDesription
                        objAbnormal.problem.detail = result.ProblemDetail
                        objAbnormal.problem.by = result.ProblemBy
                        objAbnormal.problem.timeStamp = result.ProblemTimeStamp
                        objAbnormal.action.detail = result.ActionDetail
                        objAbnormal.action.by = result.ActionBy
                        objAbnormal.action.timeStamp = result.ActionTimeStamp
                        clearAbnormal()
                        showDataAbnomal()
                        showModalAbnormal()
                    })
                    .catch((err) => {
                        console.error(err)
                    })
                }
                
                // objXRChart.activePointindex = activePoints[0]._index;
                // let insp_item = objXRChart.allData.insp_item_dataset[objXRChart.activePointindex]
                // insp_item.labelTitle = 'Process Capability Chart'
                // insp_item.doc = "xrc";
                // processrefreshAbnormalXRChart(true);
                // dialogProblemModal(insp_item);
            }
        }
    }
    catch (err) {
        // console.log(err)
    }
};


startChartDaily()

