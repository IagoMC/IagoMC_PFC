

sap.ui.define([
  "sap/ui/core/mvc/Controller",//Gestiona los controladores en el patrón MVC de SAPUI5.
  "sap/ui/model/Filter",//Crea y gestiona los filtros en el modelo de datos.
  "sap/ui/model/FilterOperator", // Proporciona una lista de operadores predinidos que se usa para filtrar en los modelos de datos


],

  function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("displayshipping.controller.main", {
      isDelivered: false, //indica en que pagina de tipo de envios estamos (Entregados / no entregados)
      onInit: function () {
        // Establece el estado inicial de los botones
        var deliveredButton = this.byId("shipmentsDeliveredButton");
        var notDeliveredButton = this.byId("shipmentsNotDeliveredButton");

        deliveredButton.setEnabled(true);
        notDeliveredButton.setEnabled(false);
      },

      // Función para ver los envíos entregados
      onViewDeliveredShipmentsPress: function () {
        var shipmentsNotDeliveredButton = this.byId("shipmentsNotDeliveredButton");
        var shipmentsDeliveredButton = this.byId("shipmentsDeliveredButton");

        // Cambia el estado de los botones
        shipmentsNotDeliveredButton.setPressed(false);
        shipmentsDeliveredButton.setPressed(true);

        // Habilita el botón de envíos no entregados y deshabilita el botón de envíos entregados
        shipmentsNotDeliveredButton.setEnabled(true);
        shipmentsDeliveredButton.setEnabled(false);

        // Aplica el filtro para mostrar solo los envíos entregados
        this.filterShipmentsByDeliveryStatus(true);


        // Obtiene la referencia a la tabla de envíos de la vista actual
        var oTable = this.getView().byId("shippingTable");
        // Obtiene la referencia al enlace de datos de la tabla
        var oBinding = oTable.getBinding("items");
        // Aplica un filtro al enlace de datos para mostrar solo los envíos entregados
        oBinding.filter([new Filter("Entregado", FilterOperator.EQ, true)]);

        this.isDelivered = true;

      },

      // Función para ver los envíos no entregados
      onViewShipmentsNotDelivered: function () {
        var shipmentsNotDeliveredButton = this.byId("shipmentsNotDeliveredButton");
        var shipmentsDeliveredButton = this.byId("shipmentsDeliveredButton");

        // Cambia el estado de los botones
        shipmentsNotDeliveredButton.setPressed(true);
        shipmentsDeliveredButton.setPressed(false);

        // Habilita el botón de envíos entregados y deshabilita el botón de envíos no entregados
        shipmentsNotDeliveredButton.setEnabled(false);
        shipmentsDeliveredButton.setEnabled(true);

        // Aplica el filtro para mostrar solo los envíos no entregados
        this.filterShipmentsByDeliveryStatus(false);

        // Obtiene la referencia a la tabla de envíos de la vista actual
        var oTable = this.getView().byId("shippingTable");
        // Obtiene la referencia al enlace de datos de la tabla
        var oBinding = oTable.getBinding("items");
        // Aplica un filtro al enlace de datos para mostrar solo los envíos no entregados
        oBinding.filter([new Filter("Entregado", FilterOperator.EQ, false)]);

        this.isDelivered = false;

      },

      // Función interna para filtrar los envíos por estado de entrega           
      filterShipmentsByDeliveryStatus: function (isDelivered) {
        var oTable = this.getView().byId("shippingTable");
        var oBinding = oTable.getBinding("items");

        // Aplica un filtro al enlace de datos para mostrar los envíos según su estado de entrega
        oBinding.filter([new Filter("Entregado", FilterOperator.EQ, isDelivered)]);
      },


      // Función para realizar una búsqueda en la tabla de envíos
      onSearch: function () {
        // Obtener la referencia a la vista actual
        var oView = this.getView();
        // Obtener el valor del campo de búsqueda
        var sValue = oView.byId("searchField").getValue();
        // Obtener la referencia a la tabla de envíos
        var oTable = oView.byId("shippingTable");
        // Obtener el enlace de datos de la tabla
        var oBinding = oTable.getBinding("items");
        // Verificar si se ha ingresado algún valor de búsqueda
        if (sValue) {
          // Crear un filtro para el campo "id" que coincide con el valor de búsqueda
          var oFilter = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, sValue);
          // Crear un filtro para el estado de entrega basado en la propiedad "isDelivered"
          var deliveryStatusFilter = new sap.ui.model.Filter("Entregado", sap.ui.model.FilterOperator.EQ, this.isDelivered);
          // Crear un filtro combinado que cumple con ambos filtros anteriores
          var oCombinedFilter = new sap.ui.model.Filter([oFilter, deliveryStatusFilter], true);
          // Aplicar el filtro combinado a la tabla de envíos
          oBinding.filter(oCombinedFilter, sap.ui.model.FilterType.Application);
          // Adjuntar un controlador de eventos para el evento "dataReceived" del enlace de datos de la tabla
          oBinding.attachEventOnce("dataReceived", function () {
            // Obtener los elementos actuales de la tabla
            var aItems = oBinding.getCurrentContexts();
            // Verificar si no se encontraron elementos en la tabla
            if (aItems.length === 0) {
              // Obtener el paquete de recursos de internacionalización de la vista actual
              var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
              // Obtener el texto correspondiente al mensaje de no se encontraron envíos
              var sMessage = oResourceBundle.getText("noShipmentsFound");
              // Mostrar un mensaje de toast con el texto correspondiente
              sap.m.MessageToast.show(sMessage);
            }
          }.bind(this));
        } else {
          // Verificar si la propiedad "isDelivered" no es undefined
          if (this.isDelivered !== undefined) {
            // Crear un filtro para el estado de entrega basado en la propiedad "isDelivered"
            var deliveryStatusFilter = new sap.ui.model.Filter("Entregado", sap.ui.model.FilterOperator.EQ, this.isDelivered);
            // Aplicar el filtro de estado de entrega a la tabla de envíos
            oBinding.filter(deliveryStatusFilter, sap.ui.model.FilterType.Application);
          } else {
            // No se ha ingresado un valor de búsqueda y la propiedad "isDelivered" es undefined, por lo que se eliminan todos los filtros

            oBinding.filter([], sap.ui.model.FilterType.Application);
          }
        }
      },


      // Funciones para manejar eventos relacionados con el diálogo de inserción de datos
      onInsertDialogClose: function () {
        // Restablece el valor del campo de entrada "inputId" a vacío
        this.byId("inputId").setValue("");
      },

      onOpenDialogPress: function () {
        // Obtiene la referencia al diálogo de inserción
        var oDialog = this.byId("insertDialog");
        // Abre el diálogo de inserción
        oDialog.open();
      },

      onInsertDialogCancel: function () {
        // Cierra el diálogo de inserción
        this.byId("insertDialog").close();
      },

      // Función para actualizar los datos en la tabla de envíos

      onRefresh: function () {
        // Obtiene la referencia a la tabla de envíos de la vista actual
        var oTable = this.byId("shippingTable");
        // Obtiene la referencia al enlace de datos de la tabla y actualiza la tabla
        oTable.getBinding("items").refresh();
      },

      // Función para abrir el dialogo sort en la carpte fragment
      open_dialogue: function () {
        if (!this.oSortDialog) {
          this.oSortDialog = sap.ui.xmlfragment("displayshipping.view.fragment.sort", this);
          this.getView().addDependent(this.oSortDialog);
        }
        this.oSortDialog.open();
      },

      // Función que se llama cuando se cambia la selección en el campo de origen
      onOriginSelectChange: function (event) {
        this.applyFilters();
      },
      // Función que se llama cuando se cambia la selección en el campo de destino
      onDestinationSelectChange: function (event) {
        this.applyFilters();
      },

      applyFilters: function () {
        //Obtiene el valor seleccionado en el campo de origen
        var selectedOrigin = this.byId("originComboBox").getSelectedKey();
        //Obtiene el valor seleccionado en el campo de destino
        var selectedDestination = this.byId("destinationComboBox").getSelectedKey();
        //Obtiene una referencia a la tabla de envíos
        var oTable = this.byId("shippingTable");
        //Obtiene el enlace de datos de la tabla mediante 
        var oBinding = oTable.getBinding("items");
        //Creamos un array para almacenar los filtros
        var oFilters = [];
        if (selectedOrigin) {
          // Crea un filtro para la propiedad "Origen" con el valor seleccionado
          var originFilter = new sap.ui.model.Filter("Origen", sap.ui.model.FilterOperator.EQ, selectedOrigin);
          oFilters.push(originFilter);
        }
        if (selectedDestination) {
          // Crea un filtro para la propiedad "Destino" con el valor seleccionado

          var destinationFilter = new sap.ui.model.Filter("Destino", sap.ui.model.FilterOperator.EQ, selectedDestination);
          oFilters.push(destinationFilter);
        }
        // Agregar filtro para envíos entregados o no entregados según el valor de isDelivered
        var deliveryStatusFilter = new sap.ui.model.Filter("Entregado", sap.ui.model.FilterOperator.EQ, this.isDelivered);
        oFilters.push(deliveryStatusFilter);
        //Aplica los filtros a la tabla
        oBinding.filter(oFilters);
      },

      // Función que se llama cuando se confirma la selección de ordenamiento en el diálogo de ordenamiento
      handleConfirm: function (oEvent) {
        // Obtener referencia a la tabla de envíos
        var oTable = this.getView().byId("shippingTable");
        // Obtener el enlace de datos de la tabla
        var oBinding = oTable.getBinding("items");
        // Obtener parámetros del evento
        var mParams = oEvent.getParameters();
        // Obtener el campo de ordenamiento seleccionado
        var sPath = mParams.sortItem.getKey();
        // Obtener la dirección de ordenamiento
        var bDescending = mParams.sortDescending;
        // Crear un objeto Sorter con el campo de ordenamiento y dirección
        var aSorters = [];
        aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
        // Aplicar el ordenamiento a los datos de la tabla
        oBinding.sort(aSorters);
      },

      handleCancel: function (oEvent) {
        // Handle cancel event of the dialog
      },

      //Funion que permite acceder a la pagina shipping_details pasandole el id de envio
      onPress: function (oEvent) {
        // Obtener el objeto que disparó el evento (el ítem de la lista)
        var oItem = oEvent.getSource();
        // Obtener el enrutador de la aplicación
        var oRouter = this.getOwnerComponent().getRouter();
        // Navegar a la vista "shipping_details" y pasar el contexto del ítem como parámetro
        oRouter.navTo("shipping_details", {
          context: oItem.getBindingContext().getPath().substr(1)
        });
      },

      //Funcion que se activa a la hora de ingresar el id de envio para actualizarlo
      onInputChange: function (event) {
        // Obtener el valor del campo de entrada
        var inputValue = event.getParameter("value");
        // Guardar el valor en una propiedad interna de la instancia
        this._inputValue = inputValue;
      },


      //Funcion que comprueba y modifca todo lonecsario a la hora de ntrgar un envio
      onInsertDialogConfirm: function () {
        // Obtener el ID del envío desde la propiedad interna guardada
        var sId = this._inputValue;
        // Construir la ruta del envío utilizando el ID
        var sPath = "/Envios('" + sId + "')";
        // Obtener el modelo de datos de la aplicación
        var oModel = sap.ui.getCore().getModel();
        // Comprueba que están definidos los siguientes valores
        if (oModel && sId) {
          // Comprobar si el envío tiene el campo Entregado igual a false
          var oContext = oModel.createBindingContext(sPath);
          var bEntregado = oModel.getProperty(oContext + "/Entregado");
          if (bEntregado == false) {
            // El envío ya ha sido entregado, mostrar mensaje de error y salir de la función
            var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("shipmentAlreadyDelivered");
            sap.m.MessageToast.show(sMessage);
            return;
          }
          // Comprobar si existe el ID del envío
          var bExists = oModel.hasContext(oContext);
          if (!bExists) {
            // El ID del envío no existe, mostrar mensaje de error y salir de la función
            var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("shipmentIdDoesNotExist");
            sap.m.MessageToast.show(sMessage);
            return;
          }
          // Realizar las modificaciones
          oModel.setProperty(oContext + "/Entregado", true);
          oModel.submitChanges({
            success: function () {
              // Los cambios se han guardado correctamente en el modelo de datos
              var sMessageSuccess = this.getView().getModel("i18n").getResourceBundle().getText("shipmentMarkedDelivered");
              sap.m.MessageToast.show(sMessageSuccess);
              // Actualizar la propiedad "Ocupado" del conductor relacionado con el envío
              var sIdConductor = oEnvio.idConductor;
              if (sIdConductor) {
                var sConductorPath = "/Conductor('" + sIdConductor + "')";
                var oConductorContext = oModel.createBindingContext(sConductorPath);
                oModel.setProperty("Ocupado", false, oConductorContext);
              }
              // Actualizar la propiedad "Ocupado" del vehículo relacionado con el envío
              var sMatricula = oEnvio.Matricula;
              if (sMatricula) {
                var sVehiculoPath = "/Vehiculos('" + sMatricula + "')";
                var oVehiculoContext = oModel.createBindingContext(sVehiculoPath);
                oModel.setProperty("Ocupado", false, oVehiculoContext);
              }
              var sMessageFinal = this.getView().getModel("i18n").getResourceBundle().getText("updateFinished");
              sap.m.MessageToast.show(sMessageFinal);
            },
            error: function () {
              // Error al guardar los cambios en el modelo de datos
              var sMessageErrorShipment = this.getView().getModel("i18n").getResourceBundle().getText("errorUpdatingShipment");
              sap.m.MessageToast.show(sMessageErrorShipment);
            }.bind(this)
          });
        } else {
          var sErrorMessage = this
            // Datos inválidos, mostrar mensaje de error
            .getView().getModel("i18n").getResourceBundle().getText("invalidDataError");
          sap.m.MessageToast.show(sErrorMessage);
        }
      }



    });
  });