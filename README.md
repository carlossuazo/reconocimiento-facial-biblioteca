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
* **Contenedores:** Docker y Docker Compose

---

## 🛠️ Instalación y Puesta en Marcha

Hay dos formas de levantar el proyecto: con **Docker** (recomendada, todo automático) o con una **instalación local** de Node y PostgreSQL en tu máquina.

### Configuración común: variables de entorno

Tanto la aplicación como la base de datos leen su configuración de un archivo `.env` en la raíz del proyecto. Copiá la plantilla incluida y ajustá los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `123456` |
| `DB_NAME` | Nombre de la base de datos | `biblioteca_db` |
| `DB_HOST` | Host de la base (para ejecución local) | `localhost` |
| `DB_PORT` | Puerto de la base en tu máquina | `5434` |
| `PORT` | Puerto donde escucha la aplicación | `3002` |

> El archivo `.env` está ignorado por git para no exponer credenciales. **Nunca lo subas al repositorio.**

---

### Opción A: Con Docker (recomendada)

Levanta la base de datos y la aplicación juntas con un solo comando. No necesitás instalar Node ni PostgreSQL.

**Prerrequisitos:** [Docker y Docker Compose](https://docs.docker.com/get-docker/).

1.  **Cloná el repositorio:**
    ```bash
    git clone https://github.com/carlossuazo/reconocimiento-facial-biblioteca.git
    cd reconocimiento-facial-biblioteca
    ```

2.  **Creá tu archivo `.env`** (ver sección anterior):
    ```bash
    cp .env.example .env
    ```

3.  **Levantá todo el stack:**
    ```bash
    docker compose up -d --build
    ```

Esto construye la imagen de la app, levanta PostgreSQL con un volumen persistente y arranca el servidor. La aplicación queda disponible en **http://localhost:3002** (o el puerto que definas en `PORT`).

**Comandos útiles:**
```bash
docker compose ps           # ver estado de los contenedores
docker compose logs -f app  # ver logs de la app en vivo
docker compose down         # detener el stack (los datos persisten)
docker compose down -v      # detener y BORRAR los datos de la base
```

> Dentro de la red de Docker la app se conecta a la base por el nombre de servicio `db` en el puerto interno `5432`. Esos valores se sobreescriben automáticamente en `docker-compose.yml`, así que no necesitás tocar `DB_HOST`/`DB_PORT` del `.env` para esto.

---

### Opción B: Instalación local (sin Docker)

**Prerrequisitos:**

* **Node.js** (versión 14 o superior) - [Descargar](https://nodejs.org/)
* **PostgreSQL** (versión 12 o superior) - [Descargar](https://www.postgresql.org/download/)
* **Git** - [Descargar](https://git-scm.com/downloads)

1.  **Cloná el repositorio:**
    ```bash
    git clone https://github.com/carlossuazo/reconocimiento-facial-biblioteca.git
    cd reconocimiento-facial-biblioteca
    ```

2.  **Instalá las dependencias:**
    ```bash
    npm install
    ```

3.  **Creá la base de datos.** Abrí la terminal de PostgreSQL (`psql`) y ejecutá:
    ```sql
    CREATE DATABASE biblioteca_db;
    ```
    Las tablas (`estudiantes`, `logs_acceso`) se crean automáticamente al arrancar el servidor.

4.  **Configurá tu archivo `.env`** apuntando a tu PostgreSQL local — normalmente `DB_HOST=localhost` y `DB_PORT=5432`.

5.  **Creá la carpeta `uploads`** en la raíz del proyecto (ahí se guardan las fotos de los estudiantes):
    ```bash
    mkdir -p uploads
    ```

6.  **Iniciá el servidor:**
    ```bash
    npm start
    ```

La aplicación queda disponible en **http://localhost:3002** (o el puerto definido en `PORT`).

---

### Modelos de `face-api.js`

Los modelos ya vienen incluidos en el repositorio. Si necesitaras reinstalarlos, descargá los [pesos (weights)](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) y colocá todos los archivos dentro de la carpeta `public/models`.

---

### 💡 Nota sobre conflictos de puertos

Si los puertos `5434` (base) o `3002` (app) ya están en uso por otro proyecto, cambiá `DB_PORT` y/o `PORT` en tu `.env` por puertos libres. Como toda la configuración sale de un solo lugar, no hace falta tocar el código:

```bash
# Ejemplo: mover la base al 5435 y la app al 3005
DB_PORT=5435
PORT=3005
```
