"""
Predictive Maintenance Inference Server
--------------------------------------
Serves real-time inference requests using the trained ML model:
- Model file: predictive_maintenance_model.pkl (RandomForestClassifier within an imblearn pipeline)
- Features file: predictive_maintenance_features.pkl
- Exact 12 features required:
  ['x', 'y', 'z', 'vibration_magnitude', 'vibration_mean', 'vibration_std',
   'vibration_peak', 'vibration_anomaly', 'rpm', 'current', 'current_abs', 'temperature']

Runs an HTTP server on port 5000 with CORS and health-check endpoints.
"""

import sys
import os
import types
import json
import logging
from datetime import datetime, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler
import joblib
import numpy as np

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

# Resolve paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'predictive_maintenance_model.pkl')
FEATURES_PATH = os.path.join(BASE_DIR, 'predictive_maintenance_features.pkl')

# ---------------------------------------------------------------------------
# Setup imblearn unpickling compatibility stubs
# ---------------------------------------------------------------------------
try:
    import imblearn
    import imblearn.pipeline
    import imblearn.over_sampling
except ImportError:
    m = types.ModuleType('imblearn')
    m.__path__ = []
    pipe_mod = types.ModuleType('imblearn.pipeline')
    pipe_mod.__path__ = []
    sampling_mod = types.ModuleType('imblearn.over_sampling')
    sampling_mod.__path__ = []
    ros_mod = types.ModuleType('imblearn.over_sampling._random_over_sampler')
    ros_mod.__path__ = []

    class DummyPipeline:
        def __init__(self, steps=None):
            self.steps = steps or []
        def predict(self, X):
            return self.steps[-1][1].predict(X)
        def predict_proba(self, X):
            return self.steps[-1][1].predict_proba(X)

    class DummySampler:
        pass

    pipe_mod.Pipeline = DummyPipeline
    sampling_mod.RandomOverSampler = DummySampler
    ros_mod.RandomOverSampler = DummySampler

    sys.modules['imblearn'] = m
    sys.modules['imblearn.pipeline'] = pipe_mod
    sys.modules['imblearn.over_sampling'] = sampling_mod
    sys.modules['imblearn.over_sampling._random_over_sampler'] = ros_mod
    m.pipeline = pipe_mod
    m.over_sampling = sampling_mod
    sampling_mod._random_over_sampler = ros_mod

# ---------------------------------------------------------------------------
# Load Model & Features
# ---------------------------------------------------------------------------
MODEL = None
FEATURES = []
MODEL_ERROR = None

try:
    if os.path.exists(FEATURES_PATH):
        FEATURES = list(joblib.load(FEATURES_PATH))
        logging.info("Loaded feature list (%d features): %s", len(FEATURES), FEATURES)
    else:
        FEATURES = [
            'x', 'y', 'z', 'vibration_magnitude', 'vibration_mean', 'vibration_std',
            'vibration_peak', 'vibration_anomaly', 'rpm', 'current', 'current_abs', 'temperature'
        ]
        logging.warning("Feature file not found, using canonical 12 features.")

    if os.path.exists(MODEL_PATH):
        raw_obj = joblib.load(MODEL_PATH)
        if hasattr(raw_obj, 'steps'):
            # It's an imblearn/sklearn Pipeline: extract final estimator or use pipeline
            MODEL = raw_obj.steps[-1][1]
            logging.info("Extracted final estimator from Pipeline: %s", type(MODEL))
        else:
            MODEL = raw_obj
            logging.info("Loaded model estimator: %s", type(MODEL))
        
        logging.info("Model classes: %s", getattr(MODEL, 'classes_', 'N/A'))
    else:
        MODEL_ERROR = f"Model file not found at {MODEL_PATH}"
        logging.error(MODEL_ERROR)

except Exception as ex:
    MODEL_ERROR = f"Failed to initialize model: {str(ex)}"
    logging.exception(MODEL_ERROR)

# ---------------------------------------------------------------------------
# HTTP Request Handler
# ---------------------------------------------------------------------------
class InferenceHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = self.path.split('?')[0].rstrip('/')
        if parsed_path in ('/api/health', '/health', ''):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()

            payload = {
                "status": "healthy" if MODEL is not None else "degraded",
                "model_loaded": MODEL is not None,
                "model_error": MODEL_ERROR,
                "model_name": type(MODEL).__name__ if MODEL is not None else None,
                "model_version": "RandomForestClassifier-v1.0",
                "feature_count": len(FEATURES),
                "features": FEATURES,
                "classes": [int(c) for c in getattr(MODEL, 'classes_', [])] if MODEL is not None else [],
                "server_time": datetime.now(timezone.utc).isoformat()
            }
            self.wfile.write(json.dumps(payload, indent=2).encode('utf-8'))
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        parsed_path = self.path.split('?')[0].rstrip('/')
        if parsed_path != '/api/predict':
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))
            return

        if MODEL is None:
            self.send_response(503)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            err_msg = MODEL_ERROR or "Trained model artifact is not loaded on backend."
            self.wfile.write(json.dumps({"status": "error", "message": err_msg}).encode('utf-8'))
            return

        # Read JSON body
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Empty request body"}).encode('utf-8'))
            return

        try:
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": f"Invalid JSON: {str(e)}"}).encode('utf-8'))
            return

        # Can accept either single "features": {...} or "records": [...]
        if 'features' in data:
            feature_dict = data['features']
            validation_error, feature_vector = self._extract_vector(feature_dict)
            if validation_error:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": validation_error}).encode('utf-8'))
                return

            try:
                X = [feature_vector]
                pred = MODEL.predict(X)[0]
                proba = MODEL.predict_proba(X)[0]

                # proba[0] = normal probability, proba[1] = failure probability
                prob_failure = float(proba[1]) if len(proba) > 1 else float(pred)
                prob_normal = float(proba[0]) if len(proba) > 0 else (1.0 - prob_failure)

                response_payload = {
                    "status": "success",
                    "prediction": int(pred),
                    "prediction_label": "Failure Predicted" if int(pred) == 1 else "Normal",
                    "failure_probability": round(prob_failure, 4),
                    "normal_probability": round(prob_normal, 4),
                    "risk_percentage": round(prob_failure * 100, 2),
                    "model_version": "RandomForestClassifier-v1.0",
                    "features_used": FEATURES,
                    "input_features": {k: feature_vector[i] for i, k in enumerate(FEATURES)},
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response_payload).encode('utf-8'))

            except Exception as ex:
                logging.exception("Inference failed")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "error",
                    "message": f"Inference execution failed: {str(ex)}"
                }).encode('utf-8'))

        elif 'records' in data and isinstance(data['records'], list):
            # Batch inference
            records = data['records']
            vectors = []
            for idx, r in enumerate(records):
                err, vec = self._extract_vector(r)
                if err:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self._send_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": f"Record {idx}: {err}"}).encode('utf-8'))
                    return
                vectors.append(vec)

            try:
                preds = MODEL.predict(vectors)
                probas = MODEL.predict_proba(vectors)
                results = []
                for p, pr in zip(preds, probas):
                    prob_fail = float(pr[1]) if len(pr) > 1 else float(p)
                    results.append({
                        "prediction": int(p),
                        "prediction_label": "Failure Predicted" if int(p) == 1 else "Normal",
                        "failure_probability": round(prob_fail, 4),
                        "risk_percentage": round(prob_fail * 100, 2)
                    })

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success",
                    "count": len(results),
                    "results": results,
                    "model_version": "RandomForestClassifier-v1.0"
                }).encode('utf-8'))
            except Exception as ex:
                logging.exception("Batch inference failed")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "error",
                    "message": f"Batch inference failed: {str(ex)}"
                }).encode('utf-8'))
        else:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "error",
                "message": "Payload must contain 'features' object or 'records' array"
            }).encode('utf-8'))

    def _extract_vector(self, feat_dict):
        """Validate all required features and return ordered float list."""
        if not isinstance(feat_dict, dict):
            return "Expected a dictionary of features", None

        vector = []
        for f in FEATURES:
            if f not in feat_dict or feat_dict[f] is None:
                return f"Missing required model feature: '{f}'", None
            try:
                val = float(feat_dict[f])
                vector.append(val)
            except (ValueError, TypeError):
                return f"Invalid numeric value for feature '{f}': {feat_dict[f]}", None

        return None, vector

    def log_message(self, format, *args):
        # Override to suppress default noisy stderr logs
        sys.stdout.write("%s - - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format%args))


def run_server(port=5000):
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, InferenceHandler)
    logging.info("Starting Predictive Maintenance Inference Server on http://127.0.0.1:%d", port)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logging.info("Stopping server...")
        httpd.server_close()


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    run_server(port)
