import { usePapaParse } from 'react-papaparse';

interface CSVUploaderProps {
  onDataLoaded: (data: unknown[]) => void;
}

interface PurchaseRecord {
    customer_id: string;
    product_id: string;
    product_category: string;
    purchase_amount: number;
    purchase_date: string;
}

/*  CSV uploader component
*   It contains input type 'file' that allows the CSV upload
*   CSV is parsed as a string using 'Papaparse' library and read using FileReader
*   The data is later used to populate the 'PaginatedTable' component.
*/
const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const { readString } = usePapaParse();    

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
        const csvData = e.target?.result;
        if (typeof csvData === 'string') {
            const csvDataTrimmed = csvData.trim(); // Sometimes CSVs are generated with white space characters which corrupt data stats calculations
            readString(csvDataTrimmed, {
            header: true,
            complete: (results) => {
                onDataLoaded(results.data as PurchaseRecord[]);
            }});
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <p>Please upload a CSV file to get started !</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
};

export default CSVUploader;