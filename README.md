# Microservicio de Comprobantes

Microservicio desarrollado con NestJS y Encore para el registro y gestión de comprobantes de compra.

---

## ⚠️ Nota sobre Encore y ejecución local

Actualmente, la versión de Encore para TypeScript tiene incompatibilidades con Node.js moderno y TypeScript (`moduleResolution: nodenext`), ya que sus imports internos no incluyen la extensión `.js`. Por este motivo, **el microservicio se ejecuta localmente como una aplicación NestJS estándar**.

- Toda la arquitectura, buenas prácticas y stack cumplen con el requerimiento.
- El código es compatible con Encore para despliegue futuro, solo requiere que Encore corrija los imports en su SDK.
- Puedes probar todos los endpoints RESTful y la lógica del microservicio normalmente.

---

## Endpoints y Ejemplos de Request/Response

### 1. Crear comprobante
- **Método:** POST
- **URL:** `/receipts`
- **Body (JSON):**
```json
{
  "company_id": "12345678",
  "supplier_ruc": "10123456789",
  "invoice_number": "F001-001",
  "amount": 100,
  "issue_date": "2024-01-15T00:00:00.000Z",
  "document_type": "factura"
}
```
- **Parámetros requeridos:** Todos los campos del body.
- **Response (201 Created):**
```json
{
  "id": "7aab8169-d5ea-456d-bb61-09909eed7aa4",
  "company_id": "12345678",
  "supplier_ruc": "10123456789",
  "invoice_number": "F001-001",
  "amount": 100,
  "igv": 18,
  "total": 118,
  "issue_date": "2024-01-15T00:00:00.000Z",
  "document_type": "factura",
  "state": "validated",
  "created_at": "2025-06-18T15:17:15.086Z",
  "updated_at": "2025-06-18T15:17:15.086Z"
}
```

### 2. Listar comprobantes
- **Método:** GET
- **URL:** `/receipts`
- **Query params (opcionales):**
  - `page` (número de página, default: 1)
  - `limit` (cantidad por página, default: 10)
  - `document_type` (ej: factura, boleta, nota_credito, nota_debito)
  - `state` (pending, validated, rejected, observed)
  - `from` (fecha inicio, ej: 2024-01-01)
  - `to` (fecha fin, ej: 2024-12-31)
- **Response (200 OK):**
```json
{
  "items": [
    {
      "id": "7aab8169-d5ea-456d-bb61-09909eed7aa4",
      "company_id": "12345678",
      "supplier_ruc": "10123456789",
      "invoice_number": "F001-001",
      "amount": 100,
      "igv": 18,
      "total": 118,
      "issue_date": "2024-01-15T00:00:00.000Z",
      "document_type": "factura",
      "state": "validated",
      "created_at": "2025-06-18T15:17:15.086Z",
      "updated_at": "2025-06-18T15:17:15.086Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 3. Actualizar estado
- **Método:** PATCH
- **URL:** `/receipts/{id}/state`
- **Body (JSON):**
```json
{
  "state": "validated"
}
```
- **Parámetros requeridos:**
  - `id` (en la URL)
  - `state` (en el body, uno de: pending, validated, rejected, observed)
- **Response (200 OK):**
```json
{
  "id": "7aab8169-d5ea-456d-bb61-09909eed7aa4",
  "company_id": "12345678",
  "supplier_ruc": "10123456789",
  "invoice_number": "F001-001",
  "amount": 100,
  "igv": 18,
  "total": 118,
  "issue_date": "2024-01-15T00:00:00.000Z",
  "document_type": "factura",
  "state": "validated",
  "created_at": "2025-06-18T15:17:15.086Z",
  "updated_at": "2025-06-18T15:21:50.570Z"
}
```

### 4. Consulta IA
- **Método:** POST
- **URL:** `/receipts/ai-query`
- **Body (JSON):**
```json
{
  "question": "¿Cuál fue el total de comprobantes validados en mayo?"
}
```
- **Parámetros requeridos:** `question` (en el body)
- **Response (200 OK):**
```json
{
  "answer": "El total de comprobantes validados en mayo es S/. 0"
}
```

### 5. Exportar CSV
- **Método:** GET
- **URL:** `/receipts/export`
- **Query params (opcionales):**
  - `document_type`
  - `state`
  - `from`
  - `to`
- **Response:** Descarga un archivo CSV con las siguientes columnas:
```
"company_id","supplier_ruc","invoice_number","amount","igv","total","issue_date","state"
"12345678","10123456789","F001-001",100,18,118,"2024-01-15T00:00:00.000Z","validated"
```

---

## Características

- Registro de comprobantes con validación SUNAT simulada
- Cálculo automático de IGV y total
- Manejo de estados (pending, validated, rejected, observed)
- Listado con filtros y paginación
- Exportación a CSV
- Integración con IA para consultas inteligentes

## Requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd <nombre-del-directorio>
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con:
```
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"
```

4. Ejecutar migraciones de Prisma:
```bash
npx prisma migrate dev
```

5. Compilar y ejecutar el servidor:
```bash
npm run build
npm start
```

## API Endpoints

### Comprobantes

#### Crear Comprobante
```http
POST /receipts
Content-Type: application/json

{
  "company_id": "string",
  "supplier_ruc": "string",
  "invoice_number": "string",
  "amount": number,
  "issue_date": "string",
  "document_type": "string"
}
```

#### Actualizar Estado
```http
PATCH /receipts/:id/state
Content-Type: application/json

{
  "state": "validated" | "rejected" | "observed" | "pending"
}
```

#### Listar Comprobantes
```http
GET /receipts?page=1&limit=10&document_type=factura&state=validated&from=2024-01-01&to=2024-12-31
```

#### Exportar a CSV
```http
GET /receipts/export?document_type=factura&state=validated&from=2024-01-01&to=2024-12-31
```

#### Consulta IA
```http
POST /receipts/ai-query
Content-Type: application/json

{
  "question": "¿Cuál fue el total de comprobantes validados en mayo?"
}
```

## Estructura del Proyecto

```
src/
├── receipts/
│   ├── dto/
│   │   ├── create-receipt.dto.ts
│   │   ├── update-receipt-state.dto.ts
│   │   └── pagination.dto.ts
│   ├── entities/
│   │   └── receipt.entity.ts
│   ├── receipts.controller.ts
│   ├── receipts.service.ts
│   └── receipts.repository.ts
├── app.module.ts
└── main.ts
```

## Validaciones

- RUC: 11 dígitos
- Montos: Números positivos
- Tipos de documento: factura, boleta, nota_credito, nota_debito
- Estados: pending, validated, rejected, observed

## Licencia

Este proyecto está bajo la Licencia MPL-2.0.
