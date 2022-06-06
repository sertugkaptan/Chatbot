from flask import Flask, render_template, request, jsonify, redirect, url_for

from chat import get_response

app = Flask(__name__)

@app.get("/")
def index_get():
    return render_template("base.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    # TODO: check if text is valid
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)

@app.get("/piechart/")
def piechart():
    return render_template("piechart.html")

@app.get("/transportation/")
def transportation():
    return render_template("transportation.html")

@app.get("/ceng/")
def ceng():
    return render_template("ceng.html")

if __name__ == "__main__":
    app.run(debug = True)