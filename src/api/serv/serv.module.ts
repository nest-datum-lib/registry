import { Module } from '@nestjs/common';
import { 
	ReplicaModule,
	ReplicaService, 
} from '@nest-datum/replica';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import {
	CacheModule, 
	CacheService, 
} from '@nest-datum/cache';
import { ServService } from './serv.service';
import { ServController } from './serv.controller';

@Module({
	controllers: [ ServController ],
	imports: [
		ReplicaModule,
		TransportModule,
		CacheModule,
	],
	providers: [
		ReplicaService,
		TransportService,
		CacheService,
		ServService, 
	],
})
export class ServModule {
}

