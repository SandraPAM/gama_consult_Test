/**************************** FUNCTIONS *******************************************/
function fillModalCU(med, MedicamentoID) {
    $("#iSustanciaActiva").val(med.SustanciaActiva).prop("disabled", true);
    $("#iNombreComercial").val(med.NombreComercial).prop("disabled", true);
    $("#iSaldo").val(entries[MedicamentoID].split(',')[1]);
    $("#iQuantity").val(entries[MedicamentoID].split(',')[0]);
    $("#iPresentacion").val(med.Presentacion).prop("disabled", true);
    $("#iPProveedor").val(med.P_Proveedor);
    $("#iPPublico").val(med.P_Publico);
    $("#iDescuento").val(med.Descuento);
    $("#iPDescuento").val(med.P_Descuento);
    $("#iContenido").val(med.Contenido).prop("disabled", true);
    $("#iDosis").val(med.DosisMG).prop("disabled", true);
    $("#iLaboratorio").val(med.Laboratorio).prop("disabled", true);
    $("#iProveedor").val(med.Proveedor).prop("disabled", true);
    $("#ckActivo").val(med.Activo);
    med.Activo == "1" ? $("#ckActivo").prop("checked", true) : $("#ckActivo").prop("checked", false);
    $("#iCaducidad").val(med.Caducidad.split('T')[0]);
    priceBinding();
}

function localEntryUpdate(MedicamentoID, data_, quantity, saldo_) {
    sessionStorage.setItem(MedicamentoID, JSON.stringify(data_));
    if (quantity) { //Covers case where quantity field has been updated in ModalCreateUpdate
        entries[MedicamentoID] = quantity + "," + saldo_;
    }
    reloadAddTable();
}

/**************************** EVENTS *******************************************/
tableSearch = null;
tableAdd = null;
$(document).ready(function () {
    // ********* FUNCTIONALITY ***********
    sessionStorage.clear();
    tabIndex = 0;
    // ********* SEARCH TABLE ***********
    tableSearch = $('#tbSearch').DataTable({
        dom: '<"top mt-4 row" frt><"bottom row" <"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        select: {
            style: 'single'
        },
        "pagingType": "full",
        "lengthMenu": [7],
        "paging": true,
        "responsive": true,
        "ordering": true,
        "info": true,
        // "autoWidth": false,
        "order": [[ 1, 'asc' ], [ 0, 'asc' ]],
        "serverSide": true,
        "ajax": "/meds/get-dt",
        "language": {
            "info": "Medicamentos _START_-_END_/_TOTAL_ ",
            "lengthMenu": "Mostrar   _MENU_   medicamentos",
            "sProcessing": "Procesando...",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfoEmpty": "Medicamentos 0/0",
            "sInfoFiltered": "(_TOTAL_ Coincidencias)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": ">>",
                "sPrevious": "<<"
            },
            "oAria": {
                "sSortAscending": ": Ordenar ascendente",
                "sSortDescending": ": Ordenar descendente"
            },
        },
        "columnDefs": [
            {
                "targets": [4,9,10,11,12,14,15],
                "searchable": false
            },
            {   
                "targets": [14,15],
                "visible": false
            }
        ],
        "columns": [
            // 0-ID 
            {},
            // 1-SustanciaActiva
            {},
            // 2-NombreComercial
            { 
            },
            // 3-Presentacion
            {},
            // 4-Saldo
            {},
            // 5-Contenido
            {},
            // 6-Dosis
            {},
            // 7-Laboratorio
            {},
            // 8-Proveedor
            {},
            // 9-P_Proveedor
            {},
            // 10-P_Publico
            {},
            // 11-Descuento
            {},
            // 12-P_Descuento
            {},
            // 13-Caducidad
            {
                "render": function(data, type, row, meta) {
                    return formatDate(data);
                }
            },
            //14-Edit button
            { 
            },
            //15-Delete button
            {   
            }
        ]
    });
    // ************ ADD TABLE **************
    idList = ["0"]; //List of tableSearch selected elements, to show in tableAdd
    tableAdd = $('#tbAdd').DataTable({
        dom: '<"top mt-4 row" rt><"bottom row" <"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        "pagingType": "full",
        "alengthMenu": ["All"],
        "paging": true,
        "responsive": true,
        "ordering": true,
        "info": true,
        // "autoWidth": false,
        "order": [[ 1, 'asc' ], [ 0, 'asc' ]],
        "serverSide": true,
        "ajax": "/meds/get-addTable/" + JSON.stringify(idList),
        "language": {
            "info": "Medicamentos _START_-_END_/_TOTAL_ ",
            "lengthMenu": "Mostrar   _MENU_   medicamentos",
            "sProcessing": "Procesando...",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfoEmpty": "Medicamentos 0/0",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": ">>",
                "sPrevious": "<<"
            },
            "oAria": {
                "sSortAscending": ": Ordenar ascendente",
                "sSortDescending": ": Ordenar descendente"
            },
        },
        "columnDefs": [
            {
                "targets": [4,9,10,11,12,14,15],
                "searchable": false,
            }
        ],
        "columns": [
            // 0-ID 
            {},
            // 1-SustanciaActiva
            {},
            // 2-NombreComercial
            {
            },
            // 3-Presentacion
            {},
            // 4-Cantidad
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    let entry_ = entries[data[0]];
                    return entry_.split(',')[0]; //Display 'Quantity'
                }
            },        
            // 5-Contenido
            {},
            // 6-DosisMG
            {},
            // 7-Laboratorio
            {},
            // 8-Proveedor
            {},
            // 9-P_Proveedor
            {
                "data": null,
                render: function (data, type, row, meta) {
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null) { //If the medicine had been locally modified
                        return item_.P_Proveedor;
                    } else {
                        return data[9];
                    }
                }
            },
            // 10-P_Publico
            {
                "data": null,
                render: function (data, type, row, meta) {
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null) { //If the medicine had been locally modified
                        return item_.P_Publico;
                    } else {
                        return data[10];
                    }
                }
            },
            // 11-Descuento
            {
                "data": null,
                render: function (data, type, row, meta) {
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null) { //If the medicine had been locally modified
                        return item_.Descuento;
                    } else {
                        return data[11];
                    }
                }
            },
            // 12-Descuento
            {
            },
            // 13-Caducidad
            {
                "data": null,
                render: function (data, type, row, meta) {
                    let item_ = JSON.parse(sessionStorage.getItem(data[0]));
                    if (item_ != null) { //If the medicine had been locally modified
                        return formatDate(item_.Caducidad);
                    } else {
                        return formatDate(data[13]);
                    }
                }
            },
            //14-Edit button Only change the current table   go
            {
                "data": null,
                "orderable": false,
                "className": 'details-control',
                "render": function (data, type, row, meta) {
                    let html = `
                            <i id="btnEdit" data-MedicamentoID=${data[14]}
                            class="fa fa-pencil text-info pointer" title="Editar">
                            </i>`;
                    return html;
                }
            },
            //15-Delete button This button should delete it only from the tbAdd table,
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    let html = `
                                <i id="btnDelete" data-MedicamentoID=${data[15]}
                                class="fa fa-close text-danger pointer" title="Eliminar">
                                </i>`;
                    return html;
                }
            }
        ]
    });


});

// ********************* MODAL ENTRIES EVENTS **************************
let entries = {};

// ********************* ADD TABLE EVENTS **************************
$(document).on("click", "#btnEdit", function (e) {
    var row = $(this).closest("tr");
    let MedicamentoID = $(row["prevObject"][0]).attr('data-MedicamentoId');

    let item_ = JSON.parse(sessionStorage.getItem(MedicamentoID));
    if (item_ != null) {//If medicine already in sessionStorage, which means previously getted by 'meds/getMed' method
        fillModalCU(item_, MedicamentoID);
    } else { //Otherwise, make request
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/meds/getMed/' + MedicamentoID);
        xhttp.onload = function () {
            var res = xhttp.responseText;
            res = JSON.parse(res);
            // Display on Modal
            fillModalCU(res.med, MedicamentoID);
        };
        xhttp.send();
    }

    $(".modal-header").css("background-color", "#C0DE00");
    $(".modal-header").css("color", "white");
    $(".modal-title").text('Editar Medicamento');
    $(".modal-option").val(MedicamentoID);
    $("#modalCU").modal('show');
});