objAbnormal = {
    RxNo_InspItem: '',
    RxNo_InspHeader: '',
    RxNo_ProblemAction: '',
    itemName: '',
    inspResult: '',
    mode: '',
    desription: '',
    problem: {
        detail: '',
        by: '',
        timeStamp: ''
    },
    action: {
        detail: '',
        by: '',
        timeStamp: ''
    }
}

let modalAbnormal = new bootstrap.Modal(document.getElementById('modalAbnormal'), {
    keyboard: false
})

async function showModalAbnormal() {
    modalAbnormal.show()
}

function abnormalDetailApi(RxNo_InspItem) {
    return new Promise((resolve, reject) => {
        reqAndRes(url_abnormal_getby_insp_item, 'GET', { RxNo_InspItem: RxNo_InspItem }, function (dataRes) {
            if (dataRes !== false) {

                resolve(dataRes[0])
            }
            else {
                reject('req err')
            }
        })
    })

}

function clearAbnormal() {
    document.getElementById('edtAbnormal_ItemName').value = ''
    document.getElementById('edtAbnormal_InspResult').value = ''
    document.getElementById('edtAbnormal_Desription').value = ''
    document.getElementById('edtAbnormal_Mode').value = ''

    document.getElementById('edtAbnormal_ProblemDetail').value = ''
    document.getElementById('edtAbnormal_ProblemBy').value = ''
    document.getElementById('edtAbnormal_ProblemTimeStamp').value = ''

    document.getElementById('edtAbnormal_ActionDetail').value = ''
    document.getElementById('edtAbnormal_ActionBy').value = ''
    document.getElementById('edtAbnormal_ActionTimeStamp').value = ''
}

function showDataAbnomal() {
    document.getElementById('edtAbnormal_ItemName').value = objAbnormal.itemName
    document.getElementById('edtAbnormal_InspResult').value = objAbnormal.inspResult
    document.getElementById('edtAbnormal_Desription').value = objAbnormal.desription
    document.getElementById('edtAbnormal_Mode').value = objAbnormal.mode

    document.getElementById('edtAbnormal_ProblemDetail').value = objAbnormal.problem.detail
    document.getElementById('edtAbnormal_ProblemBy').value = objAbnormal.problem.detail.trim() === '' ? '' : objAbnormal.problem.by
    document.getElementById('edtAbnormal_ProblemTimeStamp').value = objAbnormal.problem.detail.trim() === '' ? '' : objAbnormal.problem.timeStamp

    document.getElementById('edtAbnormal_ActionDetail').value = objAbnormal.action.detail
    document.getElementById('edtAbnormal_ActionBy').value = objAbnormal.action.detail.trim() === '' ? '' : objAbnormal.action.by
    document.getElementById('edtAbnormal_ActionTimeStamp').value = objAbnormal.action.detail.trim() === '' ? '' : objAbnormal.action.timeStamp
}
async function saveAbnormalApi() {
    // let user = {}
    // await fetch(url_get_session_user, {
    //     method: 'GET',
    //     headers: csrf_token,
    // })
    //     .then((response) => {
    //         if (response.ok) {
    //             return response.json();
    //         }
    //         else {
    //             return false;
    //         }
    //     })
    //     .then(async (response) => {
    //         // console.log(response)
    //         user = response
    //     })
    //     .catch((err) => {

    //         // Swal.fire(err.statusText, url, 'error');

    //     })
    let problemDetail = document.getElementById('edtAbnormal_ProblemDetail').value
    let actionDetail = document.getElementById('edtAbnormal_ActionDetail').value
    let updateDetailStatue = ''
    if (problemDetail !== objAbnormal.problem.detail && actionDetail !== objAbnormal.action.detail) {
        updateDetailStatue = 'all'
    }
    else if (problemDetail !== objAbnormal.problem.detail) {
        updateDetailStatue = 'problem'
    }
    else if (actionDetail !== objAbnormal.action.detail) {
        updateDetailStatue = 'action'
    }
    if (updateDetailStatue !== '') {

        let dataReq = {
            RxNo_InspItem: objAbnormal.RxNo_InspItem,
            RxNo_InspHeader: objAbnormal.RxNo_InspHeader,
            RxNo_ProblemAction: objAbnormal.RxNo_ProblemAction,
            ProblemType: 'Control Chart',
            Mode: objAbnormal.mode,
            ProblemDetail: problemDetail,
            ProblemBy: problemDetail === objAbnormal.problem.detail ? objAbnormal.problem.by : RxNo_UserLogin,
            ActionDetail: actionDetail,
            ActionBy: actionDetail === objAbnormal.action.detail ? objAbnormal.action.by : RxNo_UserLogin,
            UpdateDetailStatus: updateDetailStatue
        }

        reqAndRes(url_abnormal_save, objAbnormal.RxNo_ProblemAction === '' ? 'POST' : 'PUT', dataReq, function (dataRes) {
            abnormalDetailApi(dataRes.RxNo_Insp_Item).then((result) => {
                objAbnormal.RxNo_InspItem = result.RxNo_InspItem
                objAbnormal.RxNo_InspHeader = result.RxNo_InspHeader
                objAbnormal.RxNo_ProblemAction = result.RxNo_ProblemAction
                objAbnormal.itemName = result.CheckingItem
                objAbnormal.inspResult = result.InspValType === 'VAL' ? result.InspVal : InspVal.InspStr
                objAbnormal.mode = result.AbnormalMode === '' ? row.AbnormalMode : result.AbnormalMode
                objAbnormal.desription = result.AbnormalDesription === '' ? row.Adjudge : result.AbnormalDesription
                objAbnormal.problem.detail = result.ProblemDetail
                objAbnormal.problem.by = result.ProblemBy
                objAbnormal.problem.timeStamp = result.ProblemTimeStamp
                objAbnormal.action.detail = result.ActionDetail
                objAbnormal.action.by = result.ActionBy
                objAbnormal.action.timeStamp = result.ActionTimeStamp
                clearAbnormal()
                showDataAbnomal()
            })
                .catch((err) => {
                    console.error(err)
                })
                .finally(async () => {
                    // console.log('ActiveProcess : ', ActiveProcess)
                    if (ActiveProcess[MENU_DASHBOARD].ActiveMenu && ActiveProcess[MENU_DASHBOARD].TabNameActive === 'Daily Performance') {
                        let idxInspItem = objControlChartDaily.data.data_set.findIndex(o => o.RxNo_InspItem === objAbnormal.RxNo_InspItem);
                        if (objAbnormal.problem.detail !== '' && objAbnormal.action.detail !== '') {

                            objControlChartDaily.data.chart.control_chart_data_style.border_color[idxInspItem] = '#0000FF'
                        }
                        else {
                            objControlChartDaily.data.chart.control_chart_data_style.border_color[idxInspItem] = [1.2, 1.4].includes(objAbnormal.mode) ? '#FF0000' : '#FFEA00'
                        }
                        // console.log(idxInspItem)
                        await updateControlChartDaily()
                    }
                })
        })
    }
}

// showModalAbnormal()