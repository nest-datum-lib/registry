import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { ReplicaService } from '@nest-datum/replica';
import { RedisService } from '@nest-datum/redis';

@Injectable()
export class ServService extends RedisService {
	constructor(
		@InjectRedis(process['REDIS_TRANSPORT']) public redis: Redis,
		private readonly replicaService: ReplicaService,
	) {
		super();
	}

	async many({ user, ...payload }): Promise<any> {
		const dataProcessed = (await this.redisScanStream(`${process.env.USER_ID}|${process.env.PROJECT_ID}|`));
		let output = {},
			i = 0,
			ii;

		while (i < dataProcessed.length) {
			const [ name, id ] = dataProcessed[i]
				.replace(`${process.env.USER_ID}|${process.env.PROJECT_ID}|`, '')
				.split('|');

			if (!output[id]) {
				output[id] = {
					id,
					name,
					indicator: await this.redis.get(this.replicaService.prefix('loadingIndicator', id, name)),
					...JSON.parse(await this.redis.get(this.replicaService.prefix('address', id, name))),
					...JSON.parse(await this.redis.get(this.replicaService.prefix('options', id, name))),
				};
			}
			i++;
		}
		output = Object.values(output);

		return [ output, output.length ];
	}
}
