### cambios en HTML ###
se agregó a las funciones agregarGasto y updateGastos, la siguiente cabecera: 
headers: {
    "Content-Type": "application/json"
  },

Esto para decir que estamos haciendo intercambio de información en formato JSON.
-----------------------------------------
# carpeta data:
se crean los archivos con los objetos gastos y roommates que van a tener la llave con un arreglo vació, donde se llenará con cada registro de los gastos y los registros de los roommates, respectivamente.

# carpeta modelos:
en esta carpeta se va a operar solamente con los archivos roommates.js y gastos.js

# carpeta routes:
aquí también vamos a tener una ruta para los gastos y para los roommates

# carpeta servicios:
aquí se implementará el servicio para enviar correo electrónico a los roommates cuando se registre un  nuevo gasto. Se agrega un correo personal para verificar la funcionalidad.
  

