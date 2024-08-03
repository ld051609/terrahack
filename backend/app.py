from flask import Flask, Response, request, jsonify
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys
app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == "POST":
        # Get the Base64 encoded image data
        data = request.get_json()  # Expecting JSON payload
        base64_data = data.get('base64', '')

        # Decode the Base64 data
        if base64_data:
            image_data = base64.b64decode(base64_data)

            # Save the image to a file
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'image.jpeg')
            with open(file_path, 'wb') as out_file:
                out_file.write(image_data)

            return jsonify({"message": "Image received and saved."}), 200
        else:
            return jsonify({"message": "No data found."}), 400

@app.route("/image", methods=['GET', 'POST'])
def image():
    if(request.method == "POST"):
        bytesOfImage = request.get_data()
        with open('image.jpeg', 'wb') as out:
            out.write(bytesOfImage)
        return "Image read"


@app.route("/video", methods=['GET', 'POST'])
def video():
    if(request.method == "POST"):
        bytesOfVideo = request.get_data()
        with open('video.mp4', 'wb') as out:
            out.write(bytesOfVideo)
        return "Video read"

if __name__ == '__main__':
    app.run(port=5000)
