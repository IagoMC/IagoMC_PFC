sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/odata/v4/ODataModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/m/Text"

], function (Controller, ODataModel, Filter, FilterOperator, Sorter, MessageToast, JSONModel, Text) {
  "use strict";

  return Controller.extend("createshipments.controller.main", {
    onInit: function () {
     this.mostrarUltimoId();
    },

    mostrarUltimoId: function () {
     
      var oModel = this.getOwnerComponent().getModel();
      
      var oView = this.getView();
 
      
      oModel.read("/Envios", {
        success: function (oData) {
          var lastEnvioId = oData.results[oData.results.length - 1].id;
          var oJSONModel = new sap.ui.model.json.JSONModel({
            value: lastEnvioId
          });
          oView.setModel(oJSONModel, "lastEnvioId");
        },
        error: function (oError) {
          console.log(oError);
        }
      });
     }, 

    onSearch: function (event) {
      // Obtener el valor de búsqueda ingresado
      var query = event.getParameter("query");

      var filter = new Filter("Nombre", FilterOperator.Contains, query);

      // Obtener la referencia al modelo de datos
      var oModel = this.getView().getModel();

      // Obtener la referencia a la tabla
      var table = this.getView().byId("mueblesTable");

      // Obtener la referencia al enlace de la tabla y aplicar el filtro
      var binding = table.getBinding("items");
      binding.filter(filter);
    }
  });
});