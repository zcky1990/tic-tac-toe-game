class TicTacToeController < ActionController::Base
    layout :resolve_layout

    skip_before_action :verify_authenticity_token, only: :move

    #play game between player one and player two in same page 
    def index
    end


    #multiplayer if player using different webpage
    def multiplayer
    end

    def createOrJoinRoom
        pattern = "room_*"
        matching_keys = $redis.keys(pattern)
        room_id = randomValue()
        user_id = randomValue()
        player_type= 'playerOne'

        if (matching_keys.size == 0)
            createGameRoom(room_id, user_id)
        end

        isNoEmptyRoom = true
        matching_keys.each do |key|
            rooms = JSON.parse($redis.get(key))
            if (rooms['isOpen'] == true)
                room_id = rooms['room_id']
                rooms['isOpen'] = false
                rooms['player'] << {
                    "id" => "#{user_id}",
                    "type" => "player_2"
                }
                player_type = 'playerTwo'
                updateGameRoomData(room_id, rooms )
                isNoEmptyRoom = false
                break
            end
        end

        if (isNoEmptyRoom)
            createGameRoom(room_id, user_id)
        end
        cookies[:room_id] = room_id
        cookies[:user_id] = user_id
        redirect_to game_path(room_id, :player => player_type)
    end

    def game
        render layout: 'tic_tac_toe_multiplayer'
    end

    def move
        channel_id = params[:channel_id]
        data = params[:data]
        GameChannel.broadcast_to(channel_id, data)
        render :json => {'status': 'success', 'message': 'success broadcast channel'}
    end

    private
    def randomValue
        return (0...10).map { ('a'..'z').to_a[rand(10)] }.join
    end

    def createGameRoom(room_id, user_id)
        json_data = { 
            "room_id" => "#{room_id}",
            "isOpen" => true, 
            "player" => [
                {
                    "id" => "#{user_id}",
                    "type" => "player_1"
                    }
                ]
        }
        $redis.set("room_#{room_id}", json_data.to_json)
    end

    def updateGameRoomData(room_id, data)
        $redis.set("room_#{room_id}", data.to_json)
    end

    def resolve_layout
        case action_name
        when "index"
            "tic_tac_toe"
        when "multiplayer"
            "tic_tac_toe_multiplayer"
        when "game"
            "tic_tac_toe_multiplayer"
        else
            "application"
        end
    end
end

GameChannel.broadcast_to('room_fgcdgeggdg', 'test')