FROM python:3.11-slim

# Pasta de trabalho dentro do container
WORKDIR /app

# Copia dependências
COPY requirements.txt .

# Instala dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código
COPY app ./app

# Expõe a porta do backend
EXPOSE 8000

# Comando para subir a API
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

