require 'redis'
require 'yaml'

config_file = Rails.root.join('config', 'redis.yml')
redis_config = YAML.load_file(config_file)[Rails.env].symbolize_keys

$redis = Redis.new(redis_config)