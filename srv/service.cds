using { API_SALES_ORDER_SRV as external1 } from './external/API_SALES_ORDER_SRV';
using { API_MATERIAL_STOCK_SRV as external2 } from './external/API_MATERIAL_STOCK_SRV';
using { API_MATERIAL_DOCUMENT_SRV_0001 as external3 } from './external/API_MATERIAL_DOCUMENT_SRV_0001';

service SalesService {

     action transfer(
        Material: String,
        Plant: String,
        StorageLocation: String,
        Batch: String,
        AvailableQuantity: String,
        BaseUnit: String,
        SDDocument: String,
        SDDocumentItem: String,
        
    ) returns Boolean;


    
action getCSRFToken() returns String;
    entity SalesOrder as projection on external1.A_SalesOrder{
        key SalesOrder,
        to_Item,
        SoldToParty,
        null as SalesOrderItem:String(100),
        null as Material:String(100),
        null as RequestedQuantity:String(100),
        null as RequestedQuantityUnit:String(100)
        
        
    }actions{
        action materialDetails() returns array of {
            Material: String(100);
            Plant: String(100);
            Batch: String(100);
            StorageLocation: String(100);
            MatlWrhsStkQtyInMatlBaseUnit:String(100);
            SDDocument:String(100);
            SDDocumentItem:String(100);
            MaterialBaseUnit:String(10)
        }
    };

    entity SalesOrderItem as projection on external1.A_SalesOrderItem{
        SalesOrder,
        key SalesOrderItem,
        Material,
        RequestedQuantity,
        RequestedQuantityUnit
    };

    entity Material as projection on external2.A_MaterialStock{
        Material,
        to_MatlStkInAcctMod,
        null as MaterialStock:String(100),
        null as Plant:String(100),
        null as Batch:String(100),
        null as StorageLocation:String(100),
        
        
    };

    entity MaterialStock as projection on external2.A_MatlStkInAcctMod{
        Material,
        Plant,
        Batch,
        StorageLocation,
        MatlWrhsStkQtyInMatlBaseUnit,
        SDDocument,
        SDDocumentItem,
        MaterialBaseUnit,
    
        

    
    };

    entity MaterialDocument as projection on external3.A_MaterialDocumentHeader{
        MaterialDocument,
        MaterialDocumentYear,
        DocumentDate,
        PostingDate,
        GoodsMovementCode,
        to_MaterialDocumentItem,
    };

    entity MaterialDocumentItem as projection on external3.A_MaterialDocumentItem{
        MaterialDocument,
        MaterialDocumentYear,
        GoodsMovementType, 
        Material, 
        Plant,
        StorageLocation, 
        QuantityInEntryUnit, 
        EntryUnit,
        Batch,
        InventorySpecialStockType, 
        IssgOrRcvgMaterial, 
        IssuingOrReceivingPlant, 
        IssuingOrReceivingStorageLoc,
        IssgOrRcvgBatch,
        IssuingOrReceivingValType, 
        SalesOrder,
        SalesOrderItem, 
        SpecialStockIdfgSalesOrder,
        SpecialStockIdfgSalesOrderItem,
        CostCenter
    };

    
}

annotate SalesService.SalesOrder with @(
    UI.SelectionFields: [ SalesOrder],  
    
    
);