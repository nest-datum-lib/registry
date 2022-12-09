import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'config/typeorm';
import { redisConfig } from 'config/redis';
import { BalancerModule } from 'nest-datum/balancer/src';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistryModule } from './api/registry/registry.module';
import { SettingModule } from './api/setting/setting.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(typeormConfig),
		RedisModule.forRoot(redisConfig),
		BalancerModule,
		RegistryModule,
		SettingModule,
	],
	controllers: [ AppController ],
	providers: [ AppService ],
})
export class AppModule {
}
