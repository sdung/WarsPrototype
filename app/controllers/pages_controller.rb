class PagesController < ApplicationController
  #this controller serves the pages of the website that are mostly static
  #pass in the name without the extention into @javascript_file and it will
  #be passed to the view to be loaded

  #phaser is loaded already in application.html.erb
  def index

  end

  def game

  end

  def flappy
    @javascript_file = "flappy_isaac"
  end

  def about

  end

  def contact

  end
end
