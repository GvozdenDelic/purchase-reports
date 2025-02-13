import pandas as pd
import random
from datetime import datetime, timedelta

# Generate 50 random products
products = [{'product_id': i, 'product_category': f'Category {random.randint(1, 5)}'} for i in range(1, 51)]

# Generate 500 random customers
customers = [{'customer_id': i} for i in range(1, 501)]

# Generate random purchase records
purchase_records = []
start_date = datetime(2022, 1, 1)
end_date = datetime(2022, 12, 31)

# Generate 50000 purchase records
for _ in range(50000):
    customer_id = random.choice(customers)['customer_id']
    product = random.choice(products)
    product_id = product['product_id']
    product_category = product['product_category']
    purchase_amount = round(random.uniform(10.0, 1000.0), 2)
    purchase_date = start_date + (end_date - start_date) * random.random()
    purchase_records.append({
        'customer_id': customer_id,
        'product_id': product_id,
        'product_category': product_category,
        'purchase_amount': purchase_amount,
        'purchase_date': purchase_date.strftime('%Y-%m-%d')
    })

# Create a DataFrame
df = pd.DataFrame(purchase_records)

# Save to CSV
df.to_csv('purchase_records.csv', index=False)
