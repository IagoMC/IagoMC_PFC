sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"

], function (Controller, MessageToast, JSONModel) {
  "use strict";

  return Controller.extend("createshipments.controller.main", {
    // Función de inicialización del controlador
    onInit: function () {
      // Obtener el modelo asociado a la vista
      var oModel = this.getView().getModel();

      // Vincular la lista de "Muebles" al modelo y procesar los datos
      oModel.bindList("/Muebles", null, null, null, {
        success: function (oData) { // Función de éxito de la vinculación de datos
          var aMuebles = oData.getModel().getProperty("/");// Obtener los muebles del modelo
          this.furnitureArray = furnitureArray; // Array para almacenar los muebles
          // Itera sobre la lista de muebles y crea un objeto para cada uno

          for (var i = 0; i < aMuebles.length; i++) {
            var mueble = aMuebles[i];
            var furnitureItem = {
              id: mueble.id,// ID del mueble
              Nombre: mueble.Nombre,// Nombre del mueble
              Cantidad: null // Cantidad inicialmente nula
            };
            furnitureArray.push(furnitureItem);// Agregar el mueble al array
          }
          // Crear un modelo local con los muebles

          var oLocalModel = new JSONModel({
            furniture: furnitureArray
          });

          // Establecer el modelo local en la vista
          this.getView().setModel(oLocalModel, "localModel");
        }.bind(this),
        // Función de error de la vinculación de datos
        error: function (oError) {
          // Mostrar el error en la consola
          console.log(oError);
        }
      });
    },


    // Función para asociar la cantidad a un mueble, cuando introducimos un numero en el input
    updateAmount: function (oEvent) {
      // Obtiene el valor ingresado en el campo de cantidad

      var sValue = oEvent.getParameter("value"); // Obtener el valor del campo de entrada
      var oBindingContext = oEvent.getSource().getBindingContext("localModel"); // Obtener el contexto de enlace y la ruta
      var sPath = oBindingContext.getPath();
      var oModel = oBindingContext.getModel();// Obtener el modelo y los datos actuales
      var oData = oModel.getProperty(sPath);
      var oUpdatedData = Object.assign({}, oData, { Cantidad: sValue });
      // Actualiza el array de muebles con la nueva cantidad

      this.furnitureArray[oBindingContext.getIndex()] = oUpdatedData; // Actualizar los datos con la nueva cantidad
      oModel.setProperty(sPath, oUpdatedData);
    },

    // Función para realizar la búsqueda en la tabla "furnitureTable"
    onSearch: function (oEvent) {
      // Obtiene el valor ingresado en el campo de búsqueda

      var sValue = oEvent.getParameter("query");  // Obtener el valor de búsqueda
      var oTable = this.getView().byId("furnitureTable");// Obtener la tabla de muebles
      var oBinding = oTable.getBinding("items");// Obtener el enlace de los elementos de la tabla

      //Comprobar que "sValue" no esta vacio
      if (sValue) {
        // Crear un filtro en base al nombre del mueble
        var oFilter = new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, sValue);
        // Aplicar el filtro a la tabla
        oBinding.filter(oFilter);
      } else {
        // Borrar cualquier filtro aplicado a la tabla
        oBinding.filter([]);
      }
    },


    // Crea los paquetes asociados al envio
    createPaquetesMuebles: function (sLastEnvioId) {
      // Obtiene la vista actual
      var oView = this.getView();
      // Obtener los valores de los campos del formulario

      var oModel = oView.getModel("localModel");
      var furnitureArray = oModel.getProperty("/furniture");

      var sLastEnvioId = this.getView().getModel("i18n").getResourceBundle().getText("lastEnvioId"); // Obtén el ID de envío desde algún lugar, como un modelo o una propiedad del controlador
      // Iterar sobre el array de muebles

      for (var i = 0; i < furnitureArray.length; i++) {
        var furnitureItem = furnitureArray[i];
        var cantidad = furnitureItem.Cantidad;
        // Verificar si la cantidad de muebles es mayor que cero

        if (cantidad > 0) {
          var idMueble = furnitureItem.id;
          var sMueblesPath = "/Muebles('" + idMueble + "')";
          // Obtener el contexto del modelo de datos para un mueble específico

          //Obtiene un nuevo id a partir del ultimo id de PaquetesMuebles
          oModel.bindContext(sMueblesPath, null, {
            success: function (oData) {
              var muebleData = oData.getModel().getProperty(oData.getPath());

              var aPaquetes = oModel.getProperty("/PaquetesMuebles");
              var iNumber = 0;

              if (aPaquetes.length > 0) {
                var lastId = aPaquetes[0].idPaquete;
                iNumber = parseInt(lastId.substr(2)) + 1;
              }

              var sNewNumberPart = iNumber.toString().padStart(4, "0");
              var sNewId = "PM" + sNewNumberPart;
              // Crear un nuevo objeto PaqueteMueble con los datos necesarios

              var oNewPaqueteMueble = {
                idPaquete: sNewId,
                idEnvio: sLastEnvioId,
                idMueble: muebleData.id,
                Nombre: muebleData.Nombre,
                Tipo: muebleData.Tipo,
                Material: muebleData.Material,
                Dimensiones: muebleData.Dimensiones,
                Peso: muebleData.Peso,
                Cantidad: cantidad,
                idEnvio: sLastEnvioId
              };
              // Crear un nuevo PaqueteMueble en el modelo de datos

              oModel.create("/PaquetesMuebles", oNewPaqueteMueble, {
                success: function () {
                  // Mostrar un mensaje de éxito en caso de que la creación sea exitosa

                  MessageToast.show(oView.getModel("i18n").getResourceBundle().getText("PaquetesMueblesCreated"));
                },
                error: function () {
                  // Mostrar un mensaje de error en caso de que haya un problema al crear el paquete

                  MessageToast.show(oView.getModel("i18n").getResourceBundle().getText("errorPaquetesMuebles"));
                }
              });
            },
            error: function () {
              // Mostrar un mensaje de error si no se puede obtener el mueble del modelo de datos

              MessageToast.show(oView.getModel("i18n").getResourceBundle().getText("errorFetchingFurniture"));
            }
          });
        }
      }
    },


    // Función para crear un envío
    onCreateShipment: function () {
      var oView = this.getView();// Obtener la vista

      // Obtener los valores de los campos del formulario
      var oForm = oView.byId("shippingData");
      var oFormElements = oForm.getFormContainers()[0].getFormElements();
      var oFormData = {};

      //Recorre los elementos del formulario
      oFormElements.forEach(function (oFormElement) {
        var sLabel = oFormElement.getFields()[0].getId();
        var oField = oFormElement.getFields()[0];
        var sValue;

        // Validar si el campo es un DatePicker y formatear la fecha
        if (oField instanceof sap.m.DatePicker) {
          var oDate = oField.getDateValue();
          sValue = oDate ? oDate.toISOString().split("T")[0] : "";
        } else {
          sValue = oField.getValue();
        }

        oFormData[sLabel] = sValue;
      });

      // Validar la fecha de llegada
      var dStartDate = new Date(oFormData["shippingData--FechaSalida"]);
      var dEndDate = new Date(oFormData["shippingData--FechaLlegada"]);

      if (dEndDate < dStartDate) {
        MessageToast.show(oView.getModel("i18n").getResourceBundle().getText("errorDate"));
        return; // Detener la ejecución de la función si la fecha de llegada es inferior a la de salida
      }

      // Obtener el último ID de /Envios y generar el nuevo ID
      var oModel = this.getOwnerComponent().getModel();
      var sLastEnvioId = "";

      oModel.bindList("/Envios", null, null, null, {
        success: function (oData) {
          var aEnvios = oData.getModel().getProperty("/");
          if (aEnvios.length > 0) {
            var sLastId = aEnvios[aEnvios.length - 1].id;
            var sNumberPart = sLastId.substr(2); // Obtener los últimos cuatro dígitos
            var iNumber = parseInt(sNumberPart); // Convertir a número entero
            iNumber++; // Incrementar en 1
            var sNewNumberPart = iNumber.toString().padStart(4, "0"); // Convertir nuevamente a cadena y rellenar con ceros a la izquierda si es necesario
            sLastEnvioId = "EN" + sNewNumberPart; // Generar el nuevo ID de envío
          }

          // Crear el nuevo envío
          var oNewEnvio = {
            id: sLastEnvioId,
            fechaSalida: oFormData["shippingData--FechaSalida"],
            fechaLlegada: oFormData["shippingData--FechaLlegada"],
            origen: oFormData["shippingData--Origen"],
            destino: oFormData["shippingData--Destino"],
            idConductor: oFormData["shippingData--idConductorSelect"],
            matricula: oFormData["shippingData--idVehiculoSelect"]
          };

          oModel.create("/Envios", oNewEnvio, {
            success: function () {
              MessageToast.show(oView.getModel("i18n").getResourceBundle().getText("shipmentCreated"));
              this.createPaquetesMuebles(sLastEnvioId);

            },
            error: function () {
              MessageToast.show(oView.getModel("i18n").getResourceBundle().getText("errorCreatingShipment"));
            }
          });
        },
        error: function (oError) {
          MessageToast.show(oView.getModel("i18n").getResourceBundle().getText("errorFetchingData"));
        }
      });
    }







  });
});