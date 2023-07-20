export const sendGiftTemplate = (link:string, sender_name:string, message:string, name:string)=>{
    return `<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			body {
				margin: 0;
				padding: 0;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.5;
				background-color: #f5f5f5;
			}
			h1 {
				font-size: 36px;
				font-weight: bold;
				color: #333333;
				margin-top: 20px;
				margin-bottom: 10px;
			}
			p {
				color: #666666;
				margin-bottom: 10px;
			}
			.highlight {
				color: #2c3e50;
				font-weight: bold;
			}
			.button {
				display: inline-block;
				padding: 8px 15px;
				background-color: #3498db;
				color: #ffffff;
				font-size: 18px;
				font-weight: bold;
				text-decoration: none;
				border-radius: 5px;
				margin-top: 10px;
				margin-bottom: 10px;
				transition: background-color 0.3s ease;
			}
			.button:hover {
				background-color: #2980b9;
			}
			.button:focus {
				color: #ffffff;
			}
		</style>
	</head>
	<body>
		<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
		<p>Hi ${name} </p>
		<p>${sender_name} just sent you a gift!</p>
		<p>You've got an exciting message as well,
        "${message}"</p>
        <p> Here is the link to get your gift </p>
		<a href=${link} class="button">verify email</a>
		<p>Best regards,</p>
		<p>DashAi</p>
	</div>
	</body>
	</html>
	
		
	`}