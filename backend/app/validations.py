from flask import jsonify


def validates(rule: dict, data: dict):
    errors = {}

    for field, rules_field in rule.items():
        value = data.get(field)

        if rules_field.get("required") and (value is None or value == ' '):
            errors[field] = f"El campo '{field}' es obligatorio."
            continue

        if value is None:
            continue

        expected = rules_field.get("type")
        if expected and not isinstance(value, expected):
            errors[field] = f"El campo '{field}' debe de ser de tipo {expected.__name__}."

        if isinstance(value, str):
            min_len = rules_field.get('min_length')
            max_len = rules_field.get('max_length')

            if min_len and len(value.strip()) < min_len:
                errors[field] = f"'{field}' debe tener al menos {min_len} caracteres."
            elif max_len and len(value) > max_len:
                errors[field] = f"'{field}' no puede superar los {max_len} caracteres."

        if isinstance(value, (int, float)):
            min_val = rules_field.get("min_value")
            max_val = rules_field.get("max_value")

            if min_val is not None and value < min_val:
                errors[field] = f"'{field}' debe ser al menos {min_val}."
            elif max_val is not None and value > max_val:
                errors[field] = f"'{field}' no puede ser mayor que {max_val}."

        allowed = rules_field.get("allowed")
        if allowed is not None and value not in allowed:
            errors[field] = f"'{field}' debe ser uno de: {allowed}."
 
    if errors:
        return jsonify({"errors": errors}), 400
 
    return None, None