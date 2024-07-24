function processData() {
    const profit = parseFloat(document.getElementById('profit').value);
    const conversionRate = parseFloat(document.getElementById('conversionRate').value);
    const inputData = document.getElementById('inputData').value.split('\n');

    const productsByFolder = {};

    let currentFolder = '';
    for (let i = 0; i < inputData.length; i++) {
        const line = inputData[i].trim();
        if (line.length === 0) continue;

        if (!line.startsWith('$')) {
            // Folder name
            currentFolder = line;
            if (!productsByFolder[currentFolder]) {
                productsByFolder[currentFolder] = [];
            }
        } else {
            // Product details
            const price = parseFloat(line.substring(1));
            const model = inputData[i - 2];
            const details = inputData[i - 1];
            productsByFolder[currentFolder].push({ model, details, price });
        }
    }

    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Clear existing products

    let csvContent = "data:text/csv;charset=utf-8,";

    for (const [folder, products] of Object.entries(productsByFolder)) {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'folder';

        const folderTitle = document.createElement('h3');
        folderTitle.textContent = folder;
        folderDiv.appendChild(folderTitle);

        const table = document.createElement('table');
        table.className = 'table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Model', 'Details', 'Price in $', 'Price in EGP'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        products.forEach(product => {
            const priceInDollar = product.price + profit;
            const priceInEGP = (priceInDollar * conversionRate).toFixed(2);

            const row = document.createElement('tr');

            const tdModel = document.createElement('td');
            tdModel.className = 'model-cell';
            tdModel.textContent = product.model;
            row.appendChild(tdModel);

            const tdDetails = document.createElement('td');
            tdDetails.textContent = product.details;
            row.appendChild(tdDetails);

            const tdPriceDollar = document.createElement('td');
            tdPriceDollar.className = 'price-cell';
            tdPriceDollar.textContent = `$${priceInDollar.toFixed(2)}`;
            row.appendChild(tdPriceDollar);

            const tdPriceEGP = document.createElement('td');
            tdPriceEGP.className = 'price-cell';
            tdPriceEGP.textContent = `EGP ${priceInEGP}`;
            row.appendChild(tdPriceEGP);

            tbody.appendChild(row);

            // Append to CSV
            csvContent += `${product.model},${product.details},${priceInDollar.toFixed(2)},${priceInEGP}\n`;
        });
        table.appendChild(tbody);
        folderDiv.appendChild(table);

        productList.appendChild(folderDiv);
    }

    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = encodeURI(csvContent);
    downloadLink.download = 'products.csv';
    downloadLink.textContent = 'Download CSV';
    productList.appendChild(downloadLink);
}
