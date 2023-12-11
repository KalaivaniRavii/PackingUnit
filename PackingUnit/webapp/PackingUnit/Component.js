sap.ui.define([
	"sap/dm/dme/podfoundation/component/production/ProductionUIComponent",
	"sap/ui/Device"
], function (ProductionUIComponent, Device) {
	"use strict";

	return ProductionUIComponent.extend("shoubii.custom.plugins.PackingUnit.PackingUnit.Component", {
		metadata: {
			manifest: "json"
		}
	});
});