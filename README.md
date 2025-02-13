# Purchase Reports

Purchase Reports is an AI-powered aplication that uses React with Typescript. It is built using with Vite.

The app takes a CSV file with purchase records and displays purchase data in a paginated table.
General stats are also generated to show amount of purchase records, average product price, average spending per customer, top-selling product and top selling category.

After the CSV is uploaded, data from purchase records is being clustered and analyzed in the background.
A preloader is displayed meanwhile, until the data is analyzed.

Customer clustering is done using k-means.
Customers are clustered by amount of money spent and purchase frequency.
There are three tiers for money spent and frequency: 'Low', 'Medium', 'High'.

TensorFlow is used to learn from customers previous purchasing history and recommend 3 products.
After the CSV is uploaded, a tensorflow model is created and it learns from the purchase records data.
It is using a simple neural network and takes into consideration spending, frequency, customer cluster.
On a production project it would be possible to use more user data, such as age, sex, location and other data that may be decisive for creating better recommendations. We will be using simplified data here, as a proof of concept. 

After the data is analyzed, it is possible to enter a customer ID and check their money spent, frequency cluster and recommended products.
Individual customer data will be shown below the input field.

--

Requirements:
- Having Node installed on the computer (v20.15.1 or similar)
- Having npm installed on the computer (10.9.2 or similar)
- (Optional) having Python installed on computer to generate new purchase records

Running instructions:

- Open a terminal and make sure you are in the root project folder.
- Run "npm i"
- Then run "npm run dev"
- Open a web browser and visit the URL shown in terminal (http://localhost:5173/ or similar)

Usage instructions:
- Click "Choose File" button and upload purchase records CSV file. It can be uploaded from "/scripts" folder
- Wait while purchase records are analyzed
- Enter a customer ID in the input field to check their spending and frequency clusters and get 3 recommended product IDs
