import {db} from "./firebase-config.js"
import {
    getDocs,
    collection,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const alumnosCollection = collection(db, "Alumnos")
const materiasCollection = collection(db, "Materias")
const notasCollection = collection(db, "Nota")

//
async function obtenerAlumnos(){
    const q= query(alumnosCollection, orderBy("nombre"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc)=> ({id: doc.id, ...doc.data()}))
}

async function obtenerMaterias(){
    const q= query(materiasCollection, orderBy("nombre"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc)=> ({id: doc.id, ...doc.data()}))
}

async function obtenerNotas(){
    const q= query(notasCollection);
    return snapshot.docs.map((doc)=> ({id: doc.id, ...doc.data()}))
}

async function mostrarAlumnos() {
  try {
    const alumnos = await obtenerAlumnos();
    const container = document.getElementById("alumnosList");

    if (alumnos.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><div class="icon">👨‍🎓</div><p>No hay alumnos registrados</p></div>';
      return;
    }

    container.innerHTML = alumnos
      .map(
        (alumno) => `
        <div class="data-item">
            <strong>${alumno.nombre}</strong>
            <div class="detail">
                <span class="badge badge-grado">${alumno.grado}</span>
            </div>
        </div>
    `
      )
      .join("");

    document.getElementById("totalAlumnos").textContent = alumnos.length;
  } catch (error) {
    console.error("Error al mostrar alumnos:", error);
  }
}


async function mostrarMaterias() {
  try {
    const materias = await obtenerMaterias();
    const container = document.getElementById("materiasList");

    if (materias.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><div class="icon">👨‍🎓</div><p>No hay materias registradas</p></div>';
      return;
    }

    container.innerHTML = materias
      .map(
        (materia) => `
        <div class="data-item">
            <strong>${materia.nombre}</strong>
            <div class="detail">
                <span class="badge badge-grado">${materia.profesor}</span>
            </div>
        </div>
    `
      )
      .join("");

    document.getElementById("totalMaterias").textContent = materias.length;
  } catch (error) {
    console.error("Error al mostrar materias:", error);
  }
}

async function mostrarNotas() {
  try {
    const notas = await obtenerNotas();
    const materias = await obtenerMaterias();    
    const alumnos = await obtenerAlumnos();
    const container = document.getElementById("notasContainer");

    if (alumnos.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><div class="icon">👨‍🎓</div><p>No hay notas registradas</p></div>';
      return;
    }

    const alumnosMap = new Map(alumnos.map((alumno) => [alumno.id, alumno]));
    const materiasMap = new Map(materias.map((materia) => [materia.id, materia]));

    const notasConRelaciones = notas.map((nota) => {
    const alumno = alumnosMap.get(nota.alumnoId);
    const materia = materiasMap.get(nota.materiaId);
    return {
        ...nota,
        alumnoNombre: alumno ? alumno.nombre : "Desconocido",
        alumnoGrado: alumno ? alumno.grado : "",
        materiaNombre: materia ? materia.nombre : "Desconocida",
        materiaProfesor: materia ? materia.profesor : "",
    };
    });

    notasConRelaciones.sort((a, b) => a.alumnoNombre.localeCompare(b.alumnoNombre)
    );

    container.innerHTML = `
        <table class="notas-table">
            <thead>
                <tr>
                    <th>Alumno</th>
                    <th>Grado</th>
                    <th>Materia</th>
                    <th>Profesor</th>
                    <th>Nota</th>
                </tr>
            </thead>
            <tbody>
                ${notasConRelaciones
                  .map(
                    (nota) => `
                    <tr>
                        <td><strong>${nota.alumnoNombre}</strong></td>
                        <td>${nota.alumnoGrado}</td>
                        <td>${nota.materiaNombre}</td>
                        <td>${nota.materiaProfesor}</td>
                        <td>
                            <span class="badge badge-nota ${obtenerClaseNota(
                              nota.nota
                            )}">
                                ${nota.nota}
                            </span>
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;

    const promedio =
      notas.reduce((sum, nota) => sum + nota.nota, 0) / notas.length;
    document.getElementById("promedioGeneral").textContent =
      promedio.toFixed(1);
  } catch (error) {
    console.error("Error al mostrar notas:", error);
  }
}

//Carga de datos
async function cargarDatos() {
  try {
    await mostrarAlumnos();
    await mostrarMaterias();
    await mostrarNotas();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

//Funcion al ejecutar la pagina
async function init() {
  try {
    await cargarDatos();
  } catch (error) {
    console.error("Error al inicializar:", error);
  }
}


//Ejecutar cuando el html termino de cargar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

