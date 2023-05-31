

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter"


],

  function (Controller, Filter, FilterOperator, Sorter) {
    "use strict";

    return Controller.extend("displayshipping.controller.main", {
      isDelivered: false,
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


      /********************************************* */
      onOriginSelectChange: function (event) {
        this.applyFilters();
      },

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













      handleConfirm: function (oEvent) {
        var oTable = this.getView().byId("shippingTable");
        var oBinding = oTable.getBinding("items");
        var mParams = oEvent.getParameters();
        var sPath = mParams.sortItem.getKey();
        var bDescending = mParams.sortDescending;
        var aSorters = [];
        aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
        oBinding.sort(aSorters);
      },

      handleCancel: function (oEvent) {
        // Handle cancel event of the dialog
      },
      onScanSuccess: function (oEvent) {
        if (oEvent.getParameter("cancelled")) {
          var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
          var sMessage = oResourceBundle.getText("scanCancelled");
          MessageToast.show("Scan cancelled", { duration: 1000 });
        } else {
          if (oEvent.getParameter("text")) {
            var scannedId = oEvent.getParameter("text");
            this.onInsertDialogConfirm(scannedId);
          } else {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var sMessage = oResourceBundle.getText("emptyScanText");
            sap.m.MessageToast.show(sMessage, { duration: 1000 });
          }
        }
      },
      onScanError: function (oEvent) {
        MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
      },


      onPress: function (oEvent) {
        var oItem = oEvent.getSource();
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("shipping_details", {
          context: oItem.getBindingContext().getPath().substr(1)
        });
      },
      onInputChange: function (event) {
        var inputValue = event.getParameter("value");
        this._inputValue = inputValue;
      },
      onInsertDialogConfirm: function () {
        var sId = this._inputValue;

        var sPath = "/Envios('" + sId + "')";
        var oModel = new sap.ui.model.odata.v4.ODataModel({
          serviceUrl: "https://81becfd3trial-dev-pfc-saphana-odatav4-srv.cfapps.us10-001.hana.ondemand.com/CatalogService/"
        });

        if (oModel && sId) {
          var oContext = oModel.createBindingContext(sPath);
          oModel.setProperty("Entregado", true, oContext);

          oModel.submitChanges({
            success: function () {
              sap.m.MessageToast.show("El envío se ha marcado como entregado correctamente.");

              var sIdConductor = oEnvio.idConductor;
              if (sIdConductor) {
                var sConductorPath = "/Conductor('" + sIdConductor + "')";
                var oConductorContext = oModel.createBindingContext(sConductorPath);
                oModel.setProperty("Ocupado", false, oConductorContext);

                oModel.submitChanges({
                  success: function () {
                    sap.m.MessageToast.show("El estado del conductor ha sido actualizado correctamente.");
                  },
                  error: function () {
                    sap.m.MessageToast.show("Error al actualizar el estado del conductor.");
                  }
                });
              }

              var sMatricula = oEnvio.Matricula;
              if (sMatricula) {
                var sVehiculoPath = "/Vehiculos('" + sMatricula + "')";
                var oVehiculoContext = oModel.createBindingContext(sVehiculoPath);
                oModel.setProperty("Ocupado", false, oVehiculoContext);

                oModel.submitChanges({
                  success: function () {
                    sap.m.MessageToast.show("El estado del vehículo ha sido actualizado correctamente.");
                  },
                  error: function () {
                    sap.m.MessageToast.show("Error al actualizar el estado del vehículo.");
                  }
                });
              }
            },
            error: function () {
              sap.m.MessageToast.show("Error al actualizar el envío.");
            }
          });
        }

      }






    





    });
  });