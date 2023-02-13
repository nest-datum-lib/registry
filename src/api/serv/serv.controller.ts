import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { TcpController } from '@nest-datum/controller';
import { ServService } from './serv.service';

@Controller()
export class ServController extends TcpController {
	constructor(
		protected transportService: TransportService,
		protected entityService: ServService,
	) {
		super();
	}

	@MessagePattern({ cmd: 'registry.many' })
	async many(payload) {
		return await super.many(payload);
	}
}
