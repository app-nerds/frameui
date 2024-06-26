from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="static")

@app.route("/")
def root():
	return send_from_directory("./", "admin-top-nav.html")

@app.route("/static/<path:path>")
def serve_static(path):
	return app.send_static_file(path)

if __name__ == "__main__":
	app.run(port=8000)

