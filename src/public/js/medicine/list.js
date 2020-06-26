function editForm( med ) {

    let activo = med.Activo ? 
    '<input id="active" type="checkbox" name="Activo" value="1" checked>' :
    '<input id="active" type="checkbox" name="Activo" value="0">';

    let html = 
    `
    <form action="/meds/edit/`+ med.MedicamentoID +`" method="POST"> 
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="text" class="form-control" name="SustanciaActiva"
                        placeholder="Sustancia Activa" title="Sustancia Activa"
                        value=" `+ med.SustanciaActiva +` ">
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="text" class="form-control" name="Nombre" placeholder="Nombre" title="Nombre"
                    value=" `+ med.Nombre +` ">
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" class="form-control" name="Saldo" placeholder="Saldo" title="Saldo"
                    value= `+ med.Saldo +` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="text" class="form-control" name="Presentacion" title="Presentación"
                        placeholder="Presentación" value=" `+ med.Presentacion +` ">
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" name="P_Proveedor" title="$ Proveedor"
                        placeholder="$ Proveedor" value= `+ med.P_Proveedor +` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" name="P_Publico" title="$ Publico"
                        placeholder="$ Público" value= `+ med.P_Publico +` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" name="P_Descuento" title="$ Descuento"
                        placeholder="$ Descuento" value= `+ med.P_Descuento +` >
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-1">
                <div class="form-group">
                    <div class="align-center">
                        `+ activo +`
                        <label for="Activo">Activo</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group">
            <button class="btn btn-primary btn-block">Save</button>
        </div>
    </form>
    `;

    return html;
}

$(document).ready(function() {
    var table = $('#tbMeds').DataTable( {
        "paging":   true,
        "ordering": true,
        "info":     true,
        "autoWidth": false,
        //"processing": true,
        "language":{
            "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
        },
        "language": { 
            "info": "Medicamentos _START_-_END_/_TOTAL_ ",
            "lengthMenu":     "Mostrar _MENU_ medicamentos",
         },
        "serverSide": true,
        "ajax": "/meds/get-dt"
    } );
    //Every 30 secs
    setInterval( function () {
        table.ajax.reload( null, false ); // user paging is not reset on reload
    }, 2500 );

    // // Add event listener for opening and closing details
    // // $('#tbMeds tbody').on('click', 'td.details-control', function () {
    //     // let this_ = $(this);
        // // var tr = this_.closest('tr');
        // // var row = table.row( tr );

        // // let iconElement = this_.find('a').find('i');
        
        // // if ( row.child.isShown() ) {
        //     // // This row is already open - close it
            // // row.child.hide();
        //     // iconElement.attr('title','Editar').removeClass('fa-window-close').addClass('fa-pencil');
        // // }
        // // else {
        //     // // Open this row
            // // let MedicamentoID = tr.attr('data-MedicamentoID');

            // // var xhttp = new XMLHttpRequest();
            // // xhttp.open('GET', '/meds/edit/'+MedicamentoID);
            // // xhttp.onload = function(){
            //     // var med = xhttp.responseText;
                // // med = JSON.parse(med);

                // Show data in a new row(child)
            //     // row.child( editForm(med.med) ).show();
            // // };
            // // xhttp.send();

        //     // iconElement.attr('title', 'Cancelar').removeClass('fa-pencil').addClass('fa-window-close');
    //     // }
//     // } );
 });