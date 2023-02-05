import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { encryptPassword } from '@nest-datum/jwt';
import { Type } from 'src/api/type/type.entity';

export class TypeSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(Type) private readonly typeRepository: Repository<Type>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: 'data-type-type-text',
				userId: 'sso-user-admin',
				typeStatusId: 'data-type-type-status-active',
				name: 'Text',
				description: 'Text values from any characters.',
				isNotDelete: true,
			}, {
				id: 'data-type-type-integer',
				userId: 'sso-user-admin',
				typeStatusId: 'data-type-type-status-active',
				name: 'Integer',
				description: 'natural number, plus its opposite and zero.',
				isNotDelete: true,
			}, {
				id: 'data-type-type-float',
				userId: 'sso-user-admin',
				typeStatusId: 'data-type-type-status-active',
				name: 'Float',
				description: 'Fractional numbers.',
				isNotDelete: true,
			}, {
				id: 'data-type-type-boolean',
				userId: 'sso-user-admin',
				typeStatusId: 'data-type-type-status-active',
				name: 'Boolean',
				description: 'TRUE or FALSE values.',
				isNotDelete: true,
			}, {
				id: 'data-type-type-file-upload',
				userId: 'sso-user-admin',
				typeStatusId: 'data-type-type-status-active',
				name: 'File',
				description: 'File system resource.',
				isNotDelete: true,
			}, {
				id: 'data-type-type-file-select',
				userId: 'sso-user-admin',
				typeStatusId: 'data-type-type-status-active',
				name: 'Select',
				description: 'Select file from system.',
				isNotDelete: true,
			}, {
				id: 'data-type-type-file-cv',
				userId: 'sso-user-admin',
				typeStatusId: 'data-type-type-status-active',
				name: 'CV',
				description: 'All PDF files.',
				isNotDelete: true,
			}, {
				id: 'data-type-type-file-cv-lensa',
				userId: 'sso-user-admin',
				typeStatusId: 'data-type-type-status-active',
				name: 'CV lensa',
				description: 'PDF files from lesna API.',
				isNotDelete: true,
			}, {
				id: 'data-type-type-file-avatar',
				userId: 'sso-user-admin',
				typeStatusId: 'data-type-type-status-active',
				name: 'Avatars',
				description: 'User avatars.',
				isNotDelete: true,
			}, {
				id: 'data-type-type-enum',
				userId: 'sso-user-admin',
				typeStatusId: 'data-type-type-status-active',
				name: 'Enum',
				description: 'Set of values.',
				isNotDelete: true,
			}], async (data) => {
				try {
					await this.typeRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: user 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: user 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}