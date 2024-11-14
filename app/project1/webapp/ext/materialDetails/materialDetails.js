// sap.ui.define([
//     "sap/m/MessageToast",
//     "sap/m/Dialog",
//     "sap/m/Button",
//     "sap/m/List",
//     "sap/m/StandardListItem"
// ], function(MessageToast, Dialog, Button, List, StandardListItem) {
//     'use strict';

//     return {
//         materialDetails: function(oBindingContext, aSelectedContexts) {
//             console.log(aSelectedContexts);
//             let mParameters = {
//                 contexts: aSelectedContexts[0],
//                 label: 'Confirm',
//                 invocationGrouping: true    
//             };
//             this.editFlow.invokeAction('SalesService.materialDetails', mParameters)
//                 .then(function(result) {
//                     const materialDetailsArray = result.getObject().value;
//                     console.log('Material Details:', materialDetailsArray);

//                     let oList = new List({
//                         items: {
//                             path: '/',
//                             template: new StandardListItem({
//                                 title: "{Material}",
//                                 description: "Plant: {Plant}, Storage Location: {StorageLocation}, Batch: {Batch}"
//                             })
//                         }
//                     });

//                     oList.setModel(new sap.ui.model.json.JSONModel(materialDetailsArray));

//                     let oDialog = new Dialog({
//                         title: 'Material Details',
//                         contentWidth: "600px",
//                         contentHeight: "500px",
//                         verticalScrolling: true,
//                         content: [oList], 
//                         buttons: [
//                             new Button({
//                                 text: 'Close',
//                                 press: function () {
//                                     oDialog.close();
//                                 }
//                             })
//                         ],
//                         afterClose: function() {
//                             oDialog.destroy();
//                         }
//                     });

//                     oDialog.open();
//                 });
//         }
//     };
// });


// sap.ui.define([
//     "sap/m/Dialog",
//     "sap/m/Button",
//     "sap/m/Table",
//     "sap/m/Column",
//     "sap/m/ColumnListItem",
//     "sap/m/Text",
//     "sap/m/MessageToast"
// ], function(Dialog, Button, Table, Column, ColumnListItem, Text, MessageToast) {
//     'use strict';

//     return {
//         materialDetails: function(oBindingContext, aSelectedContexts) {
//             console.log(aSelectedContexts);
//             let mParameters = {
//                 contexts: aSelectedContexts[0],
//                 label: 'Confirm',
//                 invocationGrouping: true    
//             };
//             this.editFlow.invokeAction('SalesService.materialDetails', mParameters)
//                 .then(function(result) {
//                     const materialDetailsArray = result.getObject().value;
//                     console.log('Material Details:', materialDetailsArray);

//                     let oTable = new Table({
//                         width: "100%",
//                         mode: sap.m.ListMode.SingleSelectLeft,
//                         growing: true,
//                         selectionChange: function(oEvent) {
//                             var oSelectedItem = oEvent.getParameter("listItem");
//                             var sMaterialNumber = oSelectedItem.getCells()[0].getText();
//                             console.log("Selected Material Number: " + sMaterialNumber);
//                         },
//                         columns: [
//                             new Column({
//                                 header: new Text({ text: "Material" })
//                             }),
//                             new Column({
//                                 header: new Text({ text: "Plant" })
//                             }),
//                             new Column({
//                                 header: new Text({ text: "Storage Location" })
//                             }),
//                             new Column({
//                                 header: new Text({ text: "Batch" })
//                             }),
//                             new Column({
//                                 header: new Text({ text: "Quantity" })
//                             })
//                         ],
//                         items: materialDetailsArray.map(function(detail) {
//                             return new ColumnListItem({
//                                 cells: [
//                                     new Text({ text: detail.Material }),
//                                     new Text({ text: detail.Plant }),
//                                     new Text({ text: detail.StorageLocation }),
//                                     new Text({ text: detail.Batch }),
//                                     new Text({ text: detail.MatlWrhsStkQtyInMatlBaseUnit })
//                                 ]
//                             });
//                         })
//                     });

//                     let oDialog = new Dialog({
//                         title: 'Material Details',
//                         contentWidth: "600px",
//                         contentHeight: "500px",
//                         verticalScrolling: true,
//                         content: [oTable],
//                         buttons: [
//                             new Button({
//                                 text: 'Close',
//                                 press: function () {
//                                     oDialog.close();
//                                 }
//                             }),
//                             new Button({
//                                 text: 'Show Material Number',
//                                 press: function () {
//                                     // Get the selected row
//                                     var oSelectedItem = oTable.getSelectedItem();
//                                     if (oSelectedItem) {
//                                         // Get the material number from the selected row
//                                         var sMaterialNumber = oSelectedItem.getCells()[0].getText();
//                                         // Show the material number in a MessageToast
//                                         MessageToast.show("Selected Material Number: " + sMaterialNumber);
//                                     } else {
//                                         // If no row is selected, show a message
//                                         MessageToast.show("No material selected!");
//                                     }
//                                 }
//                             })
//                         ],
//                         afterClose: function() {
//                             oDialog.destroy();
//                         }
//                     });

//                     oDialog.open();
//                 });
//         }
//     };
// });


sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/MessageToast"
], function(Dialog, Button, Table, Column, ColumnListItem, Text, MessageToast) {
    'use strict';

    return {
        materialDetails: function(oBindingContext, aSelectedContexts) {
            console.log(aSelectedContexts);
            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true    
            };
            this.editFlow.invokeAction('SalesService.materialDetails', mParameters)
                .then(function(result) {
                    const materialDetailsArray = result.getObject().value;
                    console.log('Material Details:', materialDetailsArray);

                    let oTable = new Table({
                        width: "100%",
                        mode: sap.m.ListMode.SingleSelectLeft,
                        growing: true,
                        selectionChange: function(oEvent) {
                            var oSelectedItem = oEvent.getParameter("listItem");
                            var oShowMaterialButton = oDialog.getButtons()[1]; 
                            if (oSelectedItem) {
                                oShowMaterialButton.setEnabled(true);
                            } else {
                                oShowMaterialButton.setEnabled(false);
                            }
                        },
                        columns: [
                            new Column({
                                header: new Text({ text: "Material" })
                            }),
                            new Column({
                                header: new Text({ text: "Plant" })
                            }),
                            new Column({
                                header: new Text({ text: "Storage Location" })
                            }),
                            new Column({
                                header: new Text({ text: "Batch" })
                            }),
                            new Column({
                                header: new Text({ text: "Avaliable Quantity" })
                            }),
                            new Column({
                                header: new Text({ text: "Material Base Unit" })
                            }),
                            new Column({
                                header: new Text({ text: "SD Document" })
                            }),
                            new Column({
                                header: new Text({ text: "SD Document Item" })
                            })
                        ],
                        items: materialDetailsArray.map(function(detail) {
                            return new ColumnListItem({
                                cells: [
                                    new Text({ text: detail.Material }),
                                    new Text({ text: detail.Plant }),
                                    new Text({ text: detail.StorageLocation }),
                                    new Text({ text: detail.Batch }),
                                    new Text({ text: detail.MatlWrhsStkQtyInMatlBaseUnit }),
                                    new Text({ text: detail.MaterialBaseUnit }),
                                    new Text({ text: detail.SDDocument }),
                                    new Text({ text: detail.SDDocumentItem })
                                ]
                            });
                        })
                    });

                    let oDialog = new Dialog({
                        title: 'Material Details',
                        contentWidth: "900px",
                        contentHeight: "700px",
                        verticalScrolling: true,
                        content: [oTable],
                        buttons: [
                            new Button({
                                text: 'Close',
                                press: function () {
                                    oDialog.close();
                                }
                            }),
                            new Button({
                                text: 'Show Material Number',
                                enabled: false,
                                press: function () {
                                
                                    var oSelectedItem = oTable.getSelectedItem();
                                    if (oSelectedItem) {
                                        var sMaterialNumber = oSelectedItem.getCells()[0].getText();
                                        MessageToast.show("Selected Material Number: " + sMaterialNumber);
                                    } else {
                                        MessageToast.show("No material selected!");
                                    }
                                }
                            })
                        ],
                        afterClose: function() {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();
                });
        }
    };
});
