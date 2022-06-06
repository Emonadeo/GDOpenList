import { Level } from '@prisma/client';
import { prisma } from '../prisma';
import { paths } from '../../generated/openapi';

type GetListReply = paths['/list']['get']['responses']['200']['content']['application/json'];

/**
 * Extracts the list of levels from the latest log record
 * @returns List of levels
 */
export async function getCurrent(): Promise<GetListReply> {
	const res = await prisma.listLog.findFirst({
		include: {
			list: {
				include: {
					level: {
						include: {
							user: true,
							verifier: true,
						},
					},
				},
				orderBy: {
					index: 'asc',
				},
			},
		},
	});

	if (!res) return [];

	return res.list.map((log) => log.level);
}
