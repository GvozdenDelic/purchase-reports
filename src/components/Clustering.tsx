import React, { useState, useEffect } from 'react';
import { KMeans, processCustomerData } from '.././utils/kmeans';
import { createModel } from '.././utils/createModel';
import * as tf from '@tensorflow/tfjs';
import Recommendations from './Recommendations';

type Props = {
  data: any[];
};

const Clustering: React.FC<Props> = ({ data }) => {
    const [centroidsSpending, setCentroidsSpending] = useState<number[][]>([]);
    const [centroidsFrequency, setCentroidsFrequency] = useState<number[][]>([]);
    const [customerId, setCustomerId] = useState<string>('');
    const [customerSpendingCluster, setCustomerSpendingCluster] = useState<string | null>(null);
    const [customerFrequencyCluster, setCustomerFrequencyCluster] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [model, setModel] = useState<tf.LayersModel | null>(null);

    useEffect(() => {
        const processedData = processCustomerData(data);
        const spendingData = processedData.map(d => [d.spend]);
        const frequencyData = processedData.map(d => [d.frequency]);

        if (spendingData.length > 0) {
            const kmeansSpending = new KMeans(3, spendingData);
            setCentroidsSpending(kmeansSpending.run(10));
        }

        if (frequencyData.length > 0) {
            const kmeansFrequency = new KMeans(3, frequencyData);
            setCentroidsFrequency(kmeansFrequency.run(10));
        }

        const initModel = async () => {
            const trainedModel = await createModel(data, centroidsSpending);
            setModel(trainedModel);
        };

        initModel();
    }, [data]);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerId(event.target.value);
        const customerData = processCustomerData(data).find(c => c.id === event.target.value);
        
        if (customerData && model) {
            const spendingCluster = determineCluster([customerData.spend], centroidsSpending);
            const frequencyCluster = determineCluster([customerData.frequency], centroidsFrequency);
            setCustomerSpendingCluster(getClusterLabel(spendingCluster));
            setCustomerFrequencyCluster(getClusterLabel(frequencyCluster));

            // Get recommendations
            const input = tf.tensor2d([[
                customerData.spend / Math.max(...processCustomerData(data).map(c => c.spend)),
                customerData.frequency / Math.max(...processCustomerData(data).map(c => c.frequency)),
                spendingCluster
            ]]);

            const prediction = model.predict(input) as tf.Tensor;
            const products = Array.from(new Set(data.map(row => row.product_id))).sort((a, b) => a - b);
            const recommendedIndices = Array.from(await prediction.data())
                .map((prob, index) => ({ prob, index }))
                .sort((a, b) => b.prob - a.prob)
                .slice(0, 3)
                .map(item => products[item.index]);
            
            setRecommendations(recommendedIndices.map(String));
        }
    };

    const determineCluster = (point: number[], centroids: number[][]) => {
        let minDist = Infinity;
        let clusterIndex = 0;
        centroids.forEach((centroid, i) => {
        const dist = Math.sqrt(point.reduce((sum, val, idx) => sum + Math.pow(val - centroid[idx], 2), 0));
        if (dist < minDist) {
            minDist = dist;
            clusterIndex = i;
        }
        });
        return clusterIndex;
    };

    const getClusterLabel = (index: number) => {
        const labels = ["high", "medium", "low"];
        return labels[index];
    };

    return (
    <div>
      <h2>Check Customer by ID</h2>
      {!model && (
        <div>
            <span className="spinner"></span>
            Analyzing data, please wait...
        </div>
      )}
      {model && (
        <div className="uncover">
            <label htmlFor='customerid'>Customer ID:</label>
            <input type="number" name="customerid" value={customerId} onChange={handleInputChange} placeholder="Enter Customer ID" />
        </div>
      )}
      {model && (Number(customerId) > 0 && Number(customerId) <= 500) && (
            <div className="uncover">
                <div>
                    Customer {customerId} is a {customerSpendingCluster} spender with {customerFrequencyCluster} buying frequency.
                </div>
                <Recommendations recommendations={recommendations} />
            </div>
      )}
    </div>
  );
};

export default Clustering;
