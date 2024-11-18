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
         
            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true    
            };
        
            
            this.editFlow.invokeAction('SalesService.materialDetails', mParameters)
                .then(function(result) {
                    const materialDetailsArray = result.getObject().value;
                
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
                                header: new Text({ text: "Available Quantity" })
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
                                text: 'Transfer Stock',
                                enabled: false,
                                press: function () {
                                    console.log(mParameters);
                                    console.log(aSelectedContexts[0].sPath);
                                    const sPath = aSelectedContexts[0].sPath; // /SalesOrder('969')
                                    const salesOrderNumber = sPath.match(/'([^']+)'/)[1];
                                    console.log('Sales Order Number:', salesOrderNumber);

                                    
                                    var oSelectedItem = oTable.getSelectedItem();
                                    if (oSelectedItem) {
                                        var aCells = oSelectedItem.getCells();
                                        var oData = {
                                            Material: aCells[0].getText(),
                                            Plant: aCells[1].getText(),
                                            StorageLocation: aCells[2].getText(),
                                            Batch: aCells[3].getText(),
                                            AvailableQuantity: aCells[4].getText(),
                                            BaseUnit: aCells[5].getText(),
                                            SDDocument: aCells[6].getText(),
                                            SDDocumentItem: aCells[7].getText(),
                                            
                                        };

                                        jQuery.ajax({
                                            url: "/odata/v4/sales/getCSRFToken()",
                                            type: "GET",
                                            headers: {
                                              "X-CSRF-Token": "fetch",
                                            },
                                            success: function (data, status, xhr) {
                                                console.log("token:",xhr.getResponseHeader("X-CSRF-Token"))
                                            jQuery.ajax({
                                            url: "/odata/v4/sales/transfer",
                                            type: "POST",
                                            contentType: "application/json",
                                            headers: {
                                                "X-CSRF-Token": xhr.getResponseHeader("X-CSRF-Token"),
                                              },
                                            data: JSON.stringify(oData ),
                                            success: function (result) {
                                               
                                                MessageToast.show("Transfered successfull");
                                                
                                            },
                                            error: function (error) {
                                                                                               
                                                console.error("Error triggering :", error);
                                                MessageBox.error("Transfered unsuccessfull");
                                            }
                                        });
                                    },
                                        error: function (error) {
                                            console.error("Error :", error);
                                        }
                                    });
                                    } else {
                                        MessageToast.show("No material selected!");
                                    }
                                }
                            })
                        ],
                        afterClose: function () {
                            oDialog.destroy(); 
                        }
                    });
                    oDialog.open();
                })
                .catch(function (error) {
                    console.error('Error invoking action:', error);
                    MessageToast.show('Failed to retrieve material details.');
                });
        }
    };
});
