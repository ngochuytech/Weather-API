import express from 'express'
import fetch from 'node-fetch'
import { createClient } from 'redis';
import 'dotenv/config'
const app = express()
const port = 3001;

const WEATHER_API_KEY  = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = process.env.WEATHER_API_URL;

const redisClient = createClient()
    .on('error', err => console.log('Redis Client Error', err))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./src/views");

const checkRedisConnection = async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
        
    } catch (error) {
        console.error("Could not connect to Redis", error.message);
    }
}

checkRedisConnection();

app.use('/api/getWeather', async (req, res) => {
    const city = req.query.city;
    try {
        if(redisClient.isReady){
            const cachedData = await redisClient.get(city);
            if(cachedData) {
                console.log('Cache hit');
                return res.json(JSON.parse(cachedData));
            }
            console.log('Cache miss');
        } else {
            console.warn('Redis not connected, skipping cache');
        }

        const response = await fetch(`${WEATHER_API_URL}?q=${city}&units=metric&appid=${WEATHER_API_KEY}`);
        
        if(!response.ok){
            return res.json(await response.json())
        }

        const data = await response.json();

        if(redisClient.isReady){
            await redisClient.setEx(city, 3600, JSON.stringify(data)).catch(() => {
                console.warn('Failed to save data to Redis');
            })
        }

        return res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Error fetching weather data'});
    }

})

app.use('/', (req, res) => {
    return res.render('index.ejs')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}) 