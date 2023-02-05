import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { WarningException } from '@nest-datum-common/exceptions';
import { TransportService } from '@nest-datum/transport';
import { Controller as NestDatumController } from '@nest-datum-common/controller';
import { 
	bool as utilsCheckBool,
	exists as utilsCheckExists,
	str as utilsCheckStr,
	strId as utilsCheckStrId,
	strName as utilsCheckStrName,
	strEmail as utilsCheckStrEmail,
	strPassword as utilsCheckStrPassword,
	strDescription as utilsCheckStrDescription,
	strRegex as utilsCheckStrRegex,
	strDate as utilsCheckStrDate,
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum/jwt';
import { ServService } from './serv.service';

@Controller()
export class ServController extends NestDatumController {
	constructor(
		public transportService: TransportService,
		public service: ServService,
	) {
		super(transportService, service);
	}

	@MessagePattern({ cmd: 'registry.many' })
	async many(payload) {
		return await super.many(payload);
	}
}
