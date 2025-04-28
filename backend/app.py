from flask import Flask
from routes.sehat import sehat  # adjust import if file is elsewhere
from flask_cors import CORS
import logging
import os

app = Flask(__name__)
CORS(app)  # enable CORS for frontend

# Register blueprint
app.register_blueprint(sehat, url_prefix='/api')

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    app.run(debug=True, port=5000)
