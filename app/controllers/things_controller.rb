class ThingsController < ApplicationController
  before_filter :login_or_oauth_required, :sidebar_info
  
  def index
    redirect_to :action => "today"  
  end
  
  def inbox
    @tasks = current_user.tasks.inbox
    @new_task = current_user.tasks.new(:status_id => 1, :title => "New To Do")
    make_taglist
    respond_to do |format|
      format.html {}
      format.js   { render :action => "inbox", :layout => "main_content" }
    end    
  end
  
  def today
    @tasks = current_user.tasks.today
    @new_task = current_user.tasks.new(:status_id => 2, :title => "New To Do")
    make_taglist
    respond_to do |format|
      format.html { render :action => "inbox" }
      format.js   { render :action => "inbox", :layout => "main_content" }
    end        
  end
  
  def next
    @tasks = current_user.tasks.next
    make_taglist
        
    @tasks.map {|t| t.project_id }.uniq.each do |p_id| 
      if p_id 
        ft = @tasks.select {|t| t.project_id == p_id }.first
        @tasks.insert( @tasks.index(ft) , ft.project ) 
      end
    end
    
    @new_task = current_user.tasks.new(:status_id => 3, :title => "New To Do")

    respond_to do |format|
      format.html { render :action => "inbox" }
      format.js   { render :action => "inbox", :layout => "main_content" }
    end    
  end
  
  def scheduled
    @tasks = current_user.tasks.scheduled
    @new_task = current_user.tasks.new(:status_id => 4, :title => "New To Do")
    make_taglist
    respond_to do |format|
      format.html { render :action => "inbox" }
      format.js   { render :action => "inbox", :layout => "main_content" }
    end    
  end
  
  def someday
    @tasks = current_user.tasks.someday
    @new_task = current_user.tasks.new(:status_id => 5, :title => "New To Do")
    make_taglist
    respond_to do |format|
      format.html { render :action => "inbox" }
      format.js   { render :action => "inbox", :layout => "main_content" }
    end    
  end
  
  def logbook
    @tasks = current_user.tasks.done
    @new_task = current_user.tasks.new(:status_id => 6, :title => "New To Do")
    #make_taglist
    respond_to do |format|
      format.html { render :action => "inbox" }
      format.js   { render :action => "inbox", :layout => "main_content" }
    end    
  end
  
  def trash
    @tasks = current_user.tasks.send(:with_exclusive_scope) { 
             Task.find(:all,:conditions => [ "status_id = 7 AND deleted_at < ?", Time.now ], :order => "deleted_at DESC" ) 
          }
    @new_task = current_user.tasks.new(:status_id => 7, :title => "New To Do")
    #make_taglist
    respond_to do |format|
      format.html { render :action => "inbox" }
      format.js   { render :action => "inbox", :layout => "main_content" }
    end    
  end

  def update_tagbar 
    page = params[:id].split("-")
    if page.first == "project"
      @tasks = current_user.projects.find(page.last).tasks
    elsif page.first == "projects"
      @tasks = current_user.projects
    else 
      @tasks = current_user.tasks.send(params[:id])
    end
    @no_container = true
    make_taglist
    respond_to do |format|
      format.js { render :partial => '/layouts/tagbar', :layout => false }
    end
  end
  
private  # ----------------------------------------


  
end
