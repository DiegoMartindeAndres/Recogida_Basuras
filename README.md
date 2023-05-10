# ASIOT

Aplicación para monitorizar información acerca del almacenamiento de cubos de basura a tiempo real a través de MQTT. 

Para lanzar la base de datos ejecutar `docker-compose up -d`

Para lanzar las seeds: `npm run seed`

Para lanzar la aplicación: `npm start`

**Desarrollo del proyecto**:
Una de las amenazas de este siglo es el calentamiento global. Necesitamos reducir la emisión de residuos y hacer campañas de concienciación para reciclar y así conseguir evitar que se produzcan efectos dañinos e irreversibles para el planeta.

Existen zonas donde hay que pasar a recoger la basura cada dos días, y otras donde se requieren que se pase a recoger dos veces al día. Esto significa no solo un desperdicio de recursos, si no que además no se trazan rutas óptimas de recogida.

Nuestro objetivo va a ser el diseño de un sistema de monitorización de cubos de basura utilizando la red LoRaWAN para optimizar las recogidas de estas. Para ello introduciremos sensores de luz que indican hasta dónde se ha llenado el cubo basura, información que llevaremos a un microprocesador que la procesa y la envía a una pasarela a través de LoRa y a partir de ahí, se envía a un servidor a través de internet. El servidor contiene una pequeña aplicación diseñada en JavaScript con ayuda de node, la cual se conecta a TheThingsNetwork por medio de MQTT. De esta manera, MQTT es capaz de enviar y recibir mensajes de una nube de dispositivos IoT. Además, también es super eficiente, ya que sus mensajes pueden ocupar un mínimo de 2 bytes. Además, es muy escalable, muy seguro y muy versátil, ya que se puede emplear con lenguajes como Python.

La aplicación JavaScript está dividida principalmente en dos partes: una que está pendiente de los mensajes de MQTT, y otra que se encarga de presentar al usuario el sistema por medio de una interfaz web.
Una vez llegan los mensajes al script que está pendiente de MQTT, ésta los manda a una base de datos, donde posteriormente la parte web los extrae para dibujarlos en el mapa. 

Para conseguir una sincronización perfecta de los datos en tiempo real necesitábamos una base de datos que lo soportase de manera nativa. Por esta razón hemos escogido PouchDB. PouchDB es una base de datos basada en CouchDB, es decir, una base de datos NoSQL. PouchDB se replica de manera nativa en memoria y en sitios remotos, por lo que de esta manera tendríamos cubierta la parte de sincronización.

Además, para dotar todo de una mayor versatilidad decidimos instalarla en un Docker.
  
**Link al Vídeo:**
https://youtu.be/IlGCvCjNlHY
