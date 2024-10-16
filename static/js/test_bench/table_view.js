
function startTableView() {
  clearInspdata_TableView()
  // seachInspdata_TableView()
}
function clearInspdata_TableView() {
  document.getElementById('edtSearchTableView_PartNo').value = ''
  document.getElementById('edtSearchTableView_PartName').value = ''
  document.getElementById('edtSearchTableView_MachineNo').value = ''
  document.getElementById('edtSearchTableView_MachineName').value = ''
  document.getElementById('edtSearchTableView_LineCode').value = ''
  document.getElementById('edtSearchTableView_LineName').value = ''
  document.getElementById('edtSearchTableView_ItemNo').value = 0
  document.getElementById('edtSearchTableView_ItemName').value = ''
  document.getElementById('edtSearchTableView_ShiftNo').value = ''
  document.getElementById('edtSearchTableView_LotNo').value = ''

  let today = new Date()
  $("#edtSearchTableView_DateFrom").datetimepicker({

    timepicker: false,
    datepicker: true,
    format: 'Y-m-d',
    value: `${today.getFullYear().toString()}-${(today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}-01`,
    // value: today.toISOString().slice(0, 10),
    week: true
  });
  $("#edtSearchTableView_DateTo").datetimepicker({

    timepicker: false,
    datepicker: true,
    format: 'Y-m-d',
    value: `${today.getFullYear().toString()}-${(today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}-${today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()}`,
    // value: today.toISOString().slice(0, 10),
    week: true
  });
}
async function seachInspdata_TableView() {
  return new Promise(async (resolve, reject) => {
    try {
      document.getElementById('ldsSearchTableView').classList.remove('d-none')
      let tbody = document.getElementById('insp_data_body')
      tbody.innerHTML = ''
      $("#tbDatabrowsingSerial").DataTable().destroy()
      let innerHTML = ''
      tbody.innerHTML = innerHTML
      let dataReq = {
        PartNo: document.getElementById('edtSearchTableView_PartNo').value,
        PartName: document.getElementById('edtSearchTableView_PartName').value,
        MachineNo: document.getElementById('edtSearchTableView_MachineNo').value,
        MachineName: document.getElementById('edtSearchTableView_MachineName').value,
        LineCode: document.getElementById('edtSearchTableView_LineCode').value,
        LineName: document.getElementById('edtSearchTableView_LineName').value,
        ItemNo: document.getElementById('edtSearchTableView_ItemNo').value,
        ItemName: document.getElementById('edtSearchTableView_ItemName').value,
        ShiftNo: document.getElementById('edtSearchTableView_ShiftNo').value,
        LotNo: document.getElementById('edtSearchTableView_LotNo').value,
        DateFrom: document.getElementById('edtSearchTableView_DateFrom').value,
        DateTo: document.getElementById('edtSearchTableView_DateTo').value,
      }
      let rows = []
      await reqAndRes(url_insp_data_table_view, 'GET', dataReq, (dataRes) => {
        // alert('data complete')
        dataRes.forEach(data => {
          rows.push([
            data.PartNo,
            data.PartName,
            data.MachineNo,
            data.MachineName,
            data.LineCode,
            data.LineName,
            data.SectionCode,
            data.ItemNo,
            data.CheckingItem,
            data.Spec,
            data.InspValType,
            data.ShiftNo,
            data.LotNo,
            data.ProductionDate,
            data.RoundNoHeader,
            ['STR', 'BOOL'].includes(data.InspValType) ? data.InspStr : data.InspVal,
            data.InspAdj,
            data.RoundNoItem
          ])
          
          //       innerHTML += `
          //     <tr>
          //       <td>${data.PartNo}</td>
          //       <td>${data.PartName}</td>
          //       <td>${data.MachineNo}</td>
          //       <td>${data.MachineName}</td>
          //       <td>${data.LineCode}</td>
          //       <td>${data.LineName}</td>
          //       <td>${data.SectionCode}</td>
          //       <td>${data.ItemNo}</td>
          //       <td>${data.CheckingItem}</td>
          //       <td>${data.Spec}</td>
          //       <td>${data.InspValType}</td>
          //       <td>${data.ShiftNo}</td>
          //       <td>${data.LotNo}</td>
          //       <td>${data.ProductionDate}</td>
          //       <td>${data.RoundNoHeader}</td>
          //       <td>${['STR', 'BOOL'].includes(data.InspValType) ? data.InspStr : data.InspVal}</td>
          //       <td>${data.InspAdj}</td>
          //       <td>${data.RoundNoItem}</td>
          //     </tr>
          // `
        });
      })
      // tbody.innerHTML = innerHTML
      $("#tbDatabrowsingSerial").dataTable({
        data: rows,
        createdRow: function(row, data, dataIndex){
          console.log(`row : ${row}`)
          console.log(`data : ${data[0]}`)
          console.log(`dataIndex : ${dataIndex}`)
          // var match_result = data["match_result"];
          let RoundNoHeader_idx = 14
          if(data[RoundNoHeader_idx] <= 50){$('td', row).eq(RoundNoHeader_idx).addClass('test1');}
           
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
      document.getElementById('tbDatabrowsingSerial_wrapper').classList.add('p-2')
      // let thead = document.querySelector('#tbTableTroubleAndActionHistory thead')
      let row = document.querySelectorAll('#tbDatabrowsingSerial_wrapper .row')

      row[1].classList.add('mb-2', 'mt-2')
      row[1].querySelector('div').id = 'boxInspdata_TableView'
      row[1].classList.remove('row')

      document.querySelectorAll('#tbDatabrowsingSerial_wrapper thead tr th.sorting_asc').forEach(th => {
        th.classList.remove('sorting_asc')
      });

      document.querySelectorAll('#insp_data_body tr td')[0].click()
      document.getElementById('ldsSearchTableView').classList.add('d-none')
      resolve('seachInspdata_TableView success')
    } catch (error) {
      reject(error)
    }

  })

}

document.getElementById('btnResetTableView').onclick = function () {
  clearInspdata_TableView()
  seachInspdata_TableView()
}
document.getElementById('btnSearchTableView').onclick = function () {
  seachInspdata_TableView()
}


startTableView()