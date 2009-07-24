module ApplicationHelper
  
def body_class
  if params[:controller] == "projects" && ["show","edit"].include?(params[:action])
    return "project-" + @project.id.to_s
  elsif params[:controller] == "projects" && params[:action] == "index"
    return "projects" 
  else
    return params[:action]
  end
end

def render_toolbar
  case params[:action]
    when "inbox": render :partial => '/toolbars/tb_inbox'
    when "today": render :partial => '/toolbars/tb_today'
    when "next": render :partial => '/toolbars/tb_next'
    when "scheduled": render :partial => '/toolbars/tb_scheduled'
    when "someday": render :partial => '/toolbars/tb_someday'
    when "logbook": render :partial => '/toolbars/tb_logbook'
    when "trash": render :partial => '/toolbars/tb_trash'
    else 
      if params[:controller] == "projects"
        ["new","edit","show"].include?(params[:action]) ? 
            render(:partial => '/toolbars/tb_project') : render(:partial => '/toolbars/tb_projects')        
      elsif params[:controller] == "area"
        render :partial => '/toolbars/tb_areas'
      end
  end  
end

def trash_count 
  current_user.tasks.send(:with_exclusive_scope) { Task.count(:conditions => [ "status_id = 7 AND deleted_at < ?", Time.now ] ) }
end

def distance_in_days(from_time, to_time )
  from_time = from_time.to_time if from_time.respond_to?(:to_time)
  to_time   = to_time.to_time if to_time.respond_to?(:to_time)
  distance_in_days = (((to_time - from_time).abs)/86400).round
  return distance_in_days
end

def relative_due_date(date)
  if date > Time.now # still have time
    if date.to_time - Time.now < 86400
      return "Today"
    elsif date.to_time - Time.now < 15*86400
      return pluralize( distance_in_days(Time.now, date) , 'day') + " left"
    else 
      return date.strftime("%b ") + date.strftime("%d").to_i.to_s
    end
  else # it's overdue
    if (date.to_time - Time.now).abs < 86400
      return "Today"
    else 
      return pluralize( distance_in_days(Time.now, date) , 'day') + " overdue"
    end
  end  
end

def project_progress(p)
  not_done = p.tasks.count( :conditions => { :done_at => nil } )
  (p.tasks && p.tasks.size > 0) ? ( (1 - (not_done.to_f / p.tasks.size.to_f))*85 - 85) : (-85)
end


end
