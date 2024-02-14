redis_config = { url: ENV['REDIS_URL'] || 'redis://localhost:6379/0' }
$redis = Redis.new(redis_config)