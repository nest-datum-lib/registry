import { redisConfig } from 'config/redis';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { CacheService } from 'nest-datum/cache/src';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { RegistryService } from './registry.service';
import { RegistryController } from './registry.controller';

@Module({
	imports: [
		RedisModule.forRoot(redisConfig),
	],
	controllers: [ 
		RegistryController,
	],
	providers: [ 
		BalancerRepository,
		BalancerService,
		CacheService,
		RegistryService,
	],
})
export class RegistryModule {
}
