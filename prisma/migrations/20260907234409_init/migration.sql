-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precio" REAL,
    "promocion" TEXT,
    "descripcion" TEXT,
    "caracteristicas" JSONB,
    "colores" JSONB,
    "alPorMayor" BOOLEAN NOT NULL DEFAULT false,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContentPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "request" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "audiencia" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "productoId" TEXT,
    "productoNombre" TEXT,
    "concepto" TEXT NOT NULL,
    "pilar" TEXT NOT NULL,
    "anguloCreativo" TEXT NOT NULL,
    "estructura" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "hooks" JSONB NOT NULL,
    "cta" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "storyboard" JSONB,
    "serie" TEXT,
    "bloque" TEXT,
    "resultadoRaw" JSONB NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "fechaPublicacion" DATETIME,
    "metricas" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentPost_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ContentPost_objetivo_idx" ON "ContentPost"("objetivo");

-- CreateIndex
CREATE INDEX "ContentPost_productoId_idx" ON "ContentPost"("productoId");
