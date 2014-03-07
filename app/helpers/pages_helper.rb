module PagesHelper
  def index_active
    params[:controller] == "pages" && params[:action] == "index" ? true : false
  end

  def about_active
    params[:controller] == "pages" && params[:action] == "about" ? true : false
  end

  def contact_active
    params[:controller] == "pages" && params[:action] == "contact" ? true : false
  end
end