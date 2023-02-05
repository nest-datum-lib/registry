import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	redis,
	sql, 
} from '@nest-datum-common/config';
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
import { SeedService } from './seed.service';
import { Setting } from 'src/api/setting/setting.entity';
import { Type } from 'src/api/type/type.entity';
import { TypeTypeTypeOption } from 'src/api/type-type-type-option/type-type-type-option.entity';
import { TypeOption } from 'src/api/type-option/type-option.entity';
import { TypeTypeOption } from 'src/api/type-type-option/type-type-option.entity';
import { TypeSeeder } from './type.seeder';
import { SettingSeeder } from './setting.seeder';

@Module({
	controllers: [],
	imports: [
		RedisModule.forRoot(redis),
		TypeOrmModule.forRoot(sql),
		TypeOrmModule.forFeature([
			Setting,
			TypeOption,
			TypeTypeOption,
			Type,
			TypeTypeTypeOption, 
		]),
		ReplicaModule,
		TransportModule,
		CacheModule,
	],
	providers: [
		ReplicaService,
		TransportService,
		CacheService,
		SeedService,
		SettingSeeder,
		TypeSeeder,
	]
})

export class SeedModule {
}
