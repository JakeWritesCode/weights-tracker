import bcrypt from 'bcrypt';
import { prisma } from './db';
import type { Cookies } from '@sveltejs/kit';

const SESSION_COOKIE = 'session';
const SALT_ROUNDS = 10;
const SESSION_EXPIRY_DAYS = 30;

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, cookies: Cookies): Promise<string> {
	const token = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

	await prisma.session.create({
		data: {
			token,
			userId,
			expiresAt
		}
	});

	cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: expiresAt
	});

	return token;
}

export async function validateSession(cookies: Cookies) {
	const token = cookies.get(SESSION_COOKIE);
	if (!token) return null;

	const session = await prisma.session.findUnique({
		where: { token },
		include: { user: true }
	});

	if (!session) return null;

	// Session expired
	if (session.expiresAt < new Date()) {
		await prisma.session.delete({ where: { id: session.id } });
		cookies.delete(SESSION_COOKIE, { path: '/' });
		return null;
	}

	// Extend session if more than halfway through
	const halfwayPoint = new Date(
		session.expiresAt.getTime() - (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000) / 2
	);
	if (new Date() > halfwayPoint) {
		const newExpiry = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
		await prisma.session.update({
			where: { id: session.id },
			data: { expiresAt: newExpiry }
		});
		cookies.set(SESSION_COOKIE, token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			expires: newExpiry
		});
	}

	return session.user;
}

export async function destroySession(cookies: Cookies): Promise<void> {
	const token = cookies.get(SESSION_COOKIE);
	if (token) {
		await prisma.session.deleteMany({ where: { token } });
		cookies.delete(SESSION_COOKIE, { path: '/' });
	}
}
