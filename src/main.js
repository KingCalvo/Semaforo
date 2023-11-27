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

  stateElement.textContent = estado;
  runtimeElement.textContent = tiempoEjecucion;
  blockTimeElement.textContent = tiempoBloqueo;

  // También actualizamos la tabla de estado en tiempo real
  actualizarEstadoReal(sem, proceso, estado);
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
