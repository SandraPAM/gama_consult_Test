/**************************** FUNCTIONS *******************************************/
function tableDefinition(tableRef) {


    /******** COMMON ********/
    var table = commonTable();
    table.dom = '<"top mt-4 row" f<"mx-auto mb-2">prt><"bottom row" <"col-sm-12 col-md-5"i> <"col-sm-12 col-md-2"l>>';
    table.columnDefs.push({
        "targets": [5, 10, 11, 12, 13, 15, 16],
        "searchable": false
    });


    /******** TBSEARCH ********/
    if (tableRef == "tbSearch") {
        var table1 = table;
        table1.ajax = "/meds/get-dt/" + showActive;
        table1.columnDefs.push(
            {
                "targets": [4, 15, 16], //SaldoAnterior, Edit, Delete  - Mandatory Hidden Columns for tbSearch
                "visible": false
            },
            {
                "targets": hiddenColsSearch, //Optional Hidden Columns
                "visible": false
            }
        );
        /******** INITIALIZE ********/
        tableSearch = $('#tbSearch').DataTable(table1);

    }
    /******** TBADD ********/
    else {
        var table2 = table;
        table2.ajax = "/meds/get-addTable/" + JSON.stringify(idList);
        table2.drawCallback =  function( settings ) {
            refreshCalculator();
        };
        table2.alengthMenu = ["All"];
        table2.searching = false;
        table2.columnDefs.push(
            {
                "targets": hiddenColsAdd,
                "visible": false
            }
        );
        /*Columns Content*/
        //Display 'Saldo'
        table2.columns[4] = {
            "data": null,
            "render": function (data, type, row, meta) {
                let entry_ = entries[data[0]];
                return entry_.split(',')[1];
            }
        };
        //Display 'Quantity'
        table2.columns[5] = {
            "data": null,
            "render": function (data, type, row, meta) {
                let entry_ = entries[data[0]];
                return entry_.split(',')[0];
            }
        };
        //Display 'P_Proveedor'
        table2.columns[10] = {
            "data": null,
            render: function (data, type, row, meta) {
                let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                if (item_ != null) { //If the medicine had been locally modified
                    return item_.P_Proveedor;
                } else {
                    return data[10];
                }
            }
        };
        //Display 'P_Publico'
        table2.columns[11] = {
            "data": null,
            render: function (data, type, row, meta) {
                let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                if (item_ != null) { //If the medicine had been locally modified
                    return item_.P_Publico;
                } else {
                    return data[11];
                }
            }
        };
        //Display 'Descuento'
        table2.columns[12] = {
            "data": null,
            render: function (data, type, row, meta) {
                let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                if (item_ != null) { //If the medicine had been locally modified
                    return item_.Descuento;
                } else {
                    return data[12];
                }
            }
        };
        //Change icon
        table2.columns[16].render = function (data, type, row, meta) {
            let html = `
                            <i id="btnDelete" data-MedicamentoID=${data[16]}
                            class="fa fa-close icontable text-danger pointer" title="Eliminar">
                            </i>`;
            return html;

        };
        /******** INITIALIZE ********/
        tableAdd = $('#tbAdd').DataTable(table2);
    }
};

function checkSaldo(){
    if ($("#iSaldoAE").val() - $("#iCantidad").val() < 0){
        document.getElementById("#ModalQuantityMessage").style.display='block';
        document.getElementById('btnAddEntry').disabled = true;
        }
    else{
        document.getElementById("#ModalQuantityMessage").style.display='none';
        document.getElementById('btnAddEntry').disabled = false;
    }
}

function refreshCalculator() {

    var data_ = tableAdd.rows().data();
    if (data_.length < 1) {
        $("#calculator").css("display", "none");
    } else {
        $("#calculator").css("display", "block");
        let min = 0;
        let max = 0;
        for (let i = 0; i < data_.length; i++) {
            item_ = tableAdd.rows(i).data()[0];
            quantity= entries[item_[0]].split(',')[0];
            min += item_[13] * quantity;
            max += item_[11] * quantity;
        }

        let step = (max - min) / 10;
        //Round
        step =   Math.round((step * 100) / 100);
        //Slider params
        $("#spanCalcMin").text(min);
        $("#spanCalcMax").text(max);
        $("#rangeCalculator").attr("min", min).attr("max", max).attr("step", step);
        $("#rangeCalculator").val(min + (step * 5));
        //Total Input
        $("#iCalcTotal").attr("min", min).attr("max", max).attr("step", step);
        $("#iCalcTotal").val(min + (step * 5));
    }
}

function checkInputCalculator(){
    if ( ($("#iCalcTotal").val() < $("#rangeCalculator").attr("min") ) || ($("#iCalcTotal").val() > $("#rangeCalculator").attr("max"))){
        document.getElementById("#CalculatorMessage").style.display='block';
    }
    else{
        document.getElementById("#CalculatorMessage").style.display='none';
    }
}


/**************************** EVENTS *******************************************/
document.getElementById('Exits_item').style.color = '#333333';
showActive = true;
tableSearch = null;
tableAdd = null;
hiddenColsSearch = [10, 14]; //Default Hidden Columns - This could be costumize by users
hiddenColsAdd = [10, 14]; //Default Hidden Columns - This could be costumize by users

$(document).ready(function () {
    // ********* FUNCTIONALITY ***********
    tabIndex = 0;
    // ********* TABLES ***********
    tableDefinition("tbSearch");
    idList = ["0"]; //List of tableSearch selected elements, to show in tableAdd
    tableDefinition("tbAdd");

    $("#calculator").css("display", "none");
});

document.getElementById("#CalculatorMessage").style.display='none';




// ********************* MODAL ENTRIES EVENTS **************************
let entries = {};

// ********************* ADD TABLE EVENTS **************************
let _addSelectedRow;
$(document).on("click", "#btnEdit", function (e) {
    let rowSelected = _addSelectedRow.data();
    $("#formEntry").trigger("reset");
    $("#iID").val(rowSelected[0]);
    $("#iNombreE").val(rowSelected[2]);
    $("#iCantidad").val(entries[rowSelected[0]].split(",")[0]);
    $("#iSaldoAE").val(entries[rowSelected[0]].split(",")[1]);

    $("#modalEntry").modal("show");
    $("#formEntry").addClass("exit");
});

$('#tbAdd').on('click', 'tr', function () {
    _addSelectedRow = tableAdd.row(this);
});

// $('#tbAdd').on( 'draw', function () {
//     refreshCalculator();
//     console.log( 'Redraw occurred at: '+new Date().getTime() );
// } );


// ********************* OTHER EVENTS **************************

/******** CheckSaldo ********/
$("#iCantidad").on('keyup' , function(){
    checkSaldo();
});

$("#iSaldoAE").on('keyup' , function(){
    checkSaldo();
});

$("#iCantidad").on('click' , function(){
    checkSaldo();
});

$("#iSaldoAE").on('click' , function(){
    checkSaldo();
});


// ********************* CALCULATOR EVENTS **************************
$("#rangeCalculator").on("change", function () {
    $("#iCalcTotal").val(this.value);
});

$("#iCalcTotal").on("change", function () {
    $("#rangeCalculator").val(Math.round((this.value * 100) / 100));
});

$("#iCalcTotal").on("click", function () {
    $("#iCalcTotal").focus();
    checkInputCalculator();
});

$("#iCalcTotal").on("keyup", function () {
    checkInputCalculator();
});

