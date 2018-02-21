define([
  "dojo/_base/declare",
  "dojox/mvc/getPlainValue",
  "dojox/mvc/at",
  "dojox/mvc/getStateful",
  "dojo/when",
  "aps/View",
  "aps/ResourceStore"
],
  function (declare, getPlainValue, at, getStateful, when, View, ResourceStore ) {
    var city;
    return declare(View, {
      init: function () {
        city = getStateful({
            "aps": { "type": "http://myweatherdemo.com/city/1.0", "subscription": "" },
            "city": "", "country": "", "units": "celsius", "include_humidity": false });
        return ["aps/Panel", { title: "New City" }, [
            ["aps/FieldSet", [
                ["aps/TextBox", { label: "City", required: true,
                    value: at(city, "city") }],
                ["aps/TextBox", { label: "Country", required: true,
                    value: at(city, "country") }],
                ["aps/Select", { title: "Units", gridSize: "md-3",
                    value: at(city, "units"),
                    options: [{ label: "celsius", value: "celsius" },
                        { label: "fahrenheit", value: "fahrenheit" }]}],
                ["aps/CheckBox", { checked: at(city, "include_humidity"),
                    description: "Get Humidity" }]]]]]; },
      onCancel: function () { aps.apsc.gotoView("company"); },
      onSubmit: function () {
        city.aps.subscription = aps.context.vars.company.aps.subscription;
        var store = new ResourceStore({ target: "/aps/2/resources/" + aps.context.vars.company.aps.id + "/cities" });
        when(store.put(getPlainValue(city)), function () {
            aps.apsc.gotoView("company"); }); }}); });
