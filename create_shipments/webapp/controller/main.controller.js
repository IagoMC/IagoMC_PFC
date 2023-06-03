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

      /*
      var oModel = new JSONModel();
      this.getView().setModel(oModel, "localModel");

      var oBinding = oModel.bindList({
        path: "/Muebles",
        events: {
          dataReceived: function (oEvent) {
            var aMuebles = oBinding.getContexts().map(function(oContext) {
              return oContext.getObject();
            });

            var furnitureArray = [];
            for (var i = 0; i < aMuebles.length; i++) {
              var mueble = aMuebles[i];
              var localObj = {
                id: mueble.id,
                Nombre: mueble.Nombre,
                Cantidad: 0
              };
              furnitureArray.push(localObj);
            }
          }
        }
      });
      */
    },

    /*
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
*/
    onSearch: function (oEvent) {
      var sValue = oEvent.getParameter("query");
      var oTable = this.getView().byId("furnitureTable");
      var oBinding = oTable.getBinding("items");

      if (sValue) {
        var oFilter = new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, sValue);
        oBinding.filter(oFilter);
      } else {
        oBinding.filter([]);
      }
    },
    associateQuantityWithId: function (oEvent) {

    },

    mostrarUltimoId: function () {
      var oModel = new sap.ui.model.odata.v4.ODataModel({
        serviceUrl: "https://81becfd3trial-dev-pfc-saphana-odatav4-srv.cfapps.us10-001.hana.ondemand.com/CatalogService/",
        synchronizationMode: "None"
      });
    
      var oView = this.getView();
      var oTable = oView.byId("furnitureTable");
      var oBinding = oTable.getBinding("items");
    
      oModel.metadataLoaded().then(function () {
        oBinding.attachEventOnce("dataReceived", function () {
          var aMuebles = oBinding.getCurrentContexts().map(function (oContext) {
            return oContext.getObject();
          });
    
          var lastMuebleId = aMuebles[aMuebles.length - 1].id;
          var oJSONModel = new sap.ui.model.json.JSONModel({
            value: lastMuebleId
          });
          oView.setModel(oJSONModel, "lastMuebleId");
        });
      });
    }






  });
});