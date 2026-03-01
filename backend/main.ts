import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Module, Controller, Get } from "@nestjs/common";

@Controller()
class AppController {
  @Get()
  getHello() {
    return { message: "API Gestor de Proyectos (Deno + NestJS) activa" };
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log("Servidor corriendo en http://localhost:3000");
  await app.listen(3000);
}

bootstrap();
