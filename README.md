# nolatech-technical-test
### Descripcion
  
Prueba Técnica para Candidatura al Rol de Backend Developer - Nolatech

## Configuracion de proyecto
> [!IMPORTANT] Necesitas tener git instalado
- Paso 1: Clonar el proyecto
```bash
$git clone https://github.com/Cariea/nolatech-technical-test.git
```

- Paso 2: Dirigirse a directorio del proyecto desde el directorio donde se clono 
```bash
$cd nolatech-technical-test
```

- Paso 3: Instalar las dependencias (asegurese de tener node instalado)
```bash
$npm install
```

- Paso 4: buscar el archivo *.env.template* y renombrarlo como *.env*
  
- Paso 5: ejecutar el proyecto
- Puede hacerlo con un build y luego start
```bash
$npm run build
$npm run start
```
- O puede correrlo en modo desarrollo

```bash
 $npm run dev
```

- Puede encontrar la documentacion de los endpoints en el siguiente boton 👉🏼[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://universal-rocket-392745.postman.co/workspace/nolatech-test~ba80cf39-a7b2-4f6e-a262-f65f2311051b/collection/27759497-3aa08198-c7be-4a52-94ef-1c6205c17ffb?action=share&creator=27759497)

- Y en caso de algun problema con el boton la exporte y agregue el archivo al proyecto es el
```
  nolatech-test.postman_collection.json
```

# Explicacion de la estructura del proyecto y decisiones de diseño

La solucion esta basada en una arquitectura en capas como se sugirion en la prueba, el codigo se divide en modulos especificos
```
  /src
 ├── /_config        # Configuración de la aplicación, variables de entorno y base de datos
 ├── /_middlewares   # Middlewares personalizados para autenticación, autorización y validaciones
 ├── /_repositories  # Abstracion de los metodos de acceso a datos sobre MONGOOSE para aplicar el patron repository como se solicito  
 ├── /controllers    # Controladores que manejan las solicitudes HTTP y respuestas
 ├── /models         # Modelos de datos de MongoDB usando Mongoose
 ├── /routes         # Definición de rutas de la API
 ├── /services       # Lógica de negocio, acceso a datos y lógica de procesamiento de evaluaciones
 ├── /utils          # Funciones auxiliares (como formateo de datos)
 ├── /tests          # Pruebas unitarias e integración

```

Las evaluaciones y preguntas son documentos independientes creados por los managers. Un admin tiene la potestad de asignar un manager a un empleado; luego de esto, el manager puede asignarle al empleado evaluaciones de las que ha creado. En el documento de empleado se guarda una captura de cómo era la evaluación en ese momento, ya que estas pueden actualizarse y, de lo contrario, esto podría alterar los resultados más adelante.

Esta copia de la evaluación en sus propiedades es lo que el empleado puede considerar como una evaluación asignada y enviar una respuesta a esta con el ID de cada pregunta y la respuesta que dio. Una vez enviada su respuesta, el empleado no puede volver a contestar esa evaluación.

Luego, se genera el reporte de empleados, mostrando para cada empleado un arreglo de evaluaciones asignadas sin responder y otro de evaluaciones completadas con sus puntajes.

El cálculo de los puntajes no está del todo completo; es una simulación parcial debido al tiempo disponible.