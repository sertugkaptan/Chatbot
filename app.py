from flask import Flask, render_template, request, jsonify, redirect, url_for
from chat import get_response
import xlrd
import openpyxl
import xlsxwriter

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

@app.post("/questionare")
def questionare():
    text = request.get_json().get("message")
    workbook = openpyxl.load_workbook('write_data.xlsx')
    worksheet = workbook['Sheet1']

    # Give the location of the file
    loc = ("write_data.xlsx")
    # To open Workbook
    wb = xlrd.open_workbook(loc)
    sheet = wb.sheet_by_index(0)
    val = 'A' + str(sheet.nrows+1)
    worksheet[val] = int(text)
    workbook.save('write_data.xlsx')
    message = {"answer": "Thank you for your feedback"}
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug = True)