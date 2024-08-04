from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Azure Computer Vision API endpoint and key
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
AZURE_KEY = os.getenv("AZURE_KEY")

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Send the image file to Azure Computer Vision API
    analyze_url = f"{AZURE_ENDPOINT}/vision/v3.2/describe"
    headers = {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': AZURE_KEY
    }

    response = requests.post(analyze_url, headers=headers, data=file.read())

    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
