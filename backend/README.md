# Backend

To run backend:

```
python3 -m venv venv
./venv/bin/pip3 install -r requirements.txt
./venv/bin/python3 scanners/main.py
./venv/bin/uvicorn main:app --reload --app-dir api
```

