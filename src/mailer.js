import nodemailer from 'nodemailer';

const from = '"Bookworm" <info@Bookworm.com>';

export function setup() {
	return nodemailer.createTransport({
		host: 'smtp.mailtrap.io',
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	});
}

export function sendConfirmationEmail(user) {
	const transport = setup();
	const email = {
		from,
		to: user.email,
		subject: 'Welcome to Bookworm',
		text: `
        Welcome to Bookworm. Please check your email 

        ${user.generateConfirmationUrl()}`
	};
	transport.sendMail(email);
}
