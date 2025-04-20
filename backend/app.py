from flask import Flask
from routes.sehat import sehat
from flask_cors import CORS
import logging
import os

app = Flask(__name__)
CORS(app)  # enable CORS for frontend

# Register blueprint
app.register_blueprint(sehat, url_prefix='/api')

# This is required for Vercel
if __name__ != '__main__':
    application = app
else:
    logging.basicConfig(level=logging.INFO)
    app.run(debug=True, port=5000)

