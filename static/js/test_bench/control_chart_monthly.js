let objControlChartMonthly = {
    selected: {
        RxNo_Part: '',
        RxNo_Machine: '',
        RxNo_Line: '',
        RxNo_PartInsp: '',
        itemIdx: 0,
        Filter:'*',
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
async function startChartMonthly() {
    let today = new Date()
    document.getElementById('selMonthlyPerformance_Month').value = `${today.getFullYear().toString()}-${(today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}`,
    // $("#selMonthlyPerformance_Month").datetimepicker({

    //     timepicker: false,
    //     datepicker: true,
    //     format: 'Y-m-d',
    //     value: `${today.getFullYear().toString()}-${(today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}-01`,
    //     // value: today.toISOString().slice(0, 10),
    //     week: true
    // });
   
    // document.getElementById('tab-menu-table-date').click()


    await chartMonthlySelectLine()
    await chartMonthlySelectMachine()
    await chartMonthlySelectPart()
    await chartMonthlySelectPartInsp()

    await controlChartMonthlyData()
}

async function chartMonthlySelectPart() {
    $('#selMonthlyPerformance_Part').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_part_list_in_chart, 'GET', objControlChartMonthly.selected, (dataRes) => {
        objControlChartMonthly.listSelected.part = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Part --</option>`
        let innerHTML = ``
        dataRes.forEach(part => {
            innerHTML += `<option value="${part.RxNo}">${part.PartNo}</option>`
        });
        document.getElementById('selMonthlyPerformance_Part').innerHTML = innerHTML
        $('#selMonthlyPerformance_Part').selectize({ normalize: true });
        // manage_dselect(document.getElementById('selMonthlyPerformance_Part'))
        document.getElementById('selMonthlyPerformance_Part').value = dataRes[0].RxNo
        objControlChartMonthly.selected.RxNo_Part = dataRes[0].RxNo
    })

}
async function chartMonthlySelectLine() {
    $('#selMonthlyPerformance_Line').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_line_list_in_chart, 'GET', {}, (dataRes) => {
        objControlChartMonthly.listSelected.line = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Line --</option>`
        let innerHTML = ``
        dataRes.forEach(line => {
            innerHTML += `<option value="${line.RxNo}">${line.LineName}</option>`
        });
        document.getElementById('selMonthlyPerformance_Line').innerHTML = innerHTML
        $('#selMonthlyPerformance_Line').selectize({ normalize: true });
        document.getElementById('selMonthlyPerformance_Line').value = dataRes[0].RxNo
        objControlChartMonthly.selected.RxNo_Line = dataRes[0].RxNo
    })
}
async function chartMonthlySelectMachine() {
    $('#selMonthlyPerformance_Machine').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_machine_list_in_chart, 'GET', objControlChartMonthly.selected, (dataRes) => {

        objControlChartMonthly.listSelected.machine = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Machine --</option>`
        let innerHTML = ``
        dataRes.forEach(machine => {
            innerHTML += `<option value="${machine.RxNo}">[${machine.MachineNo}] ${machine.MachineName}</option>`
        });
        document.getElementById('selMonthlyPerformance_Machine').innerHTML = innerHTML
        $('#selMonthlyPerformance_Machine').selectize({ normalize: true });
        if (dataRes.length > 0) {

            document.getElementById('selMonthlyPerformance_Machine').value = dataRes[0].RxNo
            objControlChartMonthly.selected.RxNo_Machine = dataRes[0].RxNo
        } else {
            document.getElementById('selMonthlyPerformance_Machine').value = ''
            objControlChartMonthly.selected.RxNo_Machine = ''
        }

    })
}
async function chartMonthlySelectPartInsp() {
    $('#selMonthlyPerformance_PartInsp').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_part_insp_list_in_chart, 'GET', objControlChartMonthly.selected, (dataRes) => {

        objControlChartMonthly.listSelected.partInsp = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Item --</option>`
        let innerHTML = ``
        dataRes.forEach(partInsp => {
            innerHTML += `<option value="${partInsp.RxNo}">[${partInsp.ItemNo}] ${partInsp.CheckingItem}</option>`
        });
        document.getElementById('selMonthlyPerformance_PartInsp').innerHTML = innerHTML
        $('#selMonthlyPerformance_PartInsp').selectize({ normalize: true });

        if (dataRes.length > 0) {

            document.getElementById('selMonthlyPerformance_PartInsp').value = dataRes[0].RxNo
            objControlChartMonthly.selected.RxNo_PartInsp = dataRes[0].RxNo
        } else {
            document.getElementById('selMonthlyPerformance_PartInsp').value = ''
            objControlChartMonthly.selected.RxNo_PartInsp = ''
        }
    })
}
function updateMixChart() {
    return new Promise((resolve, reject) => {
        try {

            ControlChartMonthly.data.labels = objControlChartMonthly.data.chart.control_chart_head_labels

            let idxChartUSL = 0
            let idxChartLSL = 1
            let idxChartTarget = 2
            let idxChartUCL = 3
            let idxChartLCL = 4
            let idxChartMean = 5
            let idxBarChartResult = 6
            ControlChartMonthly.data.datasets[idxBarChartResult].data = objControlChartMonthly.data.chart.control_chart_bar_data
            ControlChartMonthly.data.datasets[idxChartUSL].data = objControlChartMonthly.data.chart.control_chart_usl
            ControlChartMonthly.data.datasets[idxChartLSL].data = objControlChartMonthly.data.chart.control_chart_lsl
            ControlChartMonthly.data.datasets[idxChartTarget].data = objControlChartMonthly.data.chart.control_chart_target
            ControlChartMonthly.data.datasets[idxChartUCL].data = objControlChartMonthly.data.chart.control_chart_ucl
            ControlChartMonthly.data.datasets[idxChartLCL].data = objControlChartMonthly.data.chart.control_chart_lcl
            ControlChartMonthly.data.datasets[idxChartMean].data = objControlChartMonthly.data.chart.control_chart_line_data
            ControlChartMonthly.options.scales.yAxes[0].ticks.suggestedMin = objControlChartMonthly.data.chart.yAxesMax_control_chart
            ControlChartMonthly.options.scales.yAxes[0].ticks.suggestedMax = objControlChartMonthly.data.chart.yAxesMin_control_chart



            ControlChartMonthly.update();
            ControlChartMonthly.resize()
            resolve('')
        } catch (error) {
            reject(error)
        }


    })
}

async function controlChartMonthlyData() {
    
    document.getElementById('ldsControlChartMonthly').classList.remove('d-none')
    objControlChartMonthly.selected.itemIdx = objControlChartMonthly.listSelected.partInsp.findIndex(o => o.RxNo === objControlChartMonthly.selected.RxNo_PartInsp);
    document.getElementById('lblControlChartMonthly_ItemCount').innerHTML = `${objControlChartMonthly.selected.itemIdx + 1}/${objControlChartMonthly.listSelected.partInsp.length}`
    selMonthlyPerformance_Month_old = document.getElementById('selMonthlyPerformance_Month').value
    // dtpChartView_DateTo_old = document.getElementById('dtpChartView_DateTo').value
    await reqAndRes(url_control_chart_data_monthly, 'GET', {
        RxNo_PartInsp: objControlChartMonthly.selected.RxNo_PartInsp,
        RxNo_Line: objControlChartMonthly.selected.RxNo_Line,
        // DateFrom: document.getElementById('selMonthlyPerformance_Month').value,
        DateFrom: document.getElementById('selMonthlyPerformance_Month').value + '-01',
        Filter: objControlChartMonthly.selected.Filter,
    }, async (dataRes) => {
        // console.log('chart : ',dataRes)
        objControlChartMonthly.data = dataRes
        // console.log('objControlChartMonthly : ', objControlChartMonthly)

        document.getElementById('controlChartHeaderMonthly_Spec').innerHTML = dataRes.header.Spec
        document.getElementById('controlChartHeaderMonthly_Target').innerHTML = dataRes.header.Target
        document.getElementById('controlChartHeaderMonthly_UCL').innerHTML = dataRes.header.UCL
        document.getElementById('controlChartHeaderMonthly_LCL').innerHTML = dataRes.header.LCL
        document.getElementById('controlChartHeaderMonthly_USL').innerHTML = dataRes.header.USL
        document.getElementById('controlChartHeaderMonthly_LSL').innerHTML = dataRes.header.LSL


        // // if(objControlChartMonthly.data.chart.control_chart_data.length > 400){
        // if (objControlChartMonthly.data.chart.control_chart_data.length * 6 > window.innerWidth) {
        //     // document.getElementById('containerControlChartMonthly').style.width = `${objControlChartMonthly.data.chart.control_chart_data.length * 6}px`
        //     root_css.style.setProperty('--w-containner-chart', `${objControlChartMonthly.data.chart.control_chart_data.length * 6}px`);
        // }
        // else {
        //     root_css.style.setProperty('--w-containner-chart', `auto`);
        // }
        await updateMixChart()
        setTimeout(() => {
            ControlChartMonthly.resize()
        }, 500);


    })
    document.getElementById('ldsControlChartMonthly').classList.add('d-none')
}

document.getElementById('selMonthlyPerformance_PartInsp').onchange = async function () {
    objControlChartMonthly.selected.RxNo_PartInsp = document.getElementById('selMonthlyPerformance_PartInsp').value
    await controlChartMonthlyData()
}


async function controlChartMonthly_FirstItem() {
    if (objControlChartMonthly.listSelected.partInsp.length > 0 && objControlChartMonthly.selected.itemIdx !== 0) {
        // document.getElementById('selMonthlyPerformance_PartInsp').value = objControlChartMonthly.listSelected.partInsp[0].RxNo
        objControlChartMonthly.selected.RxNo_PartInsp = objControlChartMonthly.listSelected.partInsp[0].RxNo
        setValueSelectize('selMonthlyPerformance_PartInsp', objControlChartMonthly.listSelected.partInsp[0].RxNo)
        // objControlChartMonthly.selected.itemIdx = 0
        // await controlChartMonthlyData()
    }
}
async function controlChartMonthly_PreviousItem() {
    if (objControlChartMonthly.listSelected.partInsp.length > 0 && objControlChartMonthly.selected.itemIdx !== 0) {
        // document.getElementById('selMonthlyPerformance_PartInsp').value = objControlChartMonthly.listSelected.partInsp[objControlChartMonthly.selected.itemIdx - 1].RxNo
        objControlChartMonthly.selected.RxNo_PartInsp = objControlChartMonthly.listSelected.partInsp[objControlChartMonthly.selected.itemIdx - 1].RxNo
        setValueSelectize('selMonthlyPerformance_PartInsp', objControlChartMonthly.listSelected.partInsp[objControlChartMonthly.selected.itemIdx - 1].RxNo)
        // objControlChartMonthly.selected.itemIdx -= 1
        // await controlChartMonthlyData()
    }
}
async function controlChartMonthly_NextItem() {
    if (objControlChartMonthly.listSelected.partInsp.length > 0 && objControlChartMonthly.selected.itemIdx !== objControlChartMonthly.listSelected.partInsp.length - 1) {
        // document.getElementById('selMonthlyPerformance_PartInsp').value = objControlChartMonthly.listSelected.partInsp[objControlChartMonthly.selected.itemIdx + 1].RxNo
        objControlChartMonthly.selected.RxNo_PartInsp = objControlChartMonthly.listSelected.partInsp[objControlChartMonthly.selected.itemIdx + 1].RxNo
        setValueSelectize('selMonthlyPerformance_PartInsp', objControlChartMonthly.listSelected.partInsp[objControlChartMonthly.selected.itemIdx + 1].RxNo)
        // let $select = $("#selMonthlyPerformance_PartInsp").selectize();
        // let selectize = $select[0].selectize;
        // selectize.setValue(objControlChartMonthly.listSelected.partInsp[objControlChartMonthly.selected.itemIdx + 1].RxNo);
        // objControlChartMonthly.selected.itemIdx += 1
        // await controlChartMonthlyData()
    }
}
async function controlChartMonthly_LastItem() {
    if (objControlChartMonthly.listSelected.partInsp.length > 0 && objControlChartMonthly.selected.itemIdx !== objControlChartMonthly.listSelected.partInsp.length - 1) {
        // document.getElementById('selMonthlyPerformance_PartInsp').value = objControlChartMonthly.listSelected.partInsp[objControlChartMonthly.listSelected.partInsp.length - 1].RxNo
        objControlChartMonthly.selected.RxNo_PartInsp = objControlChartMonthly.listSelected.partInsp[objControlChartMonthly.listSelected.partInsp.length - 1].RxNo
        setValueSelectize('selMonthlyPerformance_PartInsp', objControlChartMonthly.listSelected.partInsp[objControlChartMonthly.listSelected.partInsp.length - 1].RxNo)
        // objControlChartMonthly.selected.itemIdx = objControlChartMonthly.listSelected.partInsp.length - 1
        // await controlChartMonthlyData()
    }
}
document.getElementById('btnControlChartMonthly_FirstItem').onclick = function () {
    controlChartMonthly_FirstItem()
}
document.getElementById('btnControlChartMonthly_PreviousItem').onclick = function () {
    controlChartMonthly_PreviousItem()
}
document.getElementById('btnControlChartMonthly_NextItem').onclick = function () {
    controlChartMonthly_NextItem()
}
document.getElementById('btnControlChartMonthly_LastItem').onclick = function () {
    controlChartMonthly_LastItem()
}
document.getElementById('btnControlChartMonthly_RefreshItem').onclick = async function () {
    await controlChartMonthlyData()
}

let ControlChartMonthly = new Chart(ctx = document.getElementById('ControlChartMonthly').getContext('2d'), {
    // The type of chart we want to create
    type: 'bar',
    data: {
        labels: [
            
        ],
        datasets: [
            {
                type: 'line',
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
                type: 'line',
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
                type: 'line',
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
                type: 'line',
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
                type: 'line',
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
                type: 'line',
                label: 'X̅',
                // showLine: true,
                fill: false, //ไม่แสดงพื้นที่ใต้กราฟ
                lineTension: 0, //กำหนัดความโค้งของเส้นตั่งแต่ 0-1

                pointBackgroundColor: '#33CC33',
                pointBorderColor: '#33CC33',
                pointBorderWidth: 0.5, // ขนาดของขอบจุด
                pointRadius: 3.5, // ขนาดของจุด
                pointHoverRadius: 4, // ขนาดของจุด เมื่อนำเมาส์ไปชี้
                pointHoverBorderColor: '#33CC33',
                data: "",
                backgroundColor: '#33CC33',
                borderColor: '#33CC33',
                borderWidth: 2.5
            },
            {
                type: 'bar',
                label: 'Result Min-Max',
                data: [],
                borderColor: 'rgba(0, 0, 255, 1)',
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped:false
            },


        ]
    },
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
        }
    }
});


document.getElementById('selMonthlyPerformance_Part').onchange = async function () {
    objControlChartMonthly.selected.RxNo_Part = document.getElementById('selMonthlyPerformance_Part').value
    await chartMonthlySelectPartInsp()
    await controlChartMonthlyData()
}
document.getElementById('selMonthlyPerformance_Line').onchange = async function () {
    objControlChartMonthly.selected.RxNo_Line = document.getElementById('selMonthlyPerformance_Line').value
    await chartMonthlySelectMachine()
    await chartMonthlySelectPart()
    await chartMonthlySelectPartInsp()
    await controlChartMonthlyData()
}
document.getElementById('selMonthlyPerformance_Machine').onchange = async function () {
    objControlChartMonthly.selected.RxNo_Machine = document.getElementById('selMonthlyPerformance_Machine').value
    await chartMonthlySelectPart()
    await chartMonthlySelectPartInsp()
    await controlChartMonthlyData()
}
document.getElementById('selMonthlyPerformance_PartInsp').onchange = async function () {
    objControlChartMonthly.selected.RxNo_PartInsp = document.getElementById('selMonthlyPerformance_PartInsp').value
    await controlChartMonthlyData()
}
let selMonthlyPerformance_Month_old = ''
document.getElementById('selMonthlyPerformance_Month').onchange = async function () {
    // console.log(document.getElementById('selMonthlyPerformance_Month').value)
    let value = document.getElementById('selMonthlyPerformance_Month').value
    if(value !== '' && value[4] === '-'){
        if (document.getElementById('selMonthlyPerformance_Month').value !== selMonthlyPerformance_Month_old) {
            // menageDateControlChart('DateFrom')
            await controlChartMonthlyData()
        }
    }
    else{
        let today = new Date()
        document.getElementById('selMonthlyPerformance_Month').value = `${today.getFullYear().toString()}-${(today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}`
        await controlChartMonthlyData()
    }
   
    
}
async function filterControlChartDataMonthly(){
    let elRadios = document.querySelectorAll(`#pnlSpecMonthlyPerformance * input[type="radio"]`)
    for (const rad of elRadios){
        if (rad.checked) {
            objControlChartMonthly.selected.Filter = rad.value
            break;
          }
    }  
    // console.log(`objControlChartDaily.selected : `,objControlChartDaily.selected)
    await controlChartMonthlyData()
    setTimeout(() => {
        ControlChartMonthly.resize()
    }, 500);
}

startChartMonthly()

