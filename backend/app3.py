import streamlit as st
import os

from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')

def get_gemini_response(input, image, prompt):
    response = model.generate_content([input, image[0], prompt])
    return response.text

def input_image_details(uploaded_file):
    if uploaded_file is not None:
        bytes_data = uploaded_file.getvalue()

        image_parts = [
            {
                "mime_type": uploaded_file.type,
                "data": bytes_data
            }
        ]

        return image_parts
    else:
        raise FileNotFoundError("No file uploaded")
    
st.set_page_config(page_title="Food Scan")

st.header('Food Scan with Google Gemini')
input = st.text_input("Input prompt: ", key='input')
uploaded_file = st.file_uploader("Choose an image of the food or food table", type=["jpg", 'jpeg', 'png'])
image = ""
if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_column_width=True)

submit = st.button("Scan the Food(s)")

input_prompt = """
You have to identify different types of food in images. 
The system should accurately detect and label various foods displayed in the image, providing the name 
of the food and its location within the image (e.g., bottom left, right corner, etc.). Additionally, 
the system should extract nutritional information and categorize the type of food (e.g., fruits, vegetables, grains, etc.) 
based on the detected items. The output should include a comprehensive report or display showing the
identified foods, their positions, names, and corresponding nutritional details.
"""

if submit:
    image_data = input_image_details(uploaded_file)
    response = get_gemini_response(input_prompt, image_data, input)
    st.subheader("Food Scan report: ")
    st.write(response)