class GameChannel < ApplicationCable::Channel
  def subscribed
    begin
      rooms = JSON.parse($redis.get("room_#{params[:id]}"))
      room_id = rooms['room_id']
      puts "stream for room_#{room_id}"
      stream_for "room_#{room_id}"
    rescue => e
      stream_for "game_channel"
      puts "Error: #{e.message}"
    end
  end

  def unsubscribed
    stop_all_streams
  end

  def move(data)
    puts "-------------------------move------------------------------------"
    puts data
  end

  def receive(data)
    puts "====================received======================================="
    puts data 
  end
end
