const semaforo1 = {
  value: 1,
  queue: [],
};

const semaforo2 = {
  value: 1,
  queue: [],
};

function iniciarSimulacion(sem) {
  if (sem === "Semaforo1") {
    ejecutarProceso(semaforo1, "Word", 2, 1);
    bloquearProceso(semaforo1, "Paint", 4, 2);
    bloquearProceso(semaforo1, "Spotify", 1, 3);
  } else if (sem === "Semaforo2") {
    ejecutarProceso(semaforo2, "VSCode", 3, 1);
    bloquearProceso(semaforo2, "Edge", 5, 2);
    bloquearProceso(semaforo2, "Fortnite", 2, 3);
  }
}

function ejecutarProceso(sem, proceso, tiempo, quantum) {
  mostrarEstado(sem, proceso, "Ejecutando");
  setTimeout(() => {
    liberarRecurso(sem);
    mostrarEstado(sem, proceso, "Terminado", tiempo);
  }, tiempo * quantum * 1000);
}

function bloquearProceso(sem, proceso, tiempo, quantum) {
  mostrarEstado(sem, proceso, "Bloqueado", 0, tiempo);
  setTimeout(() => {
    enqueueProceso(sem, proceso);
    intentarAsignarRecurso(sem);
  }, tiempo * quantum * 1000);
}

function mostrarEstado(
  sem,
  proceso,
  estado,
  tiempoEjecucion = 0,
  tiempoBloqueo = 0
) {
  const stateElement = document.getElementById(
    `${proceso.toLowerCase()}State${sem === semaforo1 ? "1" : "2"}`
  );
  const runtimeElement = document.getElementById(
    `${proceso.toLowerCase()}Runtime${sem === semaforo1 ? "1" : "2"}`
  );
  const blockTimeElement = document.getElementById(
    `${proceso.toLowerCase()}BlockTime${sem === semaforo1 ? "1" : "2"}`
  );

  // Obtener el contenedor correspondiente
  const container =
    sem === semaforo1
      ? document.getElementById("semaCont1")
      : document.getElementById("semaCont2");

  // Obtener los LEDs dentro del contenedor
  const led1 = container.querySelector(".led1");
  const led2 = container.querySelector(".led2");
  const led3 = container.querySelector(".led3");
  const led4 = container.querySelector(".led4");
  const led5 = container.querySelector(".led5");
  const led6 = container.querySelector(".led6");

  // Función para establecer el color del LED según el estado
  const setColor = (led, color) => {
    led.style.backgroundColor = color;
  };

  // Actualiza la tabla
  stateElement.textContent = estado;
  runtimeElement.textContent = tiempoEjecucion;
  blockTimeElement.textContent = tiempoBloqueo;

  // Actualiza la tabla de estado en tiempo real
  actualizarEstadoReal(sem, proceso, estado);

  // Actualiza los colores de los LEDs según el estado
  switch (estado) {
    case "Ejecutando":
      setColor(sem === semaforo1 ? led1 : led4, "green");
      setColor(sem === semaforo1 ? led2 : led5, "black");
      setColor(sem === semaforo1 ? led3 : led6, "black");
      break;
    case "Bloqueado":
      setColor(sem === semaforo1 ? led1 : led4, "black");
      setColor(sem === semaforo1 ? led2 : led5, "yellow");
      setColor(sem === semaforo1 ? led3 : led6, "black");
      break;
    case "Terminado":
      setColor(sem === semaforo1 ? led1 : led4, "black");
      setColor(sem === semaforo1 ? led2 : led5, "black");
      setColor(sem === semaforo1 ? led3 : led6, "red");
      break;
    default:
      /* todos los LEDs en negro */
      setColor(led1, "black");
      setColor(led2, "black");
      setColor(led3, "black");
      setColor(led4, "black");
      setColor(led5, "black");
      setColor(led6, "black");
  }
}

function enqueueProceso(sem, proceso) {
  sem.queue.push(proceso);
}

function intentarAsignarRecurso(sem) {
  if (sem.value > 0 && sem.queue.length > 0) {
    const proceso = sem.queue.shift();
    sem.value -= 1;
    ejecutarProceso(sem, proceso, 2, 1);
  }
}

function liberarRecurso(sem) {
  sem.value += 1;
  intentarAsignarRecurso(sem);
}

function actualizarEstadoReal(sem, proceso, estado) {
  const realTimeTable = document.getElementById(
    `realTimeTable${sem === semaforo1 ? "1" : "2"}`
  );
  const row = realTimeTable.insertRow(-1);
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  cell1.textContent = proceso;
  cell2.textContent = estado;
}
