

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
            onSearch: function() {
                var oView = this.getView();
                var sValue = oView.byId("searchField").getValue();
                var oTable = oView.byId("shippingTable");
                var oBinding = oTable.getBinding("items");
                
                if (sValue) {
                  var oFilter = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, sValue);
                  var deliveryStatusFilter = new sap.ui.model.Filter("Entregado", sap.ui.model.FilterOperator.EQ, this.isDelivered);
                  var oCombinedFilter = new sap.ui.model.Filter([oFilter, deliveryStatusFilter], true);
                  oBinding.filter(oCombinedFilter, sap.ui.model.FilterType.Application);
                  
                  oBinding.attachEventOnce("dataReceived", function() {
                    var aItems = oBinding.getCurrentContexts();
                    
                    if (aItems.length === 0) {
                      var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                      var sMessage = oResourceBundle.getText("noShipmentsFound");
                      sap.m.MessageToast.show(sMessage);
                    }
                  }.bind(this));
                } else {
                  if (this.isDelivered !== undefined) {
                    var deliveryStatusFilter = new sap.ui.model.Filter("Entregado", sap.ui.model.FilterOperator.EQ, this.isDelivered);
                    oBinding.filter(deliveryStatusFilter, sap.ui.model.FilterType.Application);
                  } else {
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
                var selectedOrigin = this.byId("originComboBox").getSelectedKey();
                var selectedDestination = this.byId("destinationComboBox").getSelectedKey();

                var oTable = this.byId("shippingTable");
                var oBinding = oTable.getBinding("items");
                var oFilters = [];

                if (selectedOrigin) {
                    var originFilter = new sap.ui.model.Filter("Origen", sap.ui.model.FilterOperator.EQ, selectedOrigin);
                    oFilters.push(originFilter);
                }

                if (selectedDestination) {
                    var destinationFilter = new sap.ui.model.Filter("Destino", sap.ui.model.FilterOperator.EQ, selectedDestination);
                    oFilters.push(destinationFilter);
                }

                // Agregar filtro para envíos entregados o no entregados según el valor de isDelivered
                var deliveryStatusFilter = new sap.ui.model.Filter("Entregado", sap.ui.model.FilterOperator.EQ, this.isDelivered);
                oFilters.push(deliveryStatusFilter);

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
       
            onInsertDialogConfirm: function(sId) {
                var sPath = "/Envios('" + sId + "')";
                var oModel = new sap.ui.model.odata.v4.ODataModel({
                  serviceUrl: "https://81becfd3trial-dev-pfc-saphana-odatav4-srv.cfapps.us10-001.hana.ondemand.com/CatalogService/"
                });
                
                if (oModel && sId) {
                  oModel.update(sPath, { Entregado: true }, {
                    success: function() {
                      sap.m.MessageToast.show("El envío se ha marcado como entregado correctamente.");
              
                      var sIdConductor = oEnvio.idConductor;
                      if (sIdConductor) {
                        var sConductorPath = "/Conductor('" + sIdConductor + "')";
                        oModel.update(sConductorPath, { Ocupado: false }, {
                          success: function() {
                            sap.m.MessageToast.show("El estado del conductor ha sido actualizado correctamente.");
                          },
                          error: function() {
                            sap.m.MessageToast.show("Error al actualizar el estado del conductor.");
                          }
                        });
                      }
              
                      var sMatricula = oEnvio.Matricula;
                      if (sMatricula) {
                        var sVehiculoPath = "/Vehiculos('" + sMatricula + "')";
                        oModel.update(sVehiculoPath, { Ocupado: false }, {
                          success: function() {
                            sap.m.MessageToast.show("El estado del vehículo ha sido actualizado correctamente.");
                          },
                          error: function() {
                            sap.m.MessageToast.show("Error al actualizar el estado del vehículo.");
                          }
                        });
                      }
                    },
                    error: function() {
                      sap.m.MessageToast.show("Error al actualizar el envío.");
                    }
                  });
                }
              }
              
              
              
              
              

        });
    });