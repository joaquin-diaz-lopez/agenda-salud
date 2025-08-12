// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('AppController.getHello: Solicitud recibida en la ruta raíz.'); // <-- Nuevo log
    return this.appService.getHello();
  }

  @Get('ping') // <-- Nuevo endpoint simple
  ping(): string {
    console.log('AppController.ping: Solicitud recibida en /ping.'); // <-- Nuevo log
    return 'pong';
  }
}
