Pos.Collection.PurchaseDetails.cacheTimestamp();
Pos.Collection.PurchaseDetails.cacheDoc('product',Pos.Collection.Products,['name','barcode','_unit','_category']);
Pos.Collection.PurchaseDetails.cacheDoc('location',Pos.Collection.Locations,['name']);
Pos.Collection.PurchaseDetails.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);