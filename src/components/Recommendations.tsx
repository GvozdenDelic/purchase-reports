import React from 'react';

type RecommendationsProps = {
    recommendations: string[];
};

/*  PaginatedTable component */
const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
    return (
        <div className="recommendations">
            {recommendations.length === 0 ? (
                <div>Recommended products are being calculated...</div>
            ) : (
                <>
                    Recommended products based on purchase history and spending habits are:
                    {recommendations.map((product, index) => (
                        <span className="recommendations__product" key={index}> {product}</span>
                    ))}
                </>
            )}
        </div>
    );
};

export default Recommendations;