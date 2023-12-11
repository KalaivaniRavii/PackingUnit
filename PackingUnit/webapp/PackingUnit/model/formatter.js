sap.ui.define([], function () {
    "use strict";

    return {

        Status: function (sStatus) {        

                if (sStatus == "OPEN") {
                    return "Success";
                } else if (sStatus == "CLOSED") {
                    return "Warning";
                }  else {
                    return "Error";
                }
        }
    };
});