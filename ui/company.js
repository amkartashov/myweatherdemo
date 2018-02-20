define([
  "dojo/_base/declare",
  "aps/_View",
  "aps/xhr",
  "dijit/registry"
], function (declare, _View, xhr, registry) {
  return declare(_View, {
    init: function () {
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
              ["aps/Output", {id: "passwordid", label: "Password", value: "", gridSize: "md-4" }]]]]]]]; },
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
      aps.apsc.hideLoading(); }});});
