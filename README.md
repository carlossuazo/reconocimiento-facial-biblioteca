# Sistema de Control de Acceso con Reconocimiento Facial

Este es un proyecto de aplicación web full-stack diseñado para gestionar y automatizar el acceso a una biblioteca mediante reconocimiento facial. Permite el registro de estudiantes, capturando su foto, nombre y DNI, y posteriormente utiliza la cámara de un dispositivo para identificar al estudiante y registrar su entrada de forma automática.

---

## Características

* **Registro de Estudiantes:** Captura de datos y foto a través de la cámara web.
* **Reconocimiento Facial en Tiempo Real:** Utiliza `face-api.js` para identificar estudiantes.
* **Control de Acceso Automatizado:** Guarda un registro de entrada al identificar a un estudiante.
* **Paneles de Administración:** Vistas para gestionar estudiantes y consultar el historial de accesos.
* **Almacenamiento de Imágenes:** Las fotos de los estudiantes se guardan en el sistema de archivos del servidor.

---

## ⚙️ Tecnologías Utilizadas

* **Backend:** Node.js, Express.js
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Reconocimiento Facial:** `face-api.js`
* **Base de Datos:** PostgreSQL

---

## 🛠️ Instalación y Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### **1. Prerrequisitos (Instalación de Herramientas)**

Debes tener instaladas las siguientes herramientas en tu sistema:

* **Node.js:** (Versión 14 o superior) - [Descargar Node.js](https://nodejs.org/)
* **PostgreSQL:** (Versión 12 o superior) - [Descargar PostgreSQL](https://www.postgresql.org/download/)
* **Git:** Para clonar el repositorio - [Descargar Git](https://git-scm.com/downloads)

### **2. Configuración de la Base de Datos**

Es necesario crear una base de datos y un usuario para que la aplicación pueda conectarse.

1.  **Abre la terminal de PostgreSQL (`psql`):**

2.  **Ejecuta los siguientes comandos SQL** para crear la base de datos y el usuario. Reemplaza `tu_usuario` y `tu_contraseña` por las credenciales que prefieras:

    ```sql
    -- Crear un nuevo usuario (rol) con contraseña
    CREATE USER tu_usuario WITH ENCRYPTED PASSWORD 'tu_contraseña';

    -- Crear la base de datos
    CREATE DATABASE biblioteca_db;

    -- Otorgar todos los privilegios de la base de datos al nuevo usuario
    GRANT ALL PRIVILEGES ON DATABASE biblioteca_db TO tu_usuario;
    ```

### **3. Puesta en Marcha del Proyecto**

1.  **Clona el repositorio:**
    Abre una terminal normal (no la de `psql`) y ejecuta:
    ```bash
    git clone [https://github.com/carlossuazo/reconocimiento-facial-biblioteca.git](https://github.com/carlossuazo/reconocimiento-facial-biblioteca.git)
    cd reconocimiento-facial-biblioteca
    ```

2.  **Instala las dependencias del proyecto:**
    Este comando leerá el archivo `package.json` y descargará todas las librerías necesarias (Express, pg, etc.).
    ```bash
    npm install
    ```

3.  **Descarga los modelos de `face-api.js`:**
    * Ve al repositorio de `face-api.js` en la sección de [pesos (weights)](https://github.com/justadudewhohacks/face-api.js/tree/master/weights).
    * Descarga todos los archivos de esa carpeta.
    * Crea la siguiente estructura de carpetas: `public/models`.
    * **Coloca todos los archivos descargados dentro de la carpeta `public/models`**.

4.  **Configura la conexión a la base de datos:**
    * Abre el archivo `db.js` en tu editor de código.
    * Modifica el objeto `Pool` con el usuario y la contraseña que creaste en el paso anterior.
    ```javascript
    const pool = new Pool({
      user: 'tu_usuario_postgres', // TU USUARIO CREADO
      host: 'localhost',
      database: 'biblioteca_db',
      password: 'tu_contraseña_postgres', // TU CONTRASEÑA
      port: 5432,
    });
    ```

5.  **Crea la carpeta `uploads`:**
    En la raíz del proyecto, crea una carpeta llamada `uploads`. Aquí se guardarán las fotos de los estudiantes.

### **4. Ejecución del Proyecto**

Una vez completada la configuración, inicia el servidor:

```bash
npm start
