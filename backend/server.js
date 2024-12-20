const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors')
const { config } = require('dotenv')
const employeeRoutes = require('./routes/employeeRoutes');
const userRoutes = require('./routes/userRoutes');
const resetLinks = require('./routes/resetpassword')
const app = express();
config()

app.use(express.json());
app.use(cors())


//routes
app.use('/api/user',userRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/password',resetLinks);
sequelize.sync({ force: false })
    .then(() => console.log("Database connected"))
    .catch((error) => console.log("Failed to connect ", error));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT} : ${JWT_SECRET}`);
    
})

