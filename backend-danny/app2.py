from flask import Flask, Response, request, jsonify
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys
from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai
# from google.cloud import vision
import requests
import re
from PIL import Image

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# Configure Google Gemini
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
genai.configure(api_key="AIzaSyCpXxHPm-E7mXF_ChFhm76PNAUjRwkQ_U0")
model = genai.GenerativeModel('gemini-1.5-flash')

# Azure Vision API configuration
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
AZURE_KEY = os.getenv("AZURE_KEY")


def get_gemini_response(input):
    response = model.generate_content(input)
    return response.text

def azure_vision_analysis(image_data):
    analyze_url = f"{AZURE_ENDPOINT}/vision/v3.2/describe"
    headers = {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': AZURE_KEY
    }
    response = requests.post(analyze_url, headers=headers, data=image_data)
    if response.status_code == 200:
        print(response.json())
        return response.json()
    else:
        return {"error": "Failed to analyze image"}

def parse_ingredient_quantities(response_text):
    ingredients = {}
    phrases = response_text.split(",")
    pattern = re.compile(r'(\d+(/\d+)?\s*[a-zA-Z]*)\s*(.*)')
    for phrase in phrases:
        match = pattern.match(phrase.strip())
        if match:
            quantity = match.group(1).strip()
            ingredient = match.group(3).strip()
            ingredients[ingredient] = quantity
    return ingredients

def resize_image(image_data, max_size=(1024, 1024)):
    with Image.open(BytesIO(image_data)) as img:
        img.thumbnail(max_size)
        byte_arr = BytesIO()
        img.save(byte_arr, format='JPEG')
        return byte_arr.getvalue()


@app.route("/upload", methods=['POST'])
def upload():
    if request.method == "POST":
        print("Request received")
        data = request.get_json()
        base64_data = data.get('base64', '')

        if base64_data:
            image_data = base64.b64decode(base64_data)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'image.jpeg')
            with open(file_path, 'wb') as out_file:
                out_file.write(image_data)


            # Resize the image
            resized_image_data = resize_image(image_data)

            # Azure Vision Analysis
            response_azure = azure_vision_analysis(resized_image_data)

            if "description" in response_azure and "captions" in response_azure["description"]:
                description = response_azure["description"]["captions"][0]["text"]
                print(f'Description', description)

                # Google Gemini Analysis
                gemini_input = f"Give the list of top 5 specific ingredients with quantities only to make: {description} and separated by commas."
                response_gemini = get_gemini_response(gemini_input)
                ingredient_quantities = parse_ingredient_quantities(response_gemini)

                # Calculate CO2 emissions based on the default quantities
                total_co2 = 0
                prompt_2 = f"""      
                You are provided with a list of ingredients along with their quantities. Your task is to calculate the CO2 emissions based on these ingredients.

                1. **Ingredients List**: {ingredient_quantities}
                2. **CO2 Emission Factors**:
                - Apples: 0.43 kg CO2 per kg
                - Bananas: 0.86 kg CO2 per kg
                - Barley: 1.18 kg CO2 per kg
                - Beef (beef herd): 99.48 kg CO2 per kg
                - Beef (dairy herd): 33.30 kg CO2 per kg
                - Beet Sugar: 1.81 kg CO2 per kg
                - Berries & Grapes: 1.53 kg CO2 per kg
                - Brassicas: 0.51 kg CO2 per kg
                - Cane Sugar: 3.20 kg CO2 per kg
                - Cassava: 1.32 kg CO2 per kg
                - Cheese: 23.88 kg CO2 per kg
                - Citrus Fruit: 0.39 kg CO2 per kg
                - Coffee: 28.53 kg CO2 per kg
                - Dark Chocolate: 46.65 kg CO2 per kg
                - Eggs: 4.67 kg CO2 per kg
                - Fish (farmed): 13.63 kg CO2 per kg
                - Groundnuts: 3.23 kg CO2 per kg
                - Lamb & Mutton: 39.72 kg CO2 per kg
                - Maize: 1.70 kg CO2 per kg
                - Milk: 3.15 kg CO2 per kg
                - Nuts: 0.43 kg CO2 per kg
                - Oatmeal: 2.48 kg CO2 per kg
                - Onions & Leeks: 0.50 kg CO2 per kg
                - Other Fruit: 1.05 kg CO2 per kg
                - Other Pulses: 1.79 kg CO2 per kg
                - Other Vegetables: 0.53 kg CO2 per kg
                - Peas: 0.98 kg CO2 per kg
                - Pig Meat: 12.31 kg CO2 per kg
                - Potatoes: 0.46 kg CO2 per kg
                - Poultry Meat: 9.87 kg CO2 per kg
                - Prawns (farmed): 26.87 kg CO2 per kg
                - Rice: 4.45 kg CO2 per kg
                - Root Vegetables: 0.43 kg CO2 per kg
                - Soy milk: 0.98 kg CO2 per kg
                - Tofu: 3.16 kg CO2 per kg
                - Tomatoes: 2.09 kg CO2 per kg
                - Wheat & Rye: 1.57 kg CO2 per kg
                - Wine: 1.79 kg CO2 per kg

                Please calculate the total CO2 emissions based on the provided emission factors and the given quantities of ingredients. Only output the response as format below and nothing else:
                - Ingredient: Quantity (kg) - CO2 Emissions: co2 emiisons (kgCO2)
                - Total CO2 Emissions: {total_co2} kg
                """
                emission_results = get_gemini_response(prompt_2)
                print("Azure Description:", description)
                print("Gemini Ingredient Quantities:", ingredient_quantities)
                print("Emission Results:", emission_results)

                # Return results
                match = re.search(r'Total CO2 Emissions:\s*([\d.]+)\s*kg', emission_results)
                if match:
                  total_co2_emission = match.group(1)

                return jsonify({
                    "azure_description": description,
                    "gemini_ingredient_quantities": ingredient_quantities,
                    "emission_results": emission_results, 
                    "total_co2": total_co2_emission
                }), 200
            else:
                return jsonify({"message": "Failed to analyze the image with Azure Vision."}), 400
        else:
            return jsonify({"message": "No data found."}), 400

# Testing purpose
@app.route("/", methods=['GET', 'POST'])
def index():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
