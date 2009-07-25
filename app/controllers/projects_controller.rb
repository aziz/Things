class ProjectsController < ApplicationController
  layout "things"
  before_filter :login_or_oauth_required, :sidebar_info

  # GET /projects
  # GET /projects.xml
  def index
    @projects = Project.all(:include => :tasks, :order => "created_at DESC")
    make_projects_taglist

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @projects }
      format.js   { render :layout => "main_content" }
    end
  end

  # GET /projects/1
  # GET /projects/1.xml
  def show
    @project = Project.find(params[:id], :include => :tasks )
    @tasks = @project.tasks.all(:order => "created_at DESC")
    @new_task = current_user.tasks.new(:status_id => 3, :project_id => @project.id , :title => "New To Do")
    make_taglist

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @project }
      format.js   { render :layout => "main_content" }
    end
  end

  # GET /projects/new
  # GET /projects/new.xml
  def new
    @project = Project.new( :title => "New Project")
    @new_task = current_user.tasks.new(:status_id => 3, :project_id => @project.id , :title => "New To Do")

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @project }
    end
  end

  # GET /projects/1/edit
  def edit
    @project = Project.find(params[:id])
  end

  # POST /projects
  # POST /projects.xml
  def create
    @project = current_user.projects.new(params[:project])

    respond_to do |format|
      if @project.save
        flash[:notice] = 'Project was successfully created.'
        format.html { redirect_to(@project) }
        format.xml  { render :xml => @project, :status => :created, :location => @project }
        format.js { render :partial => "/layouts/sidebar_item" , :layout => false, :locals => { :item => @project } }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @project.errors, :status => :unprocessable_entity }
        format.js  { render :text => "ERROR:" + @project.errors }
      end
    end
  end

  # PUT /projects/1
  # PUT /projects/1.xml
  def update
    @project = Project.find(params[:id])

    respond_to do |format|
      if @project.update_attributes(params[:project])
        flash[:notice] = 'Project was successfully updated.'
        format.html { redirect_to(@project) }
        format.xml  { head :ok }
        format.js { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @project.errors, :status => :unprocessable_entity }
        format.js  { render :text => "ERROR:" + @project.errors }
      end
    end
  end

  # DELETE /projects/1
  # DELETE /projects/1.xml
  def destroy
    @project = Project.find(params[:id])
    @project.destroy

    respond_to do |format|
      format.html { redirect_to(:back) }
      format.xml  { head :ok }
    end
  end

  def destroy_all
    ids = params[:task_ids].split(",")
    trash_id = Status.find_by_title('trash').id
    ids.each do |id|
      project = Project.find(id)
      project.update_attributes({ :status_id => trash_id , :deleted_at => Time.now  })
      project.tasks.each do |t|
        t.update_attributes({ :status_id => trash_id , :deleted_at => Time.now  })
      end
    end
    respond_to do |format|
      format.html { redirect_to(:back) }
      format.xml  { head :ok }
      format.js  { head :ok }
    end
  end


  def done
    @project = Project.find(params[:id])
    respond_to do |format|
      if @project.update_attributes({ :done_at => Time.now })
        @project.tasks.each do |t|
          t.update_attributes({ :done_at => Time.now })
        end
        flash[:notice] = 'Task was successfully updated.'
        format.html { redirect_to(@project) }
        format.xml  { head :ok }
        format.js  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @project.errors, :status => :unprocessable_entity }
        format.js { render :text => "ERROR" + @project.errors.to_s }
      end
    end
  end

  def undone
    @project = Project.find(params[:id])
    respond_to do |format|
      if @project.update_attributes({ :done_at => nil })
        @project.tasks.each do |t|
          t.update_attributes({ :done_at => nil })
        end
        flash[:notice] = 'Task was successfully updated.'
        format.html { redirect_to(@project) }
        format.xml  { head :ok }
        format.js  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @project.errors, :status => :unprocessable_entity }
        format.js { render :text => "ERROR" + @project.errors.to_s }
      end
    end
  end




end
