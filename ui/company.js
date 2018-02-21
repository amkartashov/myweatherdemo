define([
  "dojo/_base/declare",
  "aps/_View",
  "aps/xhr",
  "dijit/registry",
  "aps/ResourceStore"
], function (declare, _View, xhr, registry, Store){
  return declare(_View, {
    init: function () {
      var cityStore = new Store({
        apsType: "http://myweatherdemo.com/city/1.0",
        target: "/aps/2/resources/" });
      
      return ["aps/Tiles", [
        ["aps/Tile", {
          id: "mainid", title: "Company",
          backgroundColor: "#0077aa", fontColor: "#00ff00",
          iconName: "../_static/examples/tiles/o365.png",
          gridSize: "md-4",
          buttons: [
            { id: "btnLogin", title: _('Login'),
              iconClass: "fa-external-link", autoBusy: false,
              onClick: function(){
                window.open("http://www.myweatherdemo.com/login", "_blank"); }},
            { id: "btnEdit", title: _('Edit'),
              iconClass: "fa-external-link", autoBusy: false,
              onClick: function(){
                aps.apsc.showPopup({ viewId: "editcompany", resourceId: null, modal: false }); }}]},
          [["aps/FieldSet", [
              ["aps/Output", {id: "nameid", label: "Name", value: "", gridSize: "md-8"}],
              ["aps/Output", {id: "temperatureid", label: "Temperature (celsius)", value: "", gridSize: "md-4"}],
              ["aps/Output", {id: "passwordid", label: "Password", value: "", gridSize: "md-4" }]]]]],
        ["aps/Tile", {
            id: "citiesid", title: "Cities",
            backgroundColor: "#0077aa", fontColor: "#00ff00", gridSize: "md-12" },
          [
            ["aps/Toolbar", [
              ["aps/ToolbarButton", {
                id: "btnCityNew", iconClass: "fa-plus", autoBusy: false,
                type: "primary", label: "New",
                onClick: function() { aps.apsc.gotoView("city-new"); } }]]],
            ["aps/Grid", { id: "citiesGrid", store: cityStore, selectionMode: "multiple",
                columns: [
                  {field: "city", name: "City", type: "resourceName"},
                  {field: "country", name: "Country", type: "string"},
                  {field: "units", name: "Units", type: "string"},
                  {field: "include_humidity", name: "Get humidity", type: "boolean"}]}]]]]]; },
    onContext: function() {
      var company = aps.context.vars.company;
      this.byId("nameid").set("value", company.username);
      this.byId("passwordid").set("value", company.password);
      this.byId("mainid").set("title", company.company_id);
      xhr('/aps/2/resources/' + aps.context.vars.company.aps.id + '/getTemperature',
        { headers: {"Content-Type": "application/json"}, method: "GET" }
      ).then(function(temperature){
        registry.byId("temperatureid").set("value", temperature);
      });
      this.byId("citiesGrid").refresh();
      aps.apsc.hideLoading(); }});});
