const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const salesorderapi = await cds.connect.to('API_SALES_ORDER_SRV');
    const materialstockapi = await cds.connect.to('API_MATERIAL_STOCK_SRV');

    this.on('READ', 'SalesOrder', async req => {
        req.query.SELECT.columns = [
            { ref: ['SalesOrder'] },
            { ref: ['to_Item'], expand: ['*'] }
        ];

        let res = await salesorderapi.run(req.query);

        res.forEach(element => {
            if (element.to_Item) {
                const item = element.to_Item.find(item => item.SalesOrder === element.SalesOrder);
                if (item) {
                    element.SalesOrderItem = item.SalesOrderItem;
                    element.Material=item.Material
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
        console.log(req.params);
        const salesOrderId = req.params[0].SalesOrder;
        const salesOrderResult = await salesorderapi.run(
            SELECT.from('A_SalesOrderItem').columns(['SalesOrder', 'Material']).where({ SalesOrder: salesOrderId })
        );
        console.log('Sales Order Result:', salesOrderResult);
    
        if (!salesOrderResult || salesOrderResult.length === 0) {
            return [];
        }
        const materials = [...new Set(salesOrderResult.map(item => item.Material))];
        let materialDetails = [];
        if (materials.length > 0) {
            materialDetails = await materialstockapi.run(
                SELECT.from('A_MatlStkInAcctMod')
                    .columns(['Material', 'Plant', 'Batch', 'StorageLocation'])
                    .where({ Material: { in: materials } })
            );
        }
        console.log('Material Details:', materialDetails);
        return materialDetails;
    });
    


})