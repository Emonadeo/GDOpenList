import { FastifyPluginAsync, RouteHandlerMethod } from 'fastify';
import { Level } from '@prisma/client';
import { getCurrent } from './model';
import { paths } from '../../generated/openapi';

type GetListReply = paths['/list']['get']['responses']['200']['content']['application/json'];

const plugin: FastifyPluginAsync = async function (fastify) {
	// Get List
	fastify.get<{
		Reply: GetListReply;
	}>('/list', async function (_, res) {
		res.send(await getCurrent());
	});

	// TODO Edit List
	fastify.post('/list', async (_, res) => {});
};

export default plugin;
