# Instrucciones para Configurar EmailJS

## ¿Qué es EmailJS?
EmailJS es un servicio gratuito que permite enviar correos electrónicos directamente desde tu sitio web sin necesidad de un servidor backend.

## Pasos para Configurar EmailJS

### 1. Crear una cuenta en EmailJS
1. Ve a https://www.emailjs.com/
2. Haz clic en "Sign Up" (Registrarse)
3. Crea tu cuenta (puedes usar tu email de Google)

### 2. Configurar un Servicio de Email
1. Una vez dentro de tu cuenta, ve a "Email Services" en el menú lateral
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail recomendado si usas Gmail)
4. Sigue las instrucciones para conectar tu cuenta de email
5. IMPORTANTE: Usa el email licgubitosimicaela@gmail.com como cuenta de destino
6. Anota el Service ID que se te asignará

### 3. Crear una Plantilla de Email
1. Ve a "Email Templates" en el menú lateral
2. Haz clic en "Create New Template"
3. Configura la plantilla con el asunto: Nueva consulta de {{from_name}}
4. En el contenido incluye los campos: {{from_name}}, {{from_email}}, {{country}}, {{phone}}, {{message}}
5. En "To Email" asegúrate de que esté: licgubitosimicaela@gmail.com
6. Haz clic en "Save"
7. Anota el Template ID que se te asignará

### 4. Obtener tu Public Key
1. Ve a "Account" en el menú lateral
2. En la sección "API Keys", encontrarás tu Public Key
3. Cópiala

### 5. Configurar el Código
1. Abre el archivo psico/js/main.js
2. Busca la sección EMAILJS_CONFIG (alrededor de la línea 19)
3. Reemplaza los valores con tus credenciales reales

### 6. Verificar que Funciona
1. Abre tu sitio web en el navegador
2. Completa el formulario de contacto con datos de prueba
3. Envía el formulario
4. Revisa tu bandeja de entrada en licgubitosimicaela@gmail.com

## Plan Gratuito de EmailJS
- 200 emails por mes (suficiente para la mayoría de sitios)
- Sin necesidad de tarjeta de crédito
- Configuración rápida

## Solución de Error 400 (Bad Request)

Si recibes un error 400 al enviar el formulario, significa que los nombres de las variables en tu plantilla de EmailJS no coinciden con el código.

### Verificar la Plantilla de EmailJS

1. Ve a tu cuenta de EmailJS → "Email Templates"
2. Abre tu plantilla (template_nagrkmc)
3. Asegúrate de que la plantilla use EXACTAMENTE estos nombres de variables:

**Asunto (Subject):**
```
Nueva consulta de {{from_name}}
```

**Contenido (Content):**
```
Hola Micaela,

Has recibido una nueva consulta desde tu sitio web:

Nombre: {{from_name}}
Email: {{from_email}}
País: {{country}}
Teléfono: {{phone}}

Mensaje:
{{message}}

---
Este mensaje fue enviado desde el formulario de contacto de tu sitio web.
```

**Configuración importante:**
- **To Email**: `licgubitosimicaela@gmail.com`
- **From Name**: `Sitio Web - Formulario de Contacto`
- **From Email**: Puedes dejarlo vacío o usar `noreply@emailjs.com`

### Nombres de Variables que DEBES usar:
- `{{from_name}}` - Nombre del usuario
- `{{from_email}}` - Email del usuario
- `{{country}}` - País de residencia
- `{{phone}}` - Teléfono (opcional)
- `{{message}}` - Mensaje del usuario

**IMPORTANTE**: Los nombres deben ser exactamente como se muestran arriba (con guiones bajos, sin espacios, en minúsculas).

### Después de actualizar la plantilla:
1. Guarda los cambios en EmailJS
2. Prueba el formulario nuevamente
3. Revisa la consola del navegador (F12) para ver si hay más detalles del error
