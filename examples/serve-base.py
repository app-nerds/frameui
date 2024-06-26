from flask import Flask, send_from_directory, request, jsonify

app = Flask(__name__, static_folder="static")

@app.route("/")
def root():
	return send_from_directory("./", "base.html")

@app.route("/static/<path:path>")
def serve_static(path):
	return app.send_static_file(path)

@app.route("/api/projects")
def getProjects():
    return jsonify({
        "projects": [
            {
                "client": "Client 1",
                "id": 1,
                "title": "Project 2",
                "dueDate": "2024-01-01"
            },
            {
                "client": "Client 2",
                "id": 2,
                "title": "Project 1",
                "dueDate": "2024-02-02"
            },
            {
                "client": "Client 2",
                "id": 3,
                "title": "Project 3",
                "dueDate": "2024-02-03"
            },
            {
                "client": "Client 3",
                "id": 4,
                "title": "Project 4",
                "dueDate": "2024-02-04"
            },
            {
                "client": "Client 3",
                "id": 6,
                "title": "Project 5",
                "dueDate": "2024-02-05"
            },
            {
                "client": "Client 3",
                "id": 6,
                "title": "Project 6",
                "dueDate": "2024-02-06"
            },
        ],
        "totalCount": 6,
        "page": 1
    })

@app.route("/api/contacts")
def getContacts():
    page = int(request.args.get("page"))
    print(page)

    if page == 1:
        return jsonify({
            "contacts": [
                {
                    "id": 1,
                    "firstName": "Adam",
                    "lastName": "Presley",
                    "email": "adam@adampresley.com",
                    "phone": "555-666-1234",
                },
                {
                    "id": 2,
                    "firstName": "Maryanne",
                    "lastName": "Presley",
                    "email": "test1@test.com",
                    "phone": "555-666-1233",
                },
                {
                    "id": 3,
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "test2@test.com",
                    "phone": "555-666-1232",
                },
                {
                    "id": 4,
                    "firstName": "Jane",
                    "lastName": "Doe",
                    "email": "test3@test.com",
                    "phone": "555-666-1231",
                },
                {
                    "id": 5,
                    "firstName": "Bob",
                    "lastName": "Smith",
                    "email": "test4@test.com",
                    "phone": "555-666-1230",
                },
            ],
            "totalCount": 10,
            "page": page
        })

    if page == 2:
        return jsonify({
            "contacts": [
                {
                    "id": 6,
                    "firstName": "Jimmy",
                    "lastName": "Presley",
                    "email": "test5@test.com",
                    "phone": "555-666-1229",
                },
                {
                    "id": 7,
                    "firstName": "Sally",
                    "lastName": "Smith",
                    "email": "test6@test.com",
                    "phone": "555-666-1228",
                },
                {
                    "id": 8,
                    "firstName": "Joe",
                    "lastName": "Doe",
                    "email": "test7@test.com",
                    "phone": "555-666-1227",
                },
                {
                    "id": 9,
                    "firstName": "Jane",
                    "lastName": "Smith",
                    "email": "test8@test.com",
                    "phone": "555-666-1226",
                },
                {
                    "id": 10,
                    "firstName": "Bob",
                    "lastName": "Doe",
                    "email": "test9@test.com",
                    "phone": "555-666-1225",
                },
            ],
            "totalCount": 10,
            "page": page
        })

    return jsonify({
        "contacts": [],
        "totalCount": 10,
        "page": 0,
    })

if __name__ == "__main__":
	app.run(port=8000)
