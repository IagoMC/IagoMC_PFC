sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/routing/History",

], function (Controller, Filter, FilterOperator,History) {
  "use strict";

  return Controller.extend("displayshipping.controller.visualize_furniture", {
    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("visualize_furniture").attachPatternMatched(this._onObjectMatched, this);
    },
    _onObjectMatched: function(oEvent) {
      var sFurnitureId = oEvent.getParameter("arguments").context;
      var oTable = this.getView().byId("furnitureTable");
      var oBinding = oTable.getBinding("items");
      
      var oFilter = new Filter("id", FilterOperator.EQ, sFurnitureId);
      oBinding.filter([oFilter]);
    },
    onNavBack: function () {
      // Obtener la instancia del historial de navegación

      var oHistory = History.getInstance();
      // Obtener el hash anterior

        // Si hay un hash anterior, retroceder en la historia del navegador

        window.history.go(-1);
      
    },
   

   
});
});