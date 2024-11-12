# from flask import Flask
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.cluster import KMeans
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

app = Flask(__name__)
CORS(app)

# Endpoint to receive data from Node.js and send a response
@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.get_json()  # Extracting JSON data sent from Node.js
    print(f"Data received from Node.js: {data}")
    
    # You can process the data here if necessary
    
    # Sending a response back to the Node.js server
    response_data = {
        'status': 'success',
        'message': 'Data received successfully!',
        'processedData': f"Processed {data['name']}"
    }
    return jsonify(response_data)




@app.route('/api/classify', methods=['POST'])
def classify_points():
    print(f"Data received from Node.js: ")
    try:
        # Parse the JSON data sent from the client
        print(f"Data received from Node.js: ")

        data = request.get_json()

        # Extract the arrays and the K value
        X = np.array(data['X'])  # Existing points for fitting the model
    
        y = np.array(data['Y'])  # Cluster labels

        new_points = data['new_points']  # New points with 'id' field
        
        k = int(data['k'])  # Number of nearest neighbors

        # Extract the actual coordinates of the new points (excluding 'id')
        new_points_coords = np.array([point['coords'] for point in new_points])

        # Step 1: Fit a K-Nearest Neighbors classifier using X and y
        knn = KNeighborsClassifier(n_neighbors=k)
        knn.fit(X, y)

        # Step 2: Predict the clusters for the new points
        predictions = knn.predict(new_points_coords)

        # Step 3: Combine the new points' ids with their predicted cluster
        result = []
        for point, prediction in zip(new_points, predictions):
            result.append({
                'id': point['id'],
                'coords': point['coords'],
                'predicted_cluster': int(prediction)
            })

        # Return the results as JSON
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400



if __name__ == '__main__':
    app.run(debug=True)

