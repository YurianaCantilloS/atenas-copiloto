-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "request" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "objetivoClave" TEXT,
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
    "enUso" BOOLEAN NOT NULL DEFAULT false,
    "favorito" BOOLEAN NOT NULL DEFAULT false,
    "vistas" INTEGER,
    "likes" INTEGER,
    "comentarios" INTEGER,
    "compartidos" INTEGER,
    "guardados" INTEGER,
    "metricas" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentPost_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ContentPost" ("anguloCreativo", "audiencia", "bloque", "caption", "concepto", "createdAt", "cta", "estructura", "fechaPublicacion", "formato", "hook", "hooks", "id", "metricas", "objetivo", "pilar", "productoId", "productoNombre", "publicado", "request", "resultadoRaw", "serie", "storyboard") SELECT "anguloCreativo", "audiencia", "bloque", "caption", "concepto", "createdAt", "cta", "estructura", "fechaPublicacion", "formato", "hook", "hooks", "id", "metricas", "objetivo", "pilar", "productoId", "productoNombre", "publicado", "request", "resultadoRaw", "serie", "storyboard" FROM "ContentPost";
DROP TABLE "ContentPost";
ALTER TABLE "new_ContentPost" RENAME TO "ContentPost";
CREATE INDEX "ContentPost_objetivo_idx" ON "ContentPost"("objetivo");
CREATE INDEX "ContentPost_objetivoClave_idx" ON "ContentPost"("objetivoClave");
CREATE INDEX "ContentPost_productoId_idx" ON "ContentPost"("productoId");
CREATE INDEX "ContentPost_enUso_idx" ON "ContentPost"("enUso");
CREATE INDEX "ContentPost_favorito_idx" ON "ContentPost"("favorito");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
