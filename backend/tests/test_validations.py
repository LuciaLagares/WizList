from flask import Flask

from app.validations import validates


def test_validates_required_field():
    app = Flask(__name__)
    rule = {"name": {"required": True, "type": str}}
    data = {}

    with app.app_context():
        response, status = validates(rule, data)

    assert status == 400
    assert response.get_json() == {
        "errors": {
            "name": "El campo 'name' es obligatorio."
        }
    }


def test_validates_type_and_min_length():
    app = Flask(__name__)
    rule = {"name": {"required": True, "type": str, "min_length": 3}}
    data = {"name": 42}

    with app.app_context():
        response, status = validates(rule, data)

    assert status == 400
    assert response.get_json()["errors"]["name"] == "El campo 'name' debe de ser de tipo str."


def test_validates_allowed_values():
    app = Flask(__name__)
    rule = {"status": {"allowed": ["active", "inactive"]}}
    data = {"status": "pending"}

    with app.app_context():
        response, status = validates(rule, data)

    assert status == 400
    assert response.get_json()["errors"]["status"] == "'status' debe ser uno de: ['active', 'inactive']."


def test_validates_returns_none_for_valid_data():
    app = Flask(__name__)
    rule = {
        "name": {"required": True, "type": str, "min_length": 3},
        "age": {"type": int, "min_value": 0},
        "status": {"allowed": ["active", "inactive"]},
    }
    data = {"name": "Merlin", "age": 120, "status": "active"}

    with app.app_context():
        response, status = validates(rule, data)

    assert response is None
    assert status is None
