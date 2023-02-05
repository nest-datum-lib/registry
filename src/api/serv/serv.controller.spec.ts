import { Test, TestingModule } from '@nestjs/testing';
import { ServController } from './serv.controller';

describe('ServController', () => {
	let controller: ServController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ServController],
		}).compile();

		controller = module.get<ServController>(ServController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
