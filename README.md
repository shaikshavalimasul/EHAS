# Exam Hall Allocation System - STEP BY STEP WINDOWS CMD

## IMPORTANT: Use CMD Terminal
VSCode Terminal → + → Select Command Prompt

**Verify current dir:**
```
dir
```
See requirements.txt

## EXACT COMMANDS (copy-paste each):

1. **Create venv:**
```
py -3 -m venv venv
```

2. **Activate (CMD):**
```
venv\Scripts\activate.bat
```
Prompt: (venv) C:\...

3. **Verify pip:**
```
pip --version
```
If error:
```
python -m ensurepip
python -m pip install --upgrade pip
```

4. **Install:**
```
pip install -r requirements.txt
```

5. **Copy .env:**
```
copy .env.example .env
```

6. **Edit .env (notepad):**
```
notepad .env
```
Add your Mongo URI and Weather key. Save.

7. **Run:**
```
uvicorn main:app --reload
```
Success: http://localhost:8000/docs

## Frontend (new CMD):
```
cd ..\frontend
npm install
npm run dev
