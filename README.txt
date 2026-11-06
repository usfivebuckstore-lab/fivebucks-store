FiveBucks website replacement — Shopify catalogue edition

Replace existing repository files with index.html, styles.css, script.js, products.json and products.csv.
The old demo catalogue is replaced with 67 Shopify-export products. Every storefront price is $5.00 USD.
Supplier variant prices are preserved in products.json under variants[].supplier_price and do not control retail prices.
Product images load from Shopify CDN URLs in the export; image files are not downloaded/rehosted here.
Product cards show up to 8 distinct images per product. Checkout remains a demo and does not process payments.
Verify supplier stock, shipping, costs and image-use permissions before accepting real orders.
This package does not deploy or change the live Vercel site. Upload the files to GitHub and commit to main to deploy.
