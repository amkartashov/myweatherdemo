define([
  "dojo/_base/declare",
  "aps/_View",
  "aps/xhr",
  "dijit/registry",
  "aps/ResourceStore",
  "dojo/when",
  "aps/Container",
  "aps/Button"
], function (declare, _View, xhr, registry, Store, when, Container, Button){
  return declare(_View, {
    init: function () {
      var cityStore = new Store({
        apsType: "http://myweatherdemo.com/city/1.1",
        target: "/aps/2/resources/" });
      var remove = function () {
        /* Get confirmation from the user for the delete operation */
        if (!confirm("Are you sure you want delete city?")) { this.cancel(); return; }
        var grid = registry.byId("citiesGrid");
        var sel = grid.get("selectionArray");
        var counter = sel.length;
        sel.forEach(function (cityID) {
          /* Remove the city from the APS controller DB */
          when(cityStore.remove(cityID),
               /* If success, process the next city until the list is empty */
               function () {
                 sel.splice(sel.indexOf(cityID), 1);
                 grid.refresh();
                 if (--counter === 0) { registry.byId("btnCityDel").cancel(); }
               }.bind(this)); }); };
      var statuscell = function(row, status) {
        // if a resource in aps:provisioning status hasn't been updated
        // for a long time (25 seconds) this means that the task has failed
        var T25SECONDS = 25000,
        last_updated = Date.parse(row.aps.modified),
        current = Date.now();
        return (row.aps.status !== "aps:provisioning" || last_updated + T25SECONDS > current) ? status : "Failed"; };
      var operationscell = function(row) {
        var con = new Container({});
        var editButton = new Button({
          label: "Edit",
          onClick: function() { aps.apsc.gotoView("city-edit", row.aps.id); }});
        var deleteButton = new Button({
          label: "Delete",
          onClick: function() { cityStore.remove(row.aps.id); }});
        switch (row.status) {
        case 'provisioned':
          con.addChild(editButton);
          con.addChild(deleteButton);
          break;
        case 'country_not_found':
          con.addChild(deleteButton);
        }
        return con; };
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
                id: "btnCityNew", iconClass: "fa-plus",
                type: "primary", label: "New", autoBusy: false,
                onClick: function() { aps.apsc.gotoView("city-new"); } }],
              ["aps/ToolbarButton", {
                id: "btnCityDel", iconClass: "fa-trash", type: "danger",
                label: "Delete", requireItems: true, onClick: remove }]]],
            ["aps/Grid", { id: "citiesGrid", store: cityStore, selectionMode: "multiple",
                columns: [
                  {field: "city", name: "City", type: "resourceName"},
                  {field: "country", name: "Country", type: "string"},
                  {field: "units", name: "Units", type: "string"},
                  {field: "include_humidity", name: "Get humidity", type: "boolean"},
                  {field: "status", name: "Status", renderCell: statuscell},
                  {field: "operations", name: "Operations", renderCell: operationscell}]}]]]]]; },
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
