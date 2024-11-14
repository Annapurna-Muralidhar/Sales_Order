using SalesService as service from '../../srv/service';
annotate service.SalesOrder with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'SalesOrder',
                Value : SalesOrder,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SalesOrderItem',
                Value : SalesOrderItem,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Sales Order',
            Value : SalesOrder,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Sales Order Item',
            Value : SalesOrderItem,
        },
        {Label:'Material',$Type : 'UI.DataField',Value: Material},
        {Label:'Customer',$Type : 'UI.DataField',Value: SoldToParty},
        {Label:'Requested Quantity',$Type : 'UI.DataField',Value: RequestedQuantity},
        {Label:'Requested Quantity Unit',$Type : 'UI.DataField',Value: RequestedQuantityUnit}
    ],
);

