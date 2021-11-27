const app = require('./app')
const server_port = process.env.PORT || 5000;

app.listen(server_port, () => {
    console.log(`Server is running on port: ${server_port}`);
});