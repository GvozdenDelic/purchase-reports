import React, { useState } from 'react';
import CSVUploader from './components/CSVUploader';
import PaginatedTable from './components/PaginatedTable';
import Stats from './components/Stats';
import Clustering from './components/Clustering';

const App: React.FC = () => {
    const [data, setData] = useState<unknown[]>([]); // No need to use global state management or context API here. I have made the data accessible by lifting the state up

    return (<>
            <h1>Purchase records AI App</h1>
            <div className="card">

            {data?.length > 0 ? (
                <>
                    <PaginatedTable data={data} itemsPerPage={250} />
                    <Stats data={data} />
                    <Clustering data={data} />
                </>
            ) : <CSVUploader onDataLoaded={setData} />}
        </div>
    </>)
}

export default App
