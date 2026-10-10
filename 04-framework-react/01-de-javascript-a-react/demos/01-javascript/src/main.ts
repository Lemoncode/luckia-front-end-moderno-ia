import "./styles.css";
let members = [{ id: 1, name: "Julia" }, { id: 2, name: "Evan" }];
const root = document.getElementById("root")!;
// Plantilla estática. Los nombres se insertan con textContent.
root.innerHTML = `<main>
  <h1>Equipo · JavaScript</h1>
  <p>Datos ficticios para la clase.</p>
  <label for="name">Nombre</label>
  <input id="name" />
  <button id="add">Añadir</button>
  <p id="total" aria-live="polite"></p>
  <ul id="list" class="space-y-2"></ul>
</main>`;
const input = document.querySelector<HTMLInputElement>("#name")!;
const list = document.querySelector<HTMLUListElement>("#list")!;
const total = document.getElementById("total")!;
function render() {
  total.textContent = `Personas: ${members.length}`;
  list.replaceChildren(...members.map(member => {
    const item = document.createElement("li");
    item.className = "rounded bg-white p-3";
    item.textContent = member.name;
    return item;
  }));
}
document.getElementById("add")!.addEventListener("click", () => {
  const name = input.value.trim();
  if (!name) return;
  members = [...members, { id: Date.now(), name }];
  // Prueba a comentar render(): cambian los datos, pero no la pantalla.
  render();
  input.value = "";
});
render();

