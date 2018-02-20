define([
  "dojo/_base/declare",
  "aps/_PopupView",
  "aps/xhr"
], function (declare, View, xhr) {
  return declare(View, {
    size: "sm",
    init: function () {
      return [
        "aps/Panel", { id: "edit_form" }, [
          ["aps/FieldSet", [
            ["aps/TextBox", { id: "user", label: "Username", required: true }],
            ["aps/TextBox", { id: "pass", label: "Password", required: true }]]]]]; },
    onContext: function() {
      var company = aps.context.vars.company;
      this.byId("user").set("value", company.username);
      this.byId("pass").set("value", company.password);
      aps.apsc.hideLoading(); },
    onHide: function() { },
    /* Handlers for the navigation buttons */
    onCancel: function() { this.cancel(); },
    onSubmit: function() {
      if (!this.validate()) { aps.apsc.cancelProcessing(); return; }
      var company = aps.context.vars.company;
      var newdata = { "aps": {"type": "http://myweatherdemo.com/company/1.0"},
        "username": this.byId("user").value,
        "password": this.byId("pass").value };
      xhr('/aps/2/resources/' + company.aps.id, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(newdata)
      }).then(this.submit);
      this.submit(); }
  });
});
