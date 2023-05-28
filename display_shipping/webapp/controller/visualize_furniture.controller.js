sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/odata/v4/ODataModel"
], function (Controller, JSONModel, ODataModel) {
  "use strict";

  return Controller.extend("displayshipping.controller.visualize_furniture", {
    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("visualize_furniture").attachPatternMatched(this._onObjectMatched, this);
    },

    _onObjectMatchedForniture: function (oEvent) {
      // Obtén los parámetros de la URL o cualquier otro dato necesario
      var oArguments = oEvent.getParameter("arguments");
      var sContext = oArguments.context;
console.log(sContext)
    }
  });
});
