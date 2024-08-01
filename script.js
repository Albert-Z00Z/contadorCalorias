const contadorCalorias = document.getElementById('contador-calorias');
const inputPresupuesto = document.getElementById('presupuesto');
const desplegableEntrada = document.getElementById('desplegable-entrada');
const botonAgregarEntrada = document.getElementById('agregar-entrada');
const botonLimpiar = document.getElementById('limpiar');
const resultado = document.getElementById('resultado');
let hayError = false;

function limpiarCadenaEntrada(cadena) {
  const regex = /[+-\s]/g;
  return cadena.replace(regex, '');
}

function esEntradaInvalida(cadena) {
  const regex = /\d+e\d+/i;
  return cadena.match(regex);
}

function agregarEntrada() {
    console.log('Botón Agregar Entrada clickeado'); // Depuración
    const contenedorInputObjetivo = document.querySelector(`#${desplegableEntrada.value} .contenedor-input`);
    
    if (!contenedorInputObjetivo) {
      console.error('Contenedor de entrada no encontrado');
      return;
    }
    
    const numeroEntrada = contenedorInputObjetivo.querySelectorAll('input[type="text"]').length + 1;
    const cadenaHTML = `
    <label for="${desplegableEntrada.value}-${numeroEntrada}-nombre">Nombre de la Entrada ${numeroEntrada}</label>
    <input type="text" id="${desplegableEntrada.value}-${numeroEntrada}-nombre" placeholder="Nombre" />
    <label for="${desplegableEntrada.value}-${numeroEntrada}-calorias">Calorías de la Entrada ${numeroEntrada}</label>
    <input
      type="number"
      min="0"
      id="${desplegableEntrada.value}-${numeroEntrada}-calorias"
      placeholder="Calorías"
    />`;
    
    contenedorInputObjetivo.insertAdjacentHTML('beforeend', cadenaHTML);
    console.log('Entrada añadida:', cadenaHTML); // Depuración
  }
  
  botonAgregarEntrada.addEventListener("click", agregarEntrada);  

function calcularCalorias(e) {
  e.preventDefault();
  hayError = false;

  const inputsNumeroDesayuno = document.querySelectorAll('#desayuno input[type=number]');
  const inputsNumeroAlmuerzo = document.querySelectorAll('#almuerzo input[type=number]');
  const inputsNumeroCena = document.querySelectorAll('#cena input[type=number]');
  const inputsNumeroMeriendas = document.querySelectorAll('#meriendas input[type=number]');
  const inputsNumeroEjercicio = document.querySelectorAll('#ejercicio input[type=number]');

  const caloriasDesayuno = obtenerCaloriasDeInputs(inputsNumeroDesayuno);
  const caloriasAlmuerzo = obtenerCaloriasDeInputs(inputsNumeroAlmuerzo);
  const caloriasCena = obtenerCaloriasDeInputs(inputsNumeroCena);
  const caloriasMeriendas = obtenerCaloriasDeInputs(inputsNumeroMeriendas);
  const caloriasEjercicio = obtenerCaloriasDeInputs(inputsNumeroEjercicio);
  const caloriasPresupuesto = obtenerCaloriasDeInputs([inputPresupuesto]);

  if (hayError) {
    return;
  }

  const caloriasConsumidas = caloriasDesayuno + caloriasAlmuerzo + caloriasCena + caloriasMeriendas;
  const caloriasRestantes = caloriasPresupuesto - caloriasConsumidas + caloriasEjercicio;
  const excedenteODeficit = caloriasRestantes < 0 ? 'Excedente' : 'Déficit';
  resultado.innerHTML = `
  <span class="${excedenteODeficit.toLowerCase()}">${Math.abs(caloriasRestantes)} Calorías ${excedenteODeficit}</span>
  <hr>
  <p>${caloriasPresupuesto} Calorías Presupuestadas</p>
  <p>${caloriasConsumidas} Calorías Consumidas</p>
  <p>${caloriasEjercicio} Calorías Quemadas</p>
  `;

  resultado.classList.remove('ocultar');
}

function obtenerCaloriasDeInputs(lista) {
  let calorias = 0;

  for (const item of lista) {
    const valorActual = limpiarCadenaEntrada(item.value);
    const entradaInvalida = esEntradaInvalida(valorActual);

    if (entradaInvalida) {
      alert(`Entrada inválida: ${entradaInvalida[0]}`);
      hayError = true;
      return null;
    }
    calorias += Number(valorActual);
  }
  return calorias;
}

function limpiarFormulario() {
  const contenedoresInput = Array.from(document.querySelectorAll('.contenedor-input'));

  for (const contenedor of contenedoresInput) {
    contenedor.innerHTML = '';
  }

  inputPresupuesto.value = '';
  resultado.innerText = '';
  resultado.classList.add('ocultar');
}

botonAgregarEntrada.addEventListener("click", agregarEntrada);
contadorCalorias.addEventListener("submit", calcularCalorias);
botonLimpiar.addEventListener('click', limpiarFormulario);
