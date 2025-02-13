import * as tf from '@tensorflow/tfjs';
import { processCustomerData } from './kmeans';

export const createModel = async (
    data: any[], 
    centroidsSpending: number[][]
) => {
    const processedData = processCustomerData(data);
    const uniqueProducts = Array.from(new Set(data.map(row => row.product_id))).sort((a, b) => a - b);
    const numProducts = uniqueProducts.length;
    
    // Create a simple neural network
    const model = tf.sequential();
    model.add(tf.layers.dense({
        units: 32,
        activation: 'relu',
        inputShape: [3] // [spending, frequency, cluster]
    }));
    model.add(tf.layers.dense({
        units: 16,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: numProducts, // One output per product
        activation: 'softmax'
    }));

    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // Prepare training data
    const xs = tf.tensor2d(processedData.map(d => [
        d.spend / Math.max(...processedData.map(c => c.spend)),
        d.frequency / Math.max(...processedData.map(c => c.frequency)),
        determineCluster([d.spend], centroidsSpending)
    ]));

    // Create target data based on actual purchase history
    const ys = tf.tensor2d(processedData.map(customer => {
        // Get all purchases for this customer
        const customerPurchases = data.filter(row => row.id === customer.id);
        // Create a one-hot encoded vector for products
        const productVector = new Array(numProducts).fill(0);
        customerPurchases.forEach(purchase => {
            const productIndex = uniqueProducts.indexOf(purchase.product_id);
            productVector[productIndex] = 1;
        });
        return productVector;
    }));

    // Train the model
    await model.fit(xs, ys, {
        epochs: 50,
        batchSize: 32
    });

    return model;
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