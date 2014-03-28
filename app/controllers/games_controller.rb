class GamesController < ApplicationController
  def flappy
    @javascript_file = "flappy_isaac"
  end
  def testgame
  	@javascript_file = "testgame"
  end
end
