class ApplicationController < ActionController::Base

  include AuthenticatedSystem 
  helper :all
  protect_from_forgery

  def make_taglist
    @tag_list = []
    @none_tag = false
    if @tasks && @tasks.size > 0
      @tasks.each do |t|
        @none_tag = true if t.tag_list.size == 0
        @tag_list << t.tag_list
      end
      @tag_list.flatten!.uniq! 
    end
  end  


  def make_projects_taglist
    @tag_list = []
    @none_tag = false
    if @projects && @projects.size > 0
      @projects.each do |p|
        @none_tag = true if p.tag_list.size == 0
        @tag_list << p.tag_list
      end
      @tag_list.flatten!.uniq! 
    end
  end    
  
  def sidebar_info
    @sidebar_projects = current_user.projects.active.all    
    @sidebar_areas = current_user.areas.all
  end  
  
  


end
