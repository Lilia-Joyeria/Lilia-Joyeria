/* ============================================================
   carrito.js — lógica de carrito compartida en todas las páginas
   Guarda en localStorage bajo la clave "lilia_carrito"
   ============================================================ */

const Carrito = (() => {

    const KEY = "lilia_carrito";

    // ── Leer / escribir ──────────────────────────────────────
    function leer() {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch { return []; }
    }
    function guardar(items) {
        localStorage.setItem(KEY, JSON.stringify(items));
        actualizarBadge();
    }

    // ── ID único por producto + talla ────────────────────────
    function crearId(nombre, talla) {
        return nombre + "__" + (talla || "unica");
    }

    // ── Agregar ──────────────────────────────────────────────
    function agregar(producto, talla) {
        const items = leer();
        const id    = crearId(producto.nombre, talla);
        const idx   = items.findIndex(i => i.id === id);

        if (idx > -1) {
            items[idx].cantidad += 1;
        } else {
            items.push({
                id,
                nombre:   producto.nombre,
                precio:   Number(producto.precio),
                imagen:   producto.imagen,
                material: producto.material,
                talla:    talla || null,
                cantidad: 1
            });
        }
        guardar(items);
        return true;
    }

    // ── Cambiar cantidad ─────────────────────────────────────
    function setCantidad(id, cantidad) {
        const items = leer();
        const idx   = items.findIndex(i => i.id === id);
        if (idx === -1) return;
        if (cantidad <= 0) {
            items.splice(idx, 1);
        } else {
            items[idx].cantidad = cantidad;
        }
        guardar(items);
    }

    // ── Eliminar ─────────────────────────────────────────────
    function eliminar(id) {
        guardar(leer().filter(i => i.id !== id));
    }

    // ── Vaciar ───────────────────────────────────────────────
    function vaciar() {
        guardar([]);
    }

    // ── Total ────────────────────────────────────────────────
    function total() {
        return leer().reduce((s, i) => s + i.precio * i.cantidad, 0);
    }

    // ── Cantidad total de artículos ──────────────────────────
    function cantidadTotal() {
        return leer().reduce((s, i) => s + i.cantidad, 0);
    }

    // ── Actualizar badge del header ──────────────────────────
    function actualizarBadge() {
        const badge = document.getElementById("carrito-badge");
        if (!badge) return;
        const n = cantidadTotal();
        badge.textContent  = n;
        badge.style.display = n > 0 ? "flex" : "none";
    }

    // ── Inicializar badge al cargar la página ────────────────
    function init() {
        actualizarBadge();
    }

    return { agregar, setCantidad, eliminar, vaciar, leer, total, cantidadTotal, init, crearId };
})();

// Auto-init
document.addEventListener("DOMContentLoaded", () => Carrito.init());