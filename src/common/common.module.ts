// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; // Necesario si quieres un guard global
import { RolesGuard } from './guards/roles.guard'; // Importa tu RolesGuard

@Module({
  // No necesitamos importar otros módulos aquí a menos que nuestros guards/decorators los necesiten.
  // El decorador @Roles() no necesita ser declarado ni exportado, ya que es una función simple.
  providers: [
    // Si quisieras que el RolesGuard fuera global para toda la aplicación por defecto:
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    // Si no es global, simplemente se inyecta en cada controlador que lo necesite.
  ],
  exports: [
    // Aquí puedes exportar cualquier cosa que otros módulos puedan necesitar.
    // En este caso, el decorador @Roles() no necesita ser exportado por un módulo,
    // pero si tuvieras servicios compartidos aquí, los exportarías.
    // Solo se exporta el RolesGuard si se va a inyectar manualmente.
    // Para este ejemplo, lo dejaremos sin exportaciones directas del guard aquí,
    // ya que lo usaremos con @UseGuards() en los controladores.
  ],
})
export class CommonModule {}
