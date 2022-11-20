import getCurrentLine from 'get-current-line';
import * as Validators from '@nest-datum/validators';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { 
	RegistryService,
	LogsService, 
} from '@nest-datum/services';

@Controller()
export class RegistryController {
	constructor(
		private readonly registryService: RegistryService,
		private readonly logsService: LogsService,
	) {
	}

	@MessagePattern({ cmd: 'registry.many' })
	async many(payload) {
		try {
			const many = await this.registryService.many({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					// isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				relations: Validators.obj('relations', payload['relations']),
				select: Validators.obj('select', payload['select']),
				sort: Validators.obj('sort', payload['sort']),
				filter: Validators.obj('filter', payload['filter']),
				query: Validators.str('query', payload['query'], {
					min: 1,
					max: 255,
				}),
				page: Validators.int('page', payload['page'], {
					min: 1,
					default: 1,
				}) || 1,
				limit: Validators.int('limit', payload['limit'], {
					min: 1,
					default: 20,
				}) || 20,
			});

			await this.registryService.clearResources();

			return {
				total: many[1],
				rows: many[0],
			};
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'registry.one' })
	async one(payload) {
		try {
			const output = await this.registryService.one({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				relations: Validators.obj('relations', payload['relations']),
				select: Validators.obj('select', payload['select']),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
			});

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'registry.drop' })
	async drop(payload) {
		try {
			await this.registryService.drop({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
			});
			await this.registryService.clearResources();

			return true;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'registry.create' })
	async create(payload) {
		try {
			const output = await this.registryService.create({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				id: Validators.id('id', payload['id']),
				name: Validators.str('name', payload['name'], {
					isRequired: true,
					min: 1,
					max: 255,
					// TODO: unique value
					// isUnique: {
					// 	redis: process.env.REDIS_REGISTRY_NAMESPACE,
					// },
				}),
				host: Validators.host('host', payload['host'], {
					isRequired: true,
				}),
				port: Validators.int('port', payload['port'], {
					isRequired: true,
					min: 2,
					max: 99999,
				}),
				mysqlMasterHost: Validators.host('mysqlMasterHost', payload['mysqlMasterHost']),
				mysqlMasterPort: Validators.int('mysqlMasterPort', payload['mysqlMasterPort'], {
					min: 2,
					max: 99999,
				}),
				transport: Validators.transport('transport', payload['transport'], {
					isRequired: true,
				}),
			});

			return output;

			await this.registryService.clearResources();;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'registry.update' })
	async update(payload) {
		try {
			await this.registryService.update({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				id: Validators.id('id', payload['id']),
				newId: Validators.id('newId', payload['newId']),
				name: Validators.str('name', payload['name'], {
					min: 1,
					max: 255,
					// TODO: unique value
					// isUnique: {
					// 	redis: process.env.REDIS_REGISTRY_NAMESPACE,
					// },
				}),
				host: Validators.host('host', payload['host']),
				port: Validators.int('port', payload['port'], {
					min: 2,
					max: 99999,
				}),
				mysqlMasterHost: Validators.host('mysqlMasterHost', payload['mysqlMasterHost']),
				mysqlMasterPort: Validators.int('mysqlMasterPort', payload['mysqlMasterPort'], {
					min: 2,
					max: 99999,
				}),
				transport: Validators.transport('transport', payload['transport']),
			});

			await this.registryService.clearResources();

			return true;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}
}
