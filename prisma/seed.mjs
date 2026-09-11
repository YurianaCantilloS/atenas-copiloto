import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    nombre: "Bolso de mano tejido — Colección Atenas",
    categoria: "Bolsos",
    precio: 74900,
    promocion: "2x $139.000",
    descripcion:
      "Bolso de mano en tejido natural con detalles dorados. Ideal para looks de día o noche.",
    caracteristicas: ["Material tejido premium", "Cierre seguro", "Ideal para regalo"],
    colores: ["Natural", "Negro", "Camel"],
    alPorMayor: true,
  },
  {
    nombre: "Set de combos de maquillaje",
    categoria: "Maquillaje",
    precio: 95000,
    promocion: "Combo 5 unidades al por mayor",
    descripcion:
      "Combos armados con productos de maquillaje para reventa. Incluye variedad de tonos.",
    caracteristicas: ["5 unidades por combo", "Tonos variados", "Empaque listo para revender"],
    colores: [],
    alPorMayor: true,
  },
  {
    nombre: "Kit capilar keratina",
    categoria: "Capilar",
    precio: 89000,
    promocion: "3 unidades por $249.000",
    descripcion:
      "Kit de keratina con shampoo, acondicionador y tratamiento. Para venta al por mayor.",
    caracteristicas: ["3 pasos", "Rinde varios tratamientos", "Al por mayor"],
    colores: [],
    alPorMayor: true,
  },
  {
    nombre: "Vestido de baño completo",
    categoria: "Vestidos de baño",
    precio: 69000,
    promocion: null,
    descripcion:
      "Vestido de baño completo con estampado exclusivo. Variedad de tallas y colores.",
    caracteristicas: ["Tallas S a L", "Estampados exclusivos", "Ajuste cómodo"],
    colores: ["Azul", "Terracota", "Verde"],
    alPorMayor: false,
  },
  {
    nombre: "Collar aro de aro dorado",
    categoria: "Accesorios",
    precio: 29000,
    promocion: "3x $75.000",
    descripcion:
      "Collar de aros dorados, ligero y elegante. Ideal para combinar con cualquier look.",
    caracteristicas: ["Libre de esteja", "No se daña con el agua", "Dorado brillante"],
    colores: ["Dorado", "Plateado"],
    alPorMayor: true,
  },
  {
    nombre: "Paleta de sombras 12 tonos",
    categoria: "Maquillaje",
    precio: 42000,
    promocion: null,
    descripcion:
      "Paleta con 12 tonos fácilmente combinables. Perfecta para looks de día y noche.",
    caracteristicas: ["12 tonos", "Alta pigmentación", "Incluye espejo"],
    colores: ["Neutros", "Cálidos"],
    alPorMayor: false,
  },
];

async function main() {
  for (const p of products) {
    const existe = await prisma.product.findFirst({ where: { nombre: p.nombre } });
    if (!existe) await prisma.product.create({ data: p });
  }
  console.log(`Seed listo: ${products.length} productos cargados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });