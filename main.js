const listadoPaises = document.querySelector("#lista-de-paises");
const botonBuscar = document.querySelector("#boton-buscar");
const barraBuscar = document.querySelector("#barra-buscar");
const paisSeleccionado = document.querySelector("#pais-seleccionado");
const botonVolver = document.querySelector("#boton-volver");
const botonFavoritos = document.querySelector("#boton-favoritos");
const detallesPaisSeleccionado = document.querySelector("#detalles-pais-seleccionado");
const imagenPaisSeleccionado = document.querySelector("#imagen-pais-seleccionado");
const informacionPais = document.querySelector("#informacionPais");
const filtroRegiones = document.querySelector("#region");
const filtroMonedas = document.querySelector("#moneda");
const filtroIdiomas = document.querySelector("#idioma");
const lineaFiltros = document.querySelector("#linea-filtros");
const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
var paises = [];

function cargarPaises(url) {
  // Limpiar datos de la busqueda anterior
  listadoPaises.textContent = "";
  detallesPaisSeleccionado.textContent = "";
  paisSeleccionado.style = "display:none";

  fetch(url)
    .then((res) => res.json())
    .then((datosPaises) => {
      paises = datosPaises;
      mostrarPaises(datosPaises);
    })
    // Mostrar mensaje en caso de error de búsqueda
    .catch(() => {
      const divErrorBusqueda = document.createElement("div");
      divErrorBusqueda.innerHTML = `
            <div class="card bg-danger text-white" style="margin-top:30px">
            <div class="card-body">No se ha encontrado ningún país según el criterio de búsqueda introducido.</div>
            </div>`;
      listadoPaises.appendChild(divErrorBusqueda);
    });
}

function mostrarPaises(datosPaises) {
  datosPaises.forEach((datos) => {
    let pais = document.createElement("div");
    pais.setAttribute("class", "card d-flex m-5 shadow");
    pais.style = "width: 18rem";

    let bandera = document.createElement("img");
    bandera.setAttribute("src", datos.flag);
    bandera.setAttribute("class", "card-img-top");

    let datosPais = document.createElement("div");
    datosPais.setAttribute("class", "card-body");

    let nombrePais = document.createElement("h2");
    nombrePais.textContent = datos.translations['es'];
    nombrePais.setAttribute("id", datos.name);
    // Mostrar si el pais es favorito
    if (favoritos.includes(datos.name))
      nombrePais.setAttribute("class", "favorito");
    else
      nombrePais.setAttribute("class", "card-title");

    let botonInformacion = document.createElement("button");
    botonInformacion.setAttribute(
      "class",
      "ver-informacion btn btn-outline-secondary"
    );
    botonInformacion.style.cssText =
      "padding: 5px 15px; margin-top: 20px;width:100%;font-weight: 700;color:black";
    botonInformacion.textContent = "Ver Información";

    datosPais.appendChild(nombrePais);
    datosPais.appendChild(botonInformacion);

    pais.appendChild(bandera);
    pais.appendChild(datosPais);

    listadoPaises.appendChild(pais);
  });
}

function limpiarFiltros(boton) {
  if (boton != "moneda")
   filtroMonedas.value = "";
  if (boton != "idioma")
   filtroIdiomas.value = "";
  if (boton != "region")
   filtroRegiones.value = "";
}

botonFavoritos.addEventListener("click", () => {
  // Muestra solo los paises favoritos de la busqueda actual
  var listadoPaisesSinFavoritos = document.querySelectorAll(".card-title");
  var listadoPaisesFavoritos = document.querySelectorAll(".favorito");

  listadoPaisesSinFavoritos.forEach((pais) => {
    pais.parentElement.parentElement.remove();
  });

  listadoPaisesFavoritos.forEach((pais) => {
    pais.parentElement.children[1].remove();
  });
});

botonBuscar.addEventListener("click", () => {
  let valorBusqueda = barraBuscar.value;
  limpiarFiltros("buscar");
  valorBusqueda.length > 0
    ? (url = "https://restcountries.eu/rest/v2/name/" + valorBusqueda)
    : (url = "https://restcountries.eu/rest/v2/all");
  cargarPaises(url);
});

filtroRegiones.addEventListener("change", () => {
  limpiarFiltros("region");
  filtroRegiones.value != ""
    ? (url = "https://restcountries.eu/rest/v2/region/" + filtroRegiones.value)
    : (url = "https://restcountries.eu/rest/v2/all");
  cargarPaises(url);
});

filtroMonedas.addEventListener("change", () => {
  limpiarFiltros("moneda");
  filtroMonedas.value != ""
    ? (url = "https://restcountries.eu/rest/v2/currency/" + filtroMonedas.value)
    : (url = "https://restcountries.eu/rest/v2/all");
  cargarPaises(url);
});

filtroIdiomas.addEventListener("change", () => {
  limpiarFiltros("idioma");
  filtroIdiomas.value != ""
    ? (url = "https://restcountries.eu/rest/v2/lang/" + filtroIdiomas.value)
    : (url = "https://restcountries.eu/rest/v2/all");
  cargarPaises(url);
});

listadoPaises.addEventListener("click", (e) => {
  let eventoSeleccionado = e.target;
  informacionPais.textContent = "";
  if (
    eventoSeleccionado.getAttribute("class") ===
    "ver-informacion btn btn-outline-secondary"
  ) {
    let paisPulsado = eventoSeleccionado.parentElement.parentElement;

    for (let i = 0; i < listadoPaises.children.length; i++) {
      if (listadoPaises.children[i] === paisPulsado) {
        // Ocultar lista de paises y mostrar la informacion del seleccionado
        detallesPaisSeleccionado.textContent = "";
        listadoPaises.style = "display:none;";
        paisSeleccionado.style = "display:block; margin-top: -50px";
        barraBuscar.style = "display:none";
        botonBuscar.style = "display:none";
        botonFavoritos.style = "display:none";
        lineaFiltros.style = "display:none";
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        let pais = paises[i];

        let nombrePais = document.createElement("h3");
        nombrePais.textContent = pais.translations['es'];
        nombrePais.style = "margin-bottom:30px;margin-top:20px";

        let bandera = document.createElement("img");
        bandera.setAttribute("src", pais.flag);
        bandera.setAttribute("class", "card-img-top");
        bandera.setAttribute("id", "imagen-pais-seleccionado");

        let monedas = "";
        pais.currencies.forEach((moneda, i) => {
          if (i != pais.currencies.length - 1)
            monedas += moneda.name + " (" + moneda.symbol + ") , ";
          else
           monedas += moneda.name + " (" + moneda.symbol + ")";
        });

        let idiomas = "";
        pais.languages.forEach((idioma, i) => {
          if (i != pais.languages.length - 1)
           idiomas += idioma.name + ", ";
          else
           idiomas += idioma.name;
        });

        let paisesFronterizos = pais.borders;
        let listadoPaisesFronterizos = document.createElement("div");
        if (paisesFronterizos.length == 0) {
          listadoPaisesFronterizos.textContent = "No hay países fronterizos";
        } else {
          paisesFronterizos.forEach((frontera, i) => {
            let textoFrontera = document.createElement("text");
            if (i != paisesFronterizos.length - 1)
              textoFrontera.textContent = frontera + ", ";
            else textoFrontera.textContent = frontera;
            textoFrontera.style = "margin-right: 5px";
            listadoPaisesFronterizos.appendChild(textoFrontera);
          });
        }

        let datosPais = document.createElement("div");
        datosPais.innerHTML =
          "<p><b>Nombre nativo: </b>" + pais.nativeName + "</p>" +
          "<p><b>Población: </b>" + pais.population + "</p>" +
          "<p><b>Región: </b>" + pais.region + "</p>" +
          "<p><b>Subregión: </b>" + pais.subregion + "</p>" +
          "<p><b>Capital: </b>" + pais.capital + "</p>" +
          "<p><b>Área: </b>" + (pais.area != null ? pais.area : "desconocida") + "</p>" +
          "<p><b>Latitud: </b>" + pais.latlng[0] + "</p>" +
          "<p><b>Longitud: </b>" + pais.latlng[1] + "</p>" +
          "<p><b>Zona horaria: </b>" + pais.timezones[0] + "</p>" +
          "<p><b>Dominio de nivel superior: </b>" + pais.topLevelDomain[0] + "</p>" +
          "<p><b>Monedas: </b>" + monedas + "</p>" +
          "<p><b>Idiomas: </b>" + idiomas + "</p>" +
          "<p><b>Prefijo móvil: </b>+" + pais.callingCodes + "</p>" +
          "<p><b>Países fronterizos: </b></p>" +
          listadoPaisesFronterizos.innerHTML;
        
        // Mapa de google maps según el nombre del país
        let mapa = document.createElement("div");
        mapa.style = "margin-top: 30px";
        let iframe = document.createElement("iframe");
        iframe.setAttribute(
          "src",
          "https://maps.google.com/maps?q=" +
            pais.name +
            "&t=&z=4&ie=UTF8&iwloc=&output=embed"
        );
        iframe.id = "mapa";
        iframe.style = "width:400px;height:300px;";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("marginheight", "0");
        iframe.setAttribute("marginwidth", "0");
        mapa.appendChild(iframe);

        informacionPais.appendChild(nombrePais);
        informacionPais.appendChild(datosPais);
        detallesPaisSeleccionado.appendChild(bandera);
        detallesPaisSeleccionado.appendChild(informacionPais);
        detallesPaisSeleccionado.appendChild(mapa);
        return;
      }
    }
  }
});

botonVolver.addEventListener("click", () => {
  // Mostrar listado de paises y ocultar el pais seleccionado
  barraBuscar.style = "display:flex";
  botonBuscar.style = "display:flex";
  botonFavoritos.style = "display:initial";
  lineaFiltros.style = "display:block; margin-top:-30px";
  listadoPaises.style = "display:flex;";
  paisSeleccionado.style = "display:none";
});

document.querySelector(".paises").addEventListener("click", (e) => {
  // Obtener el pais seleccionado
  var id = e.target.id,
    pais = e.target,
    posicion = favoritos.indexOf(id);
  // Marcar pais como favorito
  if (id != "lista-de-paises" && id != "")
    if (posicion == -1) {
      favoritos.push(id);
      pais.className = "favorito";
    }
    // eliminar favorito
    else {
      favoritos.splice(posicion, 1);
      pais.className = "card-title";
    }
  // Guardar el array en el almacenamiento local
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
});

// Cargar todos los paises al iniciar
cargarPaises("https://restcountries.eu/rest/v2/all");
