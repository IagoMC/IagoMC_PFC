sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"    
  ], function (Controller, ODataModel,Filter, FilterOperator) {
    "use strict";

        return Controller.extend("createshipments.controller.main", {
          
            onInit: function () {
                /*
        // Crear el modelo JSON para almacenar los datos
        var oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "main");
  
        // Llamar a la función para obtener y mostrar el próximo ID
        this.getNextId();
      },
  
      // Obtener y mostrar el próximo ID
      getNextId: function () {
        var oModel = new ODataModel({
          serviceUrl: "https://81becfd3trial-dev-pfc-saphana-odatav4-srv.cfapps.us10-001.hana.ondemand.com/CatalogService/",
          synchronizationMode: "None",
          autoExpandSelect: true,
          groupId: "$auto"
        });
  
        var that = this;
  
        oModel.read("/Envios", {
          success: function (oData) {
            var aEnvios = oData.results;
  
            if (aEnvios.length > 0) {
              var lastId = aEnvios[aEnvios.length - 1].id;
              var lastDigits = parseInt(lastId.slice(-4));
              var nextId = (lastDigits + 1).toString();
  
              var oViewModel = that.getView().getModel("main");
              oViewModel.setProperty("/nextId", nextId);
            } else {
              var oViewModel = that.getView().getModel("main");
              oViewModel.setProperty("/nextId", "EN0001");
            }
          },
          error: function (oError) {
            // Manejar el error de lectura del modelo
          }
        });
        */



      },
      onSearch: function(oEvent) {
        var sValue = oEvent.getParameter("query");
        var oTable = this.byId("mueblesTable");
        var oBinding = oTable.getBinding("items");
        var aFilters = [];

        // Filtrar por nombre del mueble
        var oNameFilter = new Filter("Nombre", FilterOperator.EQ, sValue);
   
        aFilters.push(oNameFilter);
        if (!sValue || sValue.length === 0) {
            var oIdFilter = new Filter("id", FilterOperator.StartsWith, "M");
            aFilters.push(oIdFilter);
        }
        // Aplicar los filtros
         oBinding.filter(aFilters, sap.ui.model.FilterType.Control);
      // oBinding.filter(aFilters);
  
    },
    onRefresh: function () {
        var oTable = this.byId("mueblesTable");
        oTable.getBinding("items").refresh();
    },

    });
  });