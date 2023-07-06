interface Connection {
    host:string,
    port:number,
    password?:string
}

/**
 * This utililty function configures the url mapping for redis server
 * based on the environment
 * There should be a better way to this but we're gonna stick with this for now I guess
 */
export const configureRedisUrl = (connectionString:string):Connection=>{
    let redisConnection:Connection;
    if(process.env.NODE_ENV=="production"){
        redisConnection =  {
            host: connectionString.split(":")[2].split("@")[1],
            port: parseInt(connectionString.split(":")[3]),
            password:connectionString.split(":")[2].split("@")[0]
        }
    }else{
        redisConnection = {
            host: "localhost",
            port:6379
        }
    }
    return redisConnection;
}
