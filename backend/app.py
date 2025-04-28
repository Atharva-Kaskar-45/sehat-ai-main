from flask import Flask
from routes.sehat import sehat
from flask_cors import CORS
import logging
import os

app = Flask(__name__)
CORS(app)

# Register blueprint
app.register_blueprint(sehat, url_prefix='/api')

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    port = int(os.environ.get('PORT', 5000))  # 👈 take PORT from environment (Render will provide it)
    app.run(host='0.0.0.0', port=port, debug=True)  # 👈 host=0.0.0.0 for Render
