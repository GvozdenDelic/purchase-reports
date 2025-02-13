// kmeans.ts
export class KMeans {
    k: number;
    data: number[][];
    centroids: number[][];
  
    constructor(k: number, data: number[][]) {
      this.k = k;
      this.data = data;
      this.centroids = [];
    }
  
    initializeCentroids() {
      this.centroids = this.data.slice(0, this.k);
    }
  
    distance(a: number[], b: number[]): number {
      return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
    }
  
    assignClusters() {
      const clusters: number[][][] = Array.from({ length: this.k }, () => []);
      this.data.forEach(point => {
        let minDist = Infinity;
        let clusterIndex = 0;
        this.centroids.forEach((centroid, i) => {
          const dist = this.distance(point, centroid);
          if (dist < minDist) {
            minDist = dist;
            clusterIndex = i;
          }
        });
        clusters[clusterIndex].push(point);
      });
      return clusters;
    }
  
    updateCentroids(clusters: number[][][]) {
      this.centroids = clusters.map(cluster =>
        cluster.length === 0 ?
          new Array(this.centroids[0].length).fill(0) :
          cluster[0].map((_, i) =>
            cluster.reduce((sum, point) => sum + point[i], 0) / cluster.length
          )
      );
    }
  
    run(iterations: number) {
      this.initializeCentroids();
      for (let i = 0; i < iterations; i++) {
        const clusters = this.assignClusters();
        this.updateCentroids(clusters);
      }
      return this.centroids;
    }
  }
  
  export const processCustomerData = (data: any[]): { id: string, spend: number, frequency: number }[] => {
    const customers: { [key: string]: { spend: number, frequency: number } } = {};
  
    data.forEach(record => {
      const { customer_id, purchase_amount } = record;
      if (!customers[customer_id]) {
        customers[customer_id] = { spend: 0, frequency: 0 };
      }
      customers[customer_id].spend += Number(purchase_amount);
      customers[customer_id].frequency += 1;
    });
  
    return Object.entries(customers).map(([id, { spend, frequency }]) => ({
      id,
      spend,
      frequency
    }));
  };
  