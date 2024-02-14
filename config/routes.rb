Rails.application.routes.draw do
  root to: 'tic_tac_toe#index'
  post '/', to: 'tic_tac_toe#createOrJoinRoom'
  get 'game/:id', to: 'tic_tac_toe#game', as: 'game'
  post 'move', to: 'tic_tac_toe#move', as: 'move'

  mount ActionCable.server => '/cable'
end
