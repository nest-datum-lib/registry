require('dotenv').config();

const { exec } = require('child_process');
const cryptoJs = require('crypto-js');

import { v4 as uuidv4 } from 'uuid';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { TransportStrategies } from 'nest-datum/common/src';
import { 
	BalancerModule,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { getEnvValue } from 'nest-datum/common/src';
import { AppModule } from './app.module';

process.on('uncaughtException', (err) => {
	console.error(err);
});

async function createApp() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		strategy: new TransportStrategies[process.env.APP_TRANSPORTER]({
			host: process.env.APP_HOST,
			port: Number(process.env.APP_PORT),
		}),
	});
	const balancer = await NestFactory.create(BalancerModule);
	const balancerService = balancer.get(BalancerService);

	console.log('Replica listening on port:', Number(process.env.APP_PORT));

	await app.listen();
	await balancerService.registry();
	await balancer.close();
};

async function bootstrap() {
	process['USER_ROOT_EMAIL'] = process.env.USER_ROOT_EMAIL;
	process['USER_ROOT_LOGIN'] = process.env.USER_ROOT_LOGIN;
	process['USER_ROOT_PASSWORD'] = process.env.USER_ROOT_PASSWORD;
	process['PROJECT_ID'] = getEnvValue('PROJECT_ID') || uuidv4();
	process['APP_ID'] = getEnvValue('APP_ID') || uuidv4();
	process['JWT_SECRET_ACCESS_KEY'] = getEnvValue('JWT_SECRET_ACCESS_KEY')
		|| cryptoJs.lib.WordArray.random(64).toString();
	process['JWT_SECRET_REFRESH_KEY'] = getEnvValue('JWT_SECRET_REFRESH_KEY')
		|| cryptoJs.lib.WordArray.random(64).toString();

	await createApp();
};

bootstrap();
