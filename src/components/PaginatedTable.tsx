import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

interface PaginatedTableProps {
  data: string[];
  itemsPerPage: number;
}

/*  PaginatedTable component
*   It takes the data from CSVUploader component to render a paginated results with 250 results per page (Can be changed using itemsPerPage prop)
*   Pagination is implemented using react-paginate library
*/
const PaginatedTable: React.FC<PaginatedTableProps> = ({ data, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayData, setDisplayData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
    // When selecting a page, only 'itemsPerPage' amount of items is reloaded and displayed. It is much better for performance than rendering the whole records list that may be even larger than 50000 items
    useEffect(() => {
        setIsLoading(true);
        const startIdx = currentPage * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        setDisplayData(data.slice(startIdx, endIdx));
        setIsLoading(false);
    }, [currentPage, data, itemsPerPage]);

    const handlePageClick = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
    };

    return (
        <>
            {isLoading ? (
                <div>Loading purchase records...</div>
            ) : (
                <>
                    <div className="table uncover">
                        <div className="table__header">
                        <div className="table__header-column table__header-column--index">Index</div>
                            {
                                Object.keys(data[0]).map((key) => (
                                    <div key={key} className="table__header-column">{key.replace('_',' ')}</div>
                                ))
                            }
                        </div>
                        {displayData.map((record, index) => (
                            <div key={index} className="table__content">
                                <div key={index} className="table__content-column table__content-column--index">{(currentPage * itemsPerPage) + index + 1}.</div>
                                {Object.values(record).map((value, idx) => (
                                    <div key={idx} className="table__content-column">{value}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <ReactPaginate
                        previousLabel={'←'}
                        nextLabel={'→'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(data.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
                </>
            )}
        </>
    );
};

export default PaginatedTable;
