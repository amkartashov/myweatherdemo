define([
  "dojo/_base/declare",
  "dojox/mvc/getPlainValue",
  "dojox/mvc/at",
  "dojox/mvc/getStateful",
  "dojo/when",
  "aps/View",
  "aps/ResourceStore",
  "dojo/text!./city.json"
],
  function (declare, getPlainValue, at, getStateful, when, View, ResourceStore, city ) {
    var store = new ResourceStore({ target: "/aps/2/resources" });
    aps.app.model.set("city", getStateful(JSON.parse(city)));
    return declare(View, {
      init: function () {
        return ["aps/Panel", { title: "Edit City", id: "panelCityEdit" }, [
            ["aps/FieldSet", [
                ["aps/TextBox", { label: "City", required: true,
                    value: at(aps.app.model.city, "city") }],
                ["aps/TextBox", { label: "Country", required: true,
                    value: at(aps.app.model.city, "country") }],
                ["aps/Select", { title: "Units", gridSize: "md-3",
                    value: at(aps.app.model.city, "units"),
                    options: [{ label: "celsius", value: "celsius" },
                        { label: "fahrenheit", value: "fahrenheit" }]}],
                ["aps/CheckBox", { checked: at(aps.app.model.city, "include_humidity"),
                    description: "Get Humidity" }]]]]]; },
      onContext: function () {
        store.get(aps.context.vars.city.aps.id).then(function (editcity) {
          aps.app.model.set("city", getStateful(editcity));
          aps.apsc.hideLoading(); }); },
      onCancel: function () { aps.apsc.gotoView("company"); },
      onHide: function () { aps.app.model.set("city", getStateful(JSON.parse(city))); },
      onSubmit: function () {
        var form = this.byId("panelCityEdit");
        if (!form.validate()) {
          aps.apsc.cancelProcessing();
          return; }
        when(store.put(getPlainValue(aps.app.model.city)), function () {
            aps.apsc.gotoView("company"); }); }}); });
