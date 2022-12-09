import getCurrentLine from 'get-current-line';
import { Controller } from '@nestjs/common';
import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { BalancerService } from 'nest-datum/balancer/src';
import * as Validators from 'nest-datum/validators/src';
import { RegistryService } from './registry.service';

@Controller()
export class RegistryController {
	constructor(
		private readonly registryService: RegistryService,
		private readonly balancerService: BalancerService,
	) {
	}

	@MessagePattern({ cmd: 'registry.many' })
	async many(payload) {
		try {
			Validators.token('accessToken', payload['accessToken'], {
				accesses: [ process['ACCESS_BALANCER_MANY'] ],
				isRequired: true,
			});

			const many = await this.registryService.many();

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return {
				total: many.length,
				rows: many,
			};
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'registry.one' })
	async one(payload) {
		try {
			Validators.token('accessToken', payload['accessToken'], {
				accesses: [ process['ACCESS_BALANCER_ONE'] ],
				isRequired: true,
			});

			const output = await this.registryService.one(Validators.id('id', payload['id'], {
				isRequired: true,
			}));

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('registry.drop')
	async drop(payload) {
		try {
			Validators.token('accessToken', payload['accessToken'], {
				accesses: [ process['ACCESS_BALANCER_ONE'] ],
				isRequired: true,
			});

			await this.registryService.drop(Validators.id('id', payload['id'], {
				isRequired: true,
			}));

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return true;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('registry.create')
	async create(payload) {
		try {
			const output = await this.registryService.create({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_BALANCER_CREATE'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id']),
				name: Validators.str('name', payload['name'], {
					isRequired: true,
					min: 1,
					max: 255,
					// TODO: unique value
					// isUnique:
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

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('registry.update')
	async update(payload) {
		try {
			await this.registryService.update({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_BALANCER_UPDATE'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id']),
				newId: Validators.id('newId', payload['newId']),
				name: Validators.str('name', payload['name'], {
					min: 1,
					max: 255,
					// TODO: unique value
					// isUnique:
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

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return true;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}
}
