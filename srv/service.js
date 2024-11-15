const cds = require('@sap/cds');
require('dotenv').config();
const axios = require('axios');

module.exports = cds.service.impl(async function () {
    const salesorderapi = await cds.connect.to('API_SALES_ORDER_SRV');
    const materialstockapi = await cds.connect.to('API_MATERIAL_STOCK_SRV');
    const materialdocapi=await cds.connect.to('API_MATERIAL_DOCUMENT_SRV_0001')
    let sales
    let mergedData

    this.on('READ', 'SalesOrder', async req => {
        req.query.SELECT.columns = [
            { ref: ['SalesOrder'] },
            { ref: ['SoldToParty'] },
            { ref: ['to_Item'], expand: ['*'] }
        ];

        let res = await salesorderapi.run(req.query);
        res.forEach(element => {
            if (element.to_Item) {
                const item = element.to_Item.find(item => item.SalesOrder === element.SalesOrder);
                if (item) {
                    element.SalesOrderItem = item.SalesOrderItem;
                    element.Material=item.Material;
                    element.RequestedQuantity=item.RequestedQuantity;
                    element.RequestedQuantityUnit=item.RequestedQuantityUnit
                }
            }
        });
        return res;
    });

    this.on('READ', 'Material', async req => {
        req.query.SELECT.columns = [
            { ref: ['Material'] },
            { ref: ['to_MatlStkInAcctMod'], expand: ['*'] }
        ];
        let res = await materialstockapi.run(req.query);
        res.forEach(element => {
            if (element.to_MatlStkInAcctMod) {
                const materialDetail = element.to_MatlStkInAcctMod.find(item => item.Material === element.Material);
                if (materialDetail) {
                    element.Material = materialDetail.Material;
                   
                }
            }
        });
        return res;
    });


    this.on('materialDetails', 'SalesOrder', async (req) => {
      
        const salesOrderId = req.params[0].SalesOrder;
        const salesOrderResult = await salesorderapi.run(
            SELECT.from('A_SalesOrderItem').columns(['SalesOrder','SalesOrderItem', 'Material','RequestedQuantity','RequestedQuantityUnit']).where({ SalesOrder: salesOrderId })
        );
        sales=await salesorderapi.run(
            SELECT.from('A_SalesOrderItem').columns(['SalesOrder','SalesOrderItem','RequestedQuantity']).where({ SalesOrder: salesOrderId }));

        console.log(sales);
        
        if (!salesOrderResult || salesOrderResult.length === 0) {
            return [];
        }
        const materials = [...new Set(salesOrderResult.map(item => item.Material))];
        let materialDetails = [];
        if (materials.length > 0) {
            materialDetails = await materialstockapi.run(
                SELECT.from('A_MatlStkInAcctMod')
                    .columns(['Material', 'Plant', 'Batch', 'StorageLocation','MatlWrhsStkQtyInMatlBaseUnit','SDDocument','SDDocumentItem','MaterialBaseUnit'])
                    .where({ Material: { in: materials } })
            );
        }
        const filteredMaterialDetails = [];
        for (const detail of materialDetails) {
            const saleOrder = detail.SDDocument;
            const orderDetails = await salesorderapi.run(
                SELECT.from('A_SalesOrder')
                    .columns(['SoldToParty'])
                    .where({ SalesOrder: saleOrder })
            );
            if (orderDetails.length > 0 && orderDetails[0].SoldToParty === '1000003' && detail.MatlWrhsStkQtyInMatlBaseUnit > 0) {
                filteredMaterialDetails.push(detail);
            }
        }      
        return filteredMaterialDetails;
    
    });
         

    // this.on('transfer', async (req) => {
    //     const data = req.data;
    //     const dataArray = Array.isArray(data) ? data : [data];
    //     const mergedData = dataArray.map(item => ({
    //         ...item,
    //         SalesOrder: sales[0]?.SalesOrder || '',
    //         SalesOrderItem: sales[0]?.SalesOrderItem || ''
    //     }));
    //     console.log("Merged Data:", mergedData);
    //     const {MaterialDocument,MaterialDocumentItem}=this.entities
    //     insqry = INSERT.into(MaterialDocument).entries(

    //     { 
    //         "DocumentDate": "2024-11-14T00:00:00", 
    //         "PostingDate": "2024-11-14T00:00:00", 
    //         "GoodsMovementCode": "04", 
    //         "to_MaterialDocumentItem":
    //         [ { 
    //         "GoodsMovementType": "413", 
    //         "Material": mergedData.Material, 
    //         "Plant": mergedData.Plant,
    //         "StorageLocation": mergedData.StorageLocation, 
    //         "QuantityInEntryUnit": "2", 
    //         "EntryUnit": mergedData.BaseUnit,
    //         "Batch":mergedData.Batch,
    //         "InventorySpecialStockType": "E", 
    //         "IssgOrRcvgMaterial":mergedData.Material, 
    //         "IssuingOrReceivingPlant": mergedData.Plant, 
    //         "IssuingOrReceivingStorageLoc": mergedData.StorageLocation,
    //         "IssgOrRcvgBatch":mergedData.Batch,
    //         "IssuingOrReceivingValType": mergedData.Batch, 
    //         "SalesOrder": mergedData.SalesOrder,
    //         "SalesOrderItem": mergedData.SalesOrderItem, 
    //         "SpecialStockIdfgSalesOrder": mergedData.SDDocument,
    //         "SpecialStockIdfgSalesOrderItem": mergedData.SalesOrderItem,
    //         "CostCenter":"10000"
    //         } ] 
    //     }
        
    //     )
    //     await materialdocapi.run(insqry);
    // });

   

this.on('transfer', async (req) => {
           const oDataServiceUrl = "https://my401292-api.s4hana.cloud.sap/sap/opu/odata/sap/API_MATERIAL_DOCUMENT_SRV";
        const username = "USER_NNRG";
        const password = "FMesUvVB}JhYD9nVbDfRoVcdEffwmVNJJScMzuzx";
    const data = req.data;
    const dataArray = Array.isArray(data) ? data : [data];
    mergedData = dataArray.map(item => ({
        ...item,
        SalesOrder: sales[0]?.SalesOrder || '',
        SalesOrderItem: sales[0]?.SalesOrderItem || '',
        RequestedQuantity:sales[0]?.RequestedQuantity||''
    }));
    console.log("Merged Data:", mergedData);

    const postData = 
    { 
        "DocumentDate": "2024-11-14T00:00:00", 
        "PostingDate": "2024-11-14T00:00:00", 
        "GoodsMovementCode": "04", 
        "to_MaterialDocumentItem":
        [ { 
        "GoodsMovementType": "413", 
        "Material": "ASLP", 
        "Plant": "1001",
        "StorageLocation": "FG01", 
        "QuantityInEntryUnit": "1", 
        "EntryUnit": "PC",
        "Batch": "",
        "InventorySpecialStockType": "E", 
        "IssgOrRcvgMaterial": "ASLP", 
        "IssuingOrReceivingPlant": "1001", 
        "IssuingOrReceivingStorageLoc": "FG01",
        "IssgOrRcvgBatch": "",
        "IssuingOrReceivingValType": "", 
        "SalesOrder": "969",
        "SalesOrderItem": "10", 
        "SpecialStockIdfgSalesOrder": "967",
        "SpecialStockIdfgSalesOrderItem": "10",
        "CostCenter":"10000"
        } ] 
        }
        
        

    try {
        // Fetch CSRF token and cookies
        const csrfResponse = await axios.get(oDataServiceUrl, {
            headers: {
                'X-CSRF-Token': 'Fetch',
                'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
            },
            withCredentials: true // Ensure cookies are stored
        });

        const csrfToken = csrfResponse.headers['x-csrf-token'];
        const cookies = csrfResponse.headers['set-cookie'];

        if (!csrfToken || !cookies) {
            throw new Error('CSRF token or cookies not found');
        }

        console.log('CSRF Token:', csrfToken);

        // Send POST request using the CSRF token and cookies
        const postResponse = await axios.post(`${oDataServiceUrl}/A_MaterialDocumentHeader`, postData, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
                'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
                'Cookie': cookies.join('; ') // Set cookies for session consistency
            },
            withCredentials: true
        });

        console.log('POST response:', postResponse.data);
        req.reply(postResponse.data);

    } catch (error) {
        console.error('Error during transfer operation:', error);
        req.error(error.message);
    }
});




    
    
    

})