import getCurrentLine from 'get-current-line';
import { Injectable } from '@nestjs/common';
import { 
	ErrorException,
	NotFoundException, 
} from 'nest-datum/exceptions/src';
import { BalancerRepository } from 'nest-datum/balancer/src';

@Injectable()
export class RegistryService {
	constructor(
		private readonly balancerRepository: BalancerRepository,
	) {
	}

	async many(): Promise<any> {
		try {
			const output = await this.balancerRepository.find();

			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), {});
		}
		return [ [], 0 ];
	}

	async one(id: string): Promise<any> {
		try {
			const output = await this.balancerRepository.findOne(id);

			if (!output) {
				return new NotFoundException('Entity is undefined', getCurrentLine(), { id });
			}
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { id });
		}
	}

	async drop(id: string): Promise<any> {
		try {
			await this.balancerRepository.delete(id);

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { id });
		}
	}

	async create({ user, ...payload }): Promise<any> {
		try {
			const output = await this.balancerRepository.create({
				...payload,
				userId: payload['userId'] || user['id'] || '',
			});

			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
	}

	async update({ user, ...payload }): Promise<any> {
		try {
			await this.balancerRepository.update(payload['id'], payload);
			
			return true;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
	}
}
