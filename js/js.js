
const API_BASE = "https://dragonball-api.com/api/characters";
const gridPersonajes = document.getElementById("grid-personajes");
const contenidoDetalle = document.getElementById("contenido-detalle");

if (gridPersonajes) {
  cargarPersonajes();
}

function cargarPersonajes() {
  const loading = document.getElementById("loading");
  
  fetch(`${API_BASE}?limit=30`)
    .then(respuesta => respuesta.json())
    .then(datos => {
      loading.style.display = "none";
      mostrarPersonajes(datos.items);
    })
    .catch(error => {
      console.error("Error al cargar personajes:", error);
      loading.textContent = "Error al cargar los personajes. Intenta de nuevo.";
    });
}

function mostrarPersonajes(personajes) {
  personajes.forEach(personaje => {
    const card = crearCardPersonaje(personaje);
    gridPersonajes.appendChild(card);
  });
}

function crearCardPersonaje(personaje) {
  const card = document.createElement("div");
  card.className = "character-card";
  
  card.innerHTML = `
    <img src="${personaje.image}" alt="${personaje.name}">
    <div class="card-info">
      <h3>${personaje.name}</h3>
      <p><span class="highlight">${personaje.race || "Desconocido"} - ${personaje.gender || "N/A"}</span></p>
      <p>Base KI:<br><strong>${personaje.ki || "0"}</strong></p>
      <p>Total KI:<br><strong>${personaje.maxKi || "0"}</strong></p>
      <p>Affiliation:<br><span class="highlight">${personaje.affiliation || "Desconocida"}</span></p>
    </div>
  `;
  
  card.addEventListener("click", () => {
    window.location.href = `html/detalle.html?id=${personaje.id}`;
  });
  
  return card;
}



if (contenidoDetalle) {
  cargarDetalle();
}

function cargarDetalle() {

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  
  if (!id) {
    contenidoDetalle.innerHTML = "<p style='text-align:center; padding:50px;'>No se encontró el personaje.</p>";
    return;
  }
  
  fetch(`${API_BASE}/${id}`)
    .then(respuesta => respuesta.json())
    .then(personaje => {
      mostrarDetalle(personaje);
    })
    .catch(error => {
      console.error("Error al cargar detalle:", error);
      contenidoDetalle.innerHTML = "<p style='text-align:center; padding:50px;'>Error al cargar la información.</p>";
    });
}

function mostrarDetalle(personaje) {
  contenidoDetalle.innerHTML = `
    <div class="info-principal">
      <div class="imagen-principal">
        <img src="${personaje.image}" alt="${personaje.name}">
      </div>
      
      <div class="datos-basicos">
        <h2>${personaje.name}</h2>
        <div class="stat-item">
          <strong>Raza:</strong> ${personaje.race}
        </div>
        <div class="stat-item">
          <strong>Género:</strong> ${personaje.gender}
        </div>
        <div class="stat-item">
          <strong>Ki Base:</strong> ${personaje.ki}
        </div>
        <div class="stat-item">
          <strong>Ki Máximo:</strong> ${personaje.maxKi}
        </div>
        <div class="stat-item">
          <strong>Afiliación:</strong> ${personaje.affiliation || "Desconocida"}
        </div>
      </div>
    </div>
    
    <!-- Pestañas -->
    <div class="pestanas">
      <button class="btn-pestana activa" data-tab="descripcion">Descripción</button>
      <button class="btn-pestana" data-tab="planeta">Planeta de Origen</button>
      <button class="btn-pestana" data-tab="transformaciones">Transformaciones</button>
    </div>
    
    <!-- Contenido de pestañas -->
    <div class="contenido-pestana activa" id="descripcion">
      <p class="descripcion-texto">${personaje.description || "No hay descripción disponible para este personaje."}</p>
    </div>
    
    <div class="contenido-pestana" id="planeta">
      <div id="info-planeta-container">Cargando información del planeta...</div>
    </div>
    
    <div class="contenido-pestana" id="transformaciones">
      <div id="transformaciones-container">Cargando transformaciones...</div>
    </div>
    
    <button class="btn-volver" onclick="window.location.href='../index.html'">← Volver al Inicio</button>
  `;

  configurarPestanas();
  
  
  cargarPlaneta(personaje.originPlanet);
  
 
  cargarTransformaciones(personaje.transformations);
}

function configurarPestanas() {
  const botones = document.querySelectorAll(".btn-pestana");
  const contenidos = document.querySelectorAll(".contenido-pestana");
  
  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      
      botones.forEach(b => b.classList.remove("activa"));
      contenidos.forEach(c => c.classList.remove("activa"));
      
      boton.classList.add("activa");
      const tabId = boton.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("activa");
    });
  });
}

function cargarPlaneta(planetaData) {
  const container = document.getElementById("info-planeta-container");
  
  if (!planetaData || !planetaData.name) {
    container.innerHTML = "<p>No hay información del planeta de origen.</p>";
    return;
  }
  
  container.innerHTML = `
    <div class="info-planeta">
      <h3>Planeta de Origen</h3>
      <div class="planeta-grid">
        <img src="${planetaData.image}" alt="${planetaData.name}">
        <div class="planeta-descripcion">
          <div class="planeta-nombre">${planetaData.name}</div>
          <p>${planetaData.description || "Información no disponible"}</p>
        </div>
      </div>
    </div>
  `;
}

function cargarTransformaciones(transformaciones) {
  const container = document.getElementById("transformaciones-container");
  
  if (!transformaciones || transformaciones.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Este personaje no tiene transformaciones registradas.</p>";
    return;
  }
  
  container.innerHTML = `
    <div class="grid-transformaciones">
      ${transformaciones.map(trans => `
        <div class="card-transformacion">
          <img src="${trans.image}" alt="${trans.name}">
          <h4>${trans.name}</h4>
          <p><strong>Ki:</strong> ${trans.ki || "Desconocido"}</p>
        </div>
      `).join("")}
    </div>
  `;
}