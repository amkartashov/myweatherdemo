define([
    "dojo/_base/declare",
    "aps/_View"
], function (declare, _View) {
    return declare(_View, {
        init: function () {
            return ["aps/Tiles", [
        ["aps/Tile", {
                id: "mainid",
                title: "Company",
                backgroundColor: "#0077aa",
                fontColor: "#00ff00",
                iconName: "../_static/examples/tiles/o365.png",
                gridSize: "md-8"

            },
            [
                ["aps/FieldSet", [
                    ["aps/Output", {
                        id: "nameid",
                        label: "Name",
                        value: "nanana",
                        gridSize: "md-8"
                    }],
                    ["aps/Output", {
                        id: "passwordid",
                        label: "Password",
                        value: "no data, blya",
                        gridSize: "md-4"
                    }]
                ]]
            ]
        ]
    ]];
        }
    });
});
