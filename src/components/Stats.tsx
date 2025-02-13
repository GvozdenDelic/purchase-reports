interface StatsProps {
  data: any[];
}

/*  Stats component
*   Shows purchase related data
*/
const Stats: React.FC<StatsProps> = ({ data }) => {
    let totalPurchase: number = 0;
    const productSales: Record<string, number> = {};
    const categorySales: Record<string, number> = {};
    const customers = new Set<string>();
    data.map((record) => {
        if(record['purchase_amount']) {
            totalPurchase += parseFloat(record['purchase_amount']);
        }

        const { product_id, product_category, purchase_amount, customer_id } = record;
        const amount = parseFloat(purchase_amount);

        // Calculate number of customers to calculate average spending per customer. I am using a set instead of a array to ensure we have a list of unique customers
        customers.add(customer_id);
    
        // Calculate sales for each product
        if (productSales[product_id]) {
          productSales[product_id] += amount;
        } else {
          productSales[product_id] = amount;
        }
    
        // Calculate sales for each category
        if (categorySales[product_category]) {
          categorySales[product_category] += amount;
        } else {
          categorySales[product_category] = amount;
        }
    });

    // Find top-selling product by using reduce method to find out which item occurs the most often
    const topProduct = Object.keys(productSales).reduce((a, b) => 
        productSales[a] > productSales[b] ? a : b
    );

    // Find top-selling category using the same method we have for products
    const topCategory = Object.keys(categorySales).reduce((a, b) => 
        categorySales[a] > categorySales[b] ? a : b
    );

    // Calculate average spending per customer in two decimals
    const averageSpendingPerCustomer = Math.round((totalPurchase / customers.size) * 100) / 100;
    
    // Calculate average purchase by taking total purchase amount divided by amount of purchase records
    const averagePurchase = Math.round((totalPurchase / data.length) * 100) / 100;

    // This way it is more readable what data.length represents
    const recordsAmount = data.length;

    // Looping through table headers and content, makes the code more readable, especially when there are many more header and content items
    const headers: string[] =           [   'Purchase Records Amount', 
                                            'Average Product Price', 
                                            'Average Spending Per Customer', 
                                            'Top Selling Product ID',
                                            'Top Selling Category'
                                        ];
    const contents: (string|number)[] = [   recordsAmount, 
                                            averagePurchase, 
                                            averageSpendingPerCustomer, 
                                            topProduct, 
                                            topCategory
                                        ];

    return(
        <>
            <h2>General Stats</h2>
            <div className="table uncover">
                <div className="table__header">
                    {headers.map((header, index) => {
                        return <div key={index} className="table__header-column">{header}</div>
                    })}
                </div>
                <div className="table__content">
                    {contents.map((content, index) => {
                        return <div key={index} className="table__content-column">{content}</div>
                    })}
                </div>
            </div>
        </>
    );
}

export default Stats;