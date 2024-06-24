const express = require('express');
const colors = require('colors');
const cors = require('cors');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const connectDB = require('./config/db');
const port = process.env.PORT;

const app = express();

app.use(cors());

//connect to database
connectDB();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: process.env.NODE_ENV === 'development',   // CHECKS TO SEE IF SET TO DEVELOPMENT
}));

app.listen(port, console.log(`server running on port ${port}`));
console.log(`running a graphql server at http://localhost:${port}/graphql`);
