module ApplicationHelper
  def li_active_if condition, link
    # content_tag(:li, link_to("3", users_path))
    if condition
      content_tag(:li, link, :class => 'active')
    else
      content_tag(:li, link)
    end
  end
end
