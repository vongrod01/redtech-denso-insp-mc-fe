let objDataBrowsingDate = {
    selected: {
        RxNo_Part: '',
        RxNo_Machine: '',
        RxNo_Line: '',
        RxNo_PartInsp: '',
        Filter:'',
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
        dataSet: [],
        dataCount:{}
    },


}

let dtpTableDate_DateFrom_old = ''
let dtpTableDate_DateTo = ''

async function startTableDate() {
    let today = new Date()
    let todayStr = `${today.getFullYear().toString()}-${(today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}-${today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()}`
    $("#dtpTableDate_DateFrom").datetimepicker({

        timepicker: false,
        datepicker: true,
        format: 'Y-m-d',
        // value: `${today.getFullYear().toString()}-${(today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}-01`,
        value: todayStr,
        // value: today.toISOString().slice(0, 10),
        week: true
    });

    $("#dtpTableDate_DateTo").datetimepicker({

        timepicker: false,
        datepicker: true,
        format: 'Y-m-d',
        // value: `${today.getFullYear().toString()}-${(today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}-${today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()}`,
        value: todayStr,
        // value: today.toISOString().slice(0, 10),
        week: true
    });

    dtpTableDate_DateFrom_old = document.getElementById('dtpTableDate_DateFrom').value
    dtpTableDate_DateTo_old = document.getElementById('dtpTableDate_DateTo').value


    await tableDateSelectLine()
    await tableDateSelectMachine()
    await tableDateSelectPart()
    await tableDateSelectPartInsp()

    // await dataBrowsingByDate()
    
}

async function tableDateSelectPart() {
    $('#selTableDate_Part').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_part_list_in_data_browsing, 'GET', objDataBrowsingDate.selected, (dataRes) => {
        objDataBrowsingDate.listSelected.part = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Part --</option>`
        let innerHTML = ``
        dataRes.forEach(part => {
            innerHTML += `<option value="${part.RxNo}">${part.PartNo}</option>`
        });
        document.getElementById('selTableDate_Part').innerHTML = innerHTML
        $('#selTableDate_Part').selectize({ normalize: true });
        // manage_dselect(document.getElementById('selTableDate_Part'))
        document.getElementById('selTableDate_Part').value = dataRes[0].RxNo
        objDataBrowsingDate.selected.RxNo_Part = dataRes[0].RxNo
    })

}
async function tableDateSelectLine() {
    $('#selTableDate_Line').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_line_list_in_data_browsing, 'GET', {}, (dataRes) => {
        objDataBrowsingDate.listSelected.line = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Line --</option>`
        let innerHTML = ``
        dataRes.forEach(line => {
            innerHTML += `<option value="${line.RxNo}">${line.LineName}</option>`
        });
        document.getElementById('selTableDate_Line').innerHTML = innerHTML
        $('#selTableDate_Line').selectize({ normalize: true });
        document.getElementById('selTableDate_Line').value = dataRes[0].RxNo
        objDataBrowsingDate.selected.RxNo_Line = dataRes[0].RxNo
    })
}
async function tableDateSelectMachine() {
    $('#selTableDate_Machine').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_machine_list_in_data_browsing, 'GET', objDataBrowsingDate.selected, (dataRes) => {

        objDataBrowsingDate.listSelected.machine = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Machine --</option>`
        let innerHTML = ``
        dataRes.forEach(machine => {
            innerHTML += `<option value="${machine.RxNo}">[${machine.MachineNo}] ${machine.MachineName}</option>`
        });
        document.getElementById('selTableDate_Machine').innerHTML = innerHTML
        $('#selTableDate_Machine').selectize({ normalize: true });
        if (dataRes.length > 0) {

            document.getElementById('selTableDate_Machine').value = dataRes[0].RxNo
            objDataBrowsingDate.selected.RxNo_Machine = dataRes[0].RxNo
        } else {
            document.getElementById('selTableDate_Machine').value = ''
            objDataBrowsingDate.selected.RxNo_Machine = ''
        }

    })
}
async function tableDateSelectPartInsp() {
    $('#selTableDate_PartInsp').each(function () {
        if (this.selectize) {
            this.selectize.destroy();
        }
    });
    await reqAndRes(url_part_insp_list_in_data_browsing, 'GET', objDataBrowsingDate.selected, (dataRes) => {

        objDataBrowsingDate.listSelected.partInsp = dataRes
        // let innerHTML = `<option value="" class="text-center" disabled selected>-- Select Item --</option>`
        let innerHTML = ``
        dataRes.forEach(partInsp => {
            innerHTML += `<option value="${partInsp.RxNo}">[${partInsp.ItemNo}] ${partInsp.CheckingItem}</option>`
        });
        document.getElementById('selTableDate_PartInsp').innerHTML = innerHTML
        $('#selTableDate_PartInsp').selectize({ normalize: true });

        if (dataRes.length > 0) {

            document.getElementById('selTableDate_PartInsp').value = dataRes[0].RxNo
            objDataBrowsingDate.selected.RxNo_PartInsp = dataRes[0].RxNo
        } else {
            document.getElementById('selTableDate_PartInsp').value = ''
            objDataBrowsingDate.selected.RxNo_PartInsp = ''
        }
    })
}

async function dataBrowsingByDate() {


    return new Promise(async (resolve, reject) => {
        try {
            document.getElementById('ldsSearchDataBrowsingDate').classList.remove('d-none')
            dtpTableDate_DateFrom_old = document.getElementById('dtpTableDate_DateFrom').value
            dtpTableDate_DateTo_old = document.getElementById('dtpTableDate_DateTo').value
            let tbody = document.getElementById('tbDataBrowsingDate_body')
            tbody.innerHTML = ''
            $("#tbDataBrowsingDate").DataTable().destroy()
            let innerHTML = ''
            tbody.innerHTML = innerHTML
            let dataReq = {
                RxNo_PartInsp: objDataBrowsingDate.selected.RxNo_PartInsp,
                DateFrom: document.getElementById('dtpTableDate_DateFrom').value,
                DateTo: document.getElementById('dtpTableDate_DateTo').value,
            }
            let rows = []
            await reqAndRes(url_data_browsing_by_date, 'GET', dataReq, (dataRes) => {
                // console.log('dataBrowsingByDate : ',dataRes)
                objDataBrowsingDate.data.header = dataRes.header
                objDataBrowsingDate.data.dataSet = dataRes.data_set
                objDataBrowsingDate.data.dataCount = dataRes.data_count
                // console.log('objDataBrowsingDate : ',objDataBrowsingDate)
                const header = objDataBrowsingDate.data.header
                document.getElementById('dataBrowsingDate_Checking').innerHTML = header.CheckingItem
                // document.getElementById('dataBrowsingDate_Spec').innerHTML = header.Spec
                document.getElementById('dataBrowsingDate_ItemNo').innerHTML = header.ItemNo
                document.getElementById('dataBrowsingDate_Type').innerHTML = header.InspValType
                document.getElementById('dataBrowsingDate_Target').innerHTML = header.Target
                document.getElementById('dataBrowsingDate_UCL').innerHTML = header.UCL
                document.getElementById('dataBrowsingDate_LCL').innerHTML = header.LCL
                document.getElementById('dataBrowsingDate_USL').innerHTML = header.USL
                document.getElementById('dataBrowsingDate_LSL').innerHTML = header.LSL

                document.getElementById('dataBrowsingDate_Total').innerHTML = objDataBrowsingDate.data.dataCount.total
                document.getElementById('dataBrowsingDate_OK').innerHTML = objDataBrowsingDate.data.dataCount.ok
                document.getElementById('dataBrowsingDate_NG').innerHTML = objDataBrowsingDate.data.dataCount.ng
                objDataBrowsingDate.data.dataSet.forEach(data => {
                    rows.push([
                        data.RoundNo,
                        data.ImportDatetime,
                        data.FileName,
                        data.ProductionDate,
                        data.InspDateTime,
                        data.ShiftStr,
                        ['BOOL','STR'].includes(header.InspValType)?data.InspStr:data.InspVal,
                        data.Adjudge
                        

                    ])

                    
                });
            })
            // tbody.innerHTML = innerHTML
            $("#tbDataBrowsingDate").dataTable({
                data: rows,
                createdRow: function (row, data, dataIndex) {
                    // console.log(`row : ${row}`)
                    // console.log(`data : ${data[0]}`)
                    // console.log(`dataIndex : ${dataIndex}`)
                    // var match_result = data["match_result"];
                   
                    let itemNoIdx = 0
                    let shiftIdx = 5
                    let resultIdx = 6
                    let adjudgeIdx = 7
                    
                    $('td', row).eq(shiftIdx).addClass(`text-center shift-${data[shiftIdx]}`); 

                    $('td', row).eq(itemNoIdx).addClass(`text-end`); 

                    let textStyle = ''
                    if(objDataBrowsingDate.data.header.InspValType === 'VAL'){
                        textStyle = 'text-end'
                    }
                    else if(objDataBrowsingDate.data.header.InspValType === 'BOOL'){
                        textStyle = 'text-center'
                    }
                    else{
                        textStyle = 'text-start'
                    }
                    $('td', row).eq(resultIdx).addClass(`${textStyle} result-status-${objDataBrowsingDate.data.dataSet[dataIndex].ResultStatus}`); 
                    $('td', row).eq(resultIdx).attr('id',   objDataBrowsingDate.data.dataSet[dataIndex].RxNo_InspItem);

                    $('td', row).eq(adjudgeIdx).addClass(`result-status-${objDataBrowsingDate.data.dataSet[dataIndex].ResultStatus}`); 
                    if(['danger','warning'].includes(objDataBrowsingDate.data.dataSet[dataIndex].ResultStatus)){
                        $('td', row).eq(resultIdx).addClass(`is-abnormal`); 
                        $('td', row).eq(resultIdx).click(function () {
                            abnormalDetailApi(objDataBrowsingDate.data.dataSet[dataIndex].RxNo_InspItem).then((result) => {
                                // console.log('result',result)
                                objAbnormal.RxNo_InspItem = result.RxNo_InspItem
                                objAbnormal.RxNo_InspHeader = result.RxNo_InspHeader
                                objAbnormal.RxNo_ProblemAction = result.RxNo_ProblemAction
                                objAbnormal.itemName = result.CheckingItem
                                objAbnormal.inspResult = result.InspValType === 'VAL'?result.InspVal:InspVal.InspStr
                                objAbnormal.mode = result.AbnormalMode===''?objDataBrowsingDate.data.dataSet[dataIndex].AbnormalMode:result.AbnormalMode
                                objAbnormal.desription = result.AbnormalDesription===''?objDataBrowsingDate.data.dataSet[dataIndex].Adjudge:result.AbnormalDesription
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
                        });
                    }

                },
                ordering: false,
                "lengthMenu": [
                    [25, 50, 100, 500, -1],
                    [25, 50, 100, 500, "All"]
                ],
                "pageLength": 25,
                select: {
                    items: 'row',

                },

            })

            // #tbTableTroubleAndActionHistory_wrapper <---- datatable genarate ขึ้นมา
            document.getElementById('tbDataBrowsingDate_wrapper').classList.add('p-2')
            // let thead = document.querySelector('#tbTableTroubleAndActionHistory thead')
            let row = document.querySelectorAll('#tbDataBrowsingDate_wrapper .row')

            row[1].classList.add('mb-2', 'mt-2')
            row[1].querySelector('div').id = 'boxDataBrowsingDate'
            row[1].classList.remove('row')

            document.querySelectorAll('#tbDataBrowsingDate_wrapper thead tr th.sorting_asc').forEach(th => {
                th.classList.remove('sorting_asc')
            });

            // document.querySelectorAll('#tbDataBrowsingDate_body tr td')[0].click()
            document.getElementById('ldsSearchDataBrowsingDate').classList.add('d-none')
            resolve('seachInspdata_TableView success')
        } catch (error) {
            reject(error)
        }

    })
}

document.getElementById('selTableDate_PartInsp').onchange = async function () {
    objDataBrowsingDate.selected.RxNo_PartInsp = document.getElementById('selTableDate_PartInsp').value
    // await dataBrowsingByDate()
}




function menageDateTableDate(dateSelected) {
    let dateFrom = new Date(document.getElementById('dtpTableDate_DateFrom').value)
    let dateTo = new Date(document.getElementById('dtpTableDate_DateTo').value)
    if (dateSelected === 'DateFrom') {
        // month 0 = january
        if (dateFrom > dateTo || dateFrom.getMonth() != dateTo.getMonth()) {
            let lastday = new Date(dateFrom.getFullYear(), dateFrom.getMonth() + 1, 0)
            let year = lastday.getFullYear().toString()
            let month = (lastday.getMonth() + 1) < 10 ? `0${lastday.getMonth() + 1}` : lastday.getMonth() + 1
            let day = lastday.getDate() < 10 ? `0${lastday.getDate()}` : lastday.getDate()
            $("#dtpTableDate_DateTo").datetimepicker({
                value: `${year}-${month}-${day}`,

            });

        }
    } else if (dateSelected === 'DateTo') {
        if (dateFrom > dateTo || dateFrom.getMonth() != dateTo.getMonth()) {

            let year = dateTo.getFullYear().toString()
            let month = (dateTo.getMonth() + 1) < 10 ? `0${dateTo.getMonth() + 1}` : dateTo.getMonth() + 1
            let day = '01'
            $("#dtpTableDate_DateFrom").datetimepicker({
                value: `${year}-${month}-${day}`,

            });

        }

    }
}

document.getElementById('selTableDate_Part').onchange = async function () {
    objDataBrowsingDate.selected.RxNo_Part = document.getElementById('selTableDate_Part').value
    await tableDateSelectPartInsp()
    // await dataBrowsingByDate()
}
document.getElementById('selTableDate_Line').onchange = async function () {
    objDataBrowsingDate.selected.RxNo_Line = document.getElementById('selTableDate_Line').value
    await tableDateSelectMachine()
    await tableDateSelectPart()
    await tableDateSelectPartInsp()
    // await dataBrowsingByDate()
}
document.getElementById('selTableDate_Machine').onchange = async function () {
    objDataBrowsingDate.selected.RxNo_Machine = document.getElementById('selTableDate_Machine').value
    await tableDateSelectPart()
    await tableDateSelectPartInsp()
    // await dataBrowsingByDate()
}
document.getElementById('selTableDate_PartInsp').onchange = async function () {
    objDataBrowsingDate.selected.RxNo_PartInsp = document.getElementById('selTableDate_PartInsp').value
    // await dataBrowsingByDate()
}

document.getElementById('dtpTableDate_DateFrom').onchange = async function () {
    if (document.getElementById('dtpTableDate_DateFrom').value !== dtpTableDate_DateFrom_old) {
        menageDateTableDate('DateFrom')
        // await dataBrowsingByDate()
    }
}

document.getElementById('dtpTableDate_DateTo').onchange = async function () {
    if (document.getElementById('dtpTableDate_DateTo').value !== dtpTableDate_DateTo_old) {
        menageDateTableDate('DateTo')
        // await dataBrowsingByDate()
    }
}


startTableDate()