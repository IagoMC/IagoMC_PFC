sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/routing/History",

], function (Controller, Filter, FilterOperator, History) {
  "use strict";

  return Controller.extend("displayshipping.controller.visualize_furniture", {
    onInit: function () {
      // Obtener la referencia al enrutador de la aplicación
      var oRouter = this.getOwnerComponent().getRouter();
      // Asociar el controlador de eventos "_onObjectMatched" al evento "patternMatched" de la ruta "visualize_furniture"
      oRouter.getRoute("visualize_furniture").attachPatternMatched(this._onObjectMatchedFurniture, this);
    },

            //Crea una tabla con los datos del id del mueble recibido
          _onObjectMatchedFurniture: function (oEvent) {
              // Obtener el identificador del mueble desde los parámetros de la ruta
             var sFurnitureId = oEvent.getParameter("arguments").context;
              // Obtener la referencia a la tabla de muebles en la vista
              var oTable = this.getView().byId("furnitureTable");
              // Obtener el enlace de datos de la tabla
        var oBinding = oTable.getBinding("items");
              // Crear un filtro para el campo "id" que coincide con el identificador del mueble
              var oFilter = new Filter("id", FilterOperator.EQ, sFurnitureId);
              // Aplicar el filtro a la tabla de muebles
              oBinding.filter([oFilter]);
            },

    //Permite volver atras
    onNavBack: function () {
      // Si hay un hash anterior, retroceder en la historia del navegador
      window.history.go(-1);

    },



  });
});