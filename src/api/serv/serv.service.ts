import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { ReplicaService } from '@nest-datum/replica';
import { RedisService } from '@nest-datum/redis';

@Injectable()
export class ServService extends RedisService {
	constructor(
		@InjectRedis(process['REDIS_TRANSPORT']) public redisService: Redis,
		private readonly replicaService: ReplicaService,
	) {
		super();
	}

	async many({ user, ...payload }): Promise<any> {
		const dataProcessed = (await this.keysScan(this.replicaService.prefix(`*|app_id`)));
		let output = [],
			i = 0;

		while (i < dataProcessed.length) {
			const nameSplit = dataProcessed[i]
				.replace(this.replicaService.prefix(), '')
				.split('|');
			const id = nameSplit[nameSplit.length - 2];

			if (id 
				&& !output[id]
				&& nameSplit.length === 3) {
				output.push({
					id,
					name: await this.redisService.get(this.replicaService.prefix(`${id}|app_name`)),
					host: await this.redisService.get(this.replicaService.prefix(`${id}|app_host`)),
					port: Number(await this.redisService.get(this.replicaService.prefix(`${id}|app_port`))),
				});
			}
			i++;
		}
		
		return {
			total: output.length,
			rows: output,
		};
	}
}
