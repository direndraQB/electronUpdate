
const routeList = [
                    
    {routeName:'devices',tableName:'devices',label:'Devices',progress:5},

    {routeName:'employees',tableName:'users',label:'Users',progress:10},

    {routeName:'getRoles',tableName:'roles',label:'Roles',progress:15},

    {routeName:'getStoreInfo',tableName:'listStores',label:'Stores List',progress:20},

    {routeName:'getChainInfo',tableName:'listChains',label:'Chains List',progress:25},

    // {routeName:'productCount',tableName:''},

    {routeName:'chargeList',tableName:'taxes',label: 'Taxes',progress:30},

    {routeName:'accounts',tableName:'accountInformation', label:'Accounts',progress:32},

    {routeName:'payments',tableName:'globalTypePaymentAccountIDMapping',label:'Payments',progress:34},

    {routeName:'global',tableName:'globalType',label:'Global Types',progress:36},

    // {routeName:'globaltypes',tableName:'globalTypeValues'},

    {routeName:'productsTest',tableName:'products', label: 'Products',progress:50},

    {routeName:'categories',tableName:'category', label: 'Categories',progress:52},

    {routeName:'brands',tableName:'brand',label: 'Brands',progress:55},

    {routeName:'getAppSettings',tableName:'sharedPref', label:'Shared Preferences',progress:60},

    {routeName:'getMaxLogID',tableName:'sharedPref', label : 'Shared Preferences',progress:65},

    // {routeName:'getRemarksApp',tableName:'globalRemarks'},

    {routeName:'lastorder',progress:66},

    // {routeName:'lastBatch',tableName:'batchInfo'},

    {routeName:'discounts',tableName:'discountMaster',label : 'Discounts',progress:68},
    
    {routeName:'getLicenseInfo',tableName:'', label:'License Information',progress:70},

    {routeName:'getVendors',tableName:'vendors', label:'Vendors',progress:75},

    {routeName:'getStoreListApp',tableName:'storeList', label:'Store List',progress:78},

    // {routeName:'inventoryLevel',tableName:'stockLevel'},   no need because of batch level

    {routeName:'customerInfoApp',tableName:'customers' , label:'Customers',progress:80},

    // {routeName:'heartbeat',progress:82},

    {routeName:'getDamageClaimList',tableName:'damage', label:'Damage Claim List',progress:85},

    {routeName:'getStoreRegionPricing',tableName:'storeRegion' , label:'Store Region Prices',progress:90},

    {routeName:'getProductsBatchVariants',tableName:'batchProductVariants' , label:'Product Batch Variants',progress:93},

    {routeName:'getWarehouses',tableName:'warehouses',label:'Warehouses',progress:95},

    {routeName:'getStockTransferRule',tableName:'stockTransferConf',label:'Stock Transfer Configurations',progress:98},

    {routeName:'getMocsApp',tableName:'mocs',label:'MOC List',progress:99},

    // {routeName:'getPDPList',tableName:'pdpList',label:'PDP List'}
];

module.exports = routeList;
