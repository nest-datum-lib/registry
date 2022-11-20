import { Module } from '@nestjs/common';
import { 
	RegistryService,
	LogsService, 
	CacheService,
} from '@nest-datum/services';
import { RegistryController } from './registry.controller';

@Module({
	controllers: [ RegistryController ],
	imports: [],
	providers: [ 
		RegistryService,
		LogsService, 
		CacheService,
	],
})
export class RegistryModule {
}

