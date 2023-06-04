sap.ui.define([
  "sap/ui/core/mvc/Controller", //Gestiona los controladores en el patrón MVC de SAPUI5.
  "sap/ui/model/Filter",//Crea y gestiona los filtros en el modelo de datos.
  "sap/ui/model/FilterOperator" // Proporciona una lista de operadores predinidos que se usa para filtrar en los modelos de datos
], function (Controller, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("displayshipping.controller.shipping_details", {
      onInit: function () {
      // Obtener la instancia del enrutador
      var oRouter = this.getOwnerComponent().getRouter();
      // Asociar la función "_onObjectMatched" a la ruta "shipping_details" del enrutador
      oRouter.getRoute("shipping_details").attachPatternMatched(this._onObjectMatched, this);
    },

    // Función llamada cuando se realiza una coincidencia de patrón en la ruta "shipping_details"
    _onObjectMatched: function (oEvent) {
      // Obtener el ID del envío de los parámetros de la coincidencia de patrón
      var sIDEnvio = oEvent.getParameter("arguments").context;
      // Vincular la vista actual al elemento del modelo con la ruta correspondiente al ID del envío
      this.getView().bindElement({
        path: "/" + sIDEnvio
      });
      // Crear una tabla de paquetes asociados al envío
      this._createAssociatedPackagesTable(sIDEnvio);
    },

    // Función para crear una tabla de paquetes asociados al envío

    _createAssociatedPackagesTable: function (sIDEnvio) {
      // Obtener la referencia a la tabla de paquetes en la vista actual
      var oTable = this.getView().byId("packagesTable");
      // Obtener el enlace de datos de la tabla
      var oBinding = oTable.getBinding("items");
      // Obtener el ID de envío a partir del ID completo del envío
      var sEnvioID = this._getEnvioIDFromID(sIDEnvio);
      // Crear un filtro para mostrar solo los paquetes asociados al envío específico
      var oFilter = new Filter("idEnvio", FilterOperator.EQ, sEnvioID);
      // Aplicar el filtro al enlace de datos de la tabla
      oBinding.filter([oFilter]);
    },

    // Función para obtener el ID de envío a partir del ID completo del envío
    _getEnvioIDFromID: function (sID) {
      // Extraer el ID de envío entre las comillas del ID completo

      var sEnvioID = sID.substring(sID.indexOf("'") + 1, sID.lastIndexOf("'"));
      return sEnvioID;
    },

    // Función llamada al navegar hacia atrás
    onNavBack: function () {
      // Obtener la instancia del historial de navegación

      // Obtener el hash anterior

        // Si hay un hash anterior, retroceder en la historia del navegador

        window.history.go(-1);
    
    },

    // Función llamada al cambiar la selección de un paquete en la tabla
    onPackageSelectionChange: function (oEvent) {
      // Obtener el elemento seleccionado en la tabla

      var oSelectedItem = oEvent.getParameter("listItem");

      // Obtener el ID de envío del elemento seleccionado

      var sIDEnvio = oSelectedItem.getBindingContext().getProperty("idEnvio");
      // Obtener el ID de envío a partir del ID completo del envío

      var sEnvioID = this._getEnvioIDFromID(sIDEnvio);

      // Realizar las operaciones con el valor de 'sEnvioID' entre las comillas

      // Ejemplo: Mostrar el valor de 'sEnvioID' en la consola
      console.log("Valor de idEnvio:", sEnvioID);
    },

    // Función llamada al presionar el botón "Furniture"

    onFurniturePress: function (oEvent) {
      var oItem = oEvent.getSource();
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("visualize_furniture", {
          context: oItem.getBindingContext().getObject().idMueble
          
      });
    }
  });
});