class TasksController < ApplicationController
  layout "things"
  before_filter :login_or_oauth_required
  
  # GET /tasks
  # GET /tasks.xml
  def index
    @tasks = current_user.tasks.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @tasks }
    end
  end

  # GET /tasks/1
  # GET /tasks/1.xml
  def show
    @task = Task.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @task }
      format.js { render :layout => false }      
    end
  end

  # GET /tasks/new
  # GET /tasks/new.xml
  def new
    options = {} 
    options[:status_id] = Status.find_by_title(params[:page]).id if params[:page]
    @task = Task.new(options)

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @task }
      format.js { render :layout => false }
    end
  end

  # GET /tasks/1/edit
  def edit
    @task = Task.find(params[:id])
  end

  # POST /tasks
  # POST /tasks.xml
  def create
    @task = current_user.tasks.new(params[:task])

    respond_to do |format|
      if @task.save
        flash[:notice] = 'Task was successfully created.'
        format.html { redirect_to(@task) }
        format.xml  { render :xml => @task, :status => :created, :location => @task }
        format.js { render :action => "show", :layout => false}
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @task.errors, :status => :unprocessable_entity }
        format.js { render :text => "ERROR" + @task.errors.to_s }
      end
    end
  end

  # PUT /tasks/1
  # PUT /tasks/1.xml
  def update
    @task = Task.find(params[:id])

    respond_to do |format|
      if @task.update_attributes(params[:task])
        flash[:notice] = 'Task was successfully updated.'
        format.html { redirect_to(@task) }
        format.xml  { head :ok }
        format.js  { render :action => "show", :layout => false }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @task.errors, :status => :unprocessable_entity }
        format.js { render :text => "ERROR" + @task.errors.to_s }
      end
    end
  end

  # DELETE /tasks/1
  # DELETE /tasks/1.xml
  def destroy
    @task = Task.find(params[:id])
    @task.status_id = Status.find_by_title('trash').id
    @task.deleted_at = Time.now
    @task.save
    
    respond_to do |format|
      format.html { redirect_to(:back) }
      format.xml  { head :ok }
      format.js  { head :ok }
    end
  end

  def destroy_all
    ids = params[:task_ids].split(",")
    trash_id = Status.find_by_title('trash').id
    ids.each do |id|
      task = Task.find(id)
      task.update_attributes({ :status_id => trash_id , :deleted_at => Time.now  })
    end    
    respond_to do |format|
      format.html { redirect_to(:back) }
      format.xml  { head :ok }
      format.js  { head :ok }
    end
  end

  
  def done
    @task = Task.find(params[:id])
    respond_to do |format|
      if @task.update_attributes({ :done_at => Time.now })
        flash[:notice] = 'Task was successfully updated.'
        format.html { redirect_to(@task) }
        format.xml  { head :ok }
        format.js  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @task.errors, :status => :unprocessable_entity }
        format.js { render :text => "ERROR" + @task.errors.to_s }
      end
    end
  end

  def undone
    @task = Task.find(params[:id])
    respond_to do |format|
      if @task.update_attributes({ :done_at => nil })
        flash[:notice] = 'Task was successfully updated.'
        format.html { redirect_to(@task) }
        format.xml  { head :ok }
        format.js  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @task.errors, :status => :unprocessable_entity }
        format.js { render :text => "ERROR" + @task.errors.to_s }
      end
    end
  end
  
  def log
    ids = params[:task_ids].split(",")
    log_id = Status.find_by_title('done').id
    ids.each do |id|
      task = Task.find(id)
      task.update_attributes({ :status_id => log_id  })
    end
    respond_to do |format|
      format.html { redirect_to(:back) }
      format.xml  { head :ok }
      format.js  { head :ok }
    end
  end
  
  def moveto
    task = Task.find(params[:id])
    if task 
      if params[:page] =~ /p-(.+)/   # chaing the project_id
        task.update_attributes({ :project_id => $1.to_i  })
        task.update_attributes({ :status_id => Status.find_by_title("next").id  }) if task.status.title == "inbox"
      else  # changing the status_id
        target_status = Status.find_by_title(params[:page]).id
        task.update_attributes({ :status_id => target_status  })
        task.update_attributes({ :deleted_at => Time.now  }) if params[:page] == 'trash'
      end
    end

    respond_to do |format|
      if task
        flash[:notice] = 'Task was successfully updated.'
        format.html { redirect_to(:back) }
        format.xml  { head :ok }
        format.js  { head :ok }
      else
        flash[:notice] = 'There was a problem saving your actions, nothing saved!'
        format.html { redirect_to(:back) }
        format.xml  { render :xml => task.errors, :status => :unprocessable_entity }
        format.js { render :text => "ERROR" + task.errors.to_s }
      end
    end    
  end
  
end
